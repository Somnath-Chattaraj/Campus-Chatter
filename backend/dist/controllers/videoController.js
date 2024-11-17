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
exports.deleteRoom = exports.createRoom = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.createRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const username = req.user.username;
    const video = yield prisma_1.default.video.findUnique({
        where: {
            video_id: username,
        },
    });
    if (video) {
        res.status(205).json({ message: "Room already exists" });
        return;
    }
    const response = yield axios_1.default.post("https://api.daily.co/v1/rooms", {
        properties: { enable_chat: true, enable_screenshare: true },
        name: username,
    }, { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } });
    if (!response.data) {
        res.status(400);
        throw new Error("Invalid data");
    }
    const url = response.data.url;
    const video_id = response.data.name;
    //@ts-ignore
    const user_id = req.user.user_id;
    yield prisma_1.default.video.create({
        data: {
            video_id,
            url,
            user_id,
        },
    });
    res.status(201).json(response.data);
}));
exports.deleteRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { video_id } = req.body;
    if (!video_id) {
        res.status(400);
        throw new Error("Invalid data");
    }
    const video = yield prisma_1.default.video.findUnique({
        where: {
            video_id,
        },
        select: {
            user_id: true,
        },
    });
    //@ts-ignore
    const user_id = req.user.user_id;
    if ((video === null || video === void 0 ? void 0 : video.user_id) !== user_id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    yield axios_1.default.delete(`https://api.daily.co/v1/rooms/${video_id}`, {
        headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
    });
    yield prisma_1.default.video.delete({
        where: {
            video_id,
        },
    });
    res.status(200).json({ message: "Room deleted" });
}));
