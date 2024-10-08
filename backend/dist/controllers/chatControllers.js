"use strict";
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
exports.getChatRoomDetails = exports.listChatRooms = exports.getChatHistory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    try {
        const messages = yield prisma.message.findMany({
            where: { chatRoomId: roomId },
            include: {
                sender: {
                    select: { user_id: true, username: true }
                }
            },
            orderBy: { timestamp: 'asc' }
        });
        const messageFormat = messages.map((message) => ({
            senderId: message.sender.user_id,
            message: message.content,
            at: message.timestamp,
        }));
        // Send the formatted messages as a JSON response
        res.json(messageFormat);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat history' });
    }
});
exports.getChatHistory = getChatHistory;
const listChatRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.body;
    try {
        const chatRooms = yield prisma.chatRoom.findMany({
            where: {
                users: {
                    some: { user_id: userId }
                }
            },
            select: {
                id: true, // roomId
                users: {
                    select: {
                        user_id: true,
                        username: true
                    }
                }
            }
        });
        res.json(chatRooms);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat rooms' });
    }
});
exports.listChatRooms = listChatRooms;
const getChatRoomDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    try {
        const chatRoom = yield prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: {
                users: {
                    select: { user_id: true, username: true }
                }
            }
        });
        if (chatRoom) {
            res.json(chatRoom);
        }
        else {
            res.status(404).json({ error: 'Chat room not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat room details' });
    }
});
exports.getChatRoomDetails = getChatRoomDetails;
