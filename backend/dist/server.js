"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const wss = new ws_1.Server({ port: 8080 });
let clientCount = 0;
// Map to track which rooms each client is in
const clientRoomMap = new Map(); // WebSocket -> Set of room IDs
wss.on('connection', (ws) => {
    const clientId = ++clientCount; // Increment and get the client ID
    console.log(`Client${clientId} connected`);
    // Initialize client-room mapping
    clientRoomMap.set(ws, new Set());
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { type, data } = JSON.parse(message.toString()); // data will contain roomId, userId, targetUserId, and message
        // type will contain 'createRoom', 'joinRoom', 'sendMessage'
        switch (type) {
            case 'createRoom':
                try {
                    // Create a new chat room
                    const newRoom = yield prisma.chatRoom.create({
                        data: {
                            users: {
                                connect: [{ user_id: data.userId }, { user_id: data.targetUserId }]
                            }
                        }
                    });
                    // Update client-room mapping for new room
                    // @ts-ignore: clientRoomMap is a Map<WebSocket, Set<number>>
                    (_a = clientRoomMap.get(ws)) === null || _a === void 0 ? void 0 : _a.add(newRoom.id);
                    ws.send(JSON.stringify({ type: 'roomCreated', data: { roomId: newRoom.id } }));
                }
                catch (error) {
                    ws.send(JSON.stringify({ type: 'error', data: { message: 'Failed to create or join chat room' } }));
                }
                break;
            case 'joinRoom':
                try {
                    yield prisma.chatRoom.update({
                        where: { id: data.roomId },
                        data: {
                            users: {
                                connect: [{ user_id: data.userId }]
                            }
                        }
                    });
                    // Update client-room mapping for the joined room
                    const rooms = clientRoomMap.get(ws);
                    rooms === null || rooms === void 0 ? void 0 : rooms.add(data.roomId);
                    ws.send(JSON.stringify({ type: 'roomJoined', data: { roomId: data.roomId } }));
                    // Notify other clients in the room about the new join
                    wss.clients.forEach(client => {
                        if (client.readyState === ws_1.default.OPEN && client !== ws) {
                            const clientRooms = clientRoomMap.get(client);
                            if (clientRooms === null || clientRooms === void 0 ? void 0 : clientRooms.has(data.roomId)) {
                                client.send(JSON.stringify({ type: 'newClientJoined', data: { roomId: data.roomId, message: `Client${clientId} joined` } }));
                            }
                        }
                    });
                }
                catch (error) {
                    ws.send(JSON.stringify({ type: 'error', data: { message: 'Failed to join chat room' } }));
                }
                break;
            case 'sendMessage':
                try {
                    const newMessage = yield prisma.message.create({
                        data: {
                            content: data.message,
                            sender: { connect: { user_id: data.userId } },
                            chatRoom: { connect: { id: data.roomId } },
                        }
                    });
                    // Broadcast the message to all clients in the room
                    wss.clients.forEach(client => {
                        if (client.readyState === ws_1.default.OPEN) {
                            const rooms = clientRoomMap.get(client);
                            if (rooms === null || rooms === void 0 ? void 0 : rooms.has(data.roomId)) {
                                client.send(JSON.stringify({ type: 'newMessage', data: { roomId: data.roomId, message: newMessage } }));
                            }
                        }
                    });
                }
                catch (error) {
                    ws.send(JSON.stringify({ type: 'error', data: { message: 'Failed to send message' } }));
                }
                break;
            default:
                ws.send(JSON.stringify({ type: 'error', data: { message: 'Invalid message type' } }));
                break;
        }
    }));
    ws.on('close', () => {
        console.log(`Client${clientId} disconnected`);
        // Retrieve the rooms the client was part of
        const rooms = clientRoomMap.get(ws);
        if (rooms) {
            rooms.forEach(roomId => {
                // Broadcast the disconnect message to all clients in the room
                wss.clients.forEach(client => {
                    if (client.readyState === ws_1.default.OPEN && client !== ws) {
                        const clientRooms = clientRoomMap.get(client);
                        if (clientRooms === null || clientRooms === void 0 ? void 0 : clientRooms.has(roomId)) {
                            client.send(JSON.stringify({ type: 'clientDisconnected', data: { roomId, message: `Client${clientId} disconnected` } }));
                        }
                    }
                });
            });
        }
        // Remove client from all rooms
        clientRoomMap.delete(ws);
    });
});
exports.default = wss;
