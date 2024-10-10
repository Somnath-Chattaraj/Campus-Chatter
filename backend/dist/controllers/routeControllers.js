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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoom = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const searchRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user_id = req.user.user_id;
    const rooms = yield prisma_1.default.chatRoom.findMany({
        select: {
            id: true,
            users: {
                select: {
                    user_id: true,
                    username: true
                }
            }
        }
    });
    const updateArray = rooms.map((room) => {
        const otherUsers = room.users.filter((user) => user.user_id != user_id);
        return {
            roomId: room.id,
            usernames: otherUsers.map((user) => user.username)
        };
    });
    res.status(200).json(updateArray);
}));
exports.searchRoom = searchRoom;
