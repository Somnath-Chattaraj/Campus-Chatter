"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/chatRoutes.ts
const express_1 = __importDefault(require("express"));
const chatControllers_1 = require("../controllers/chatControllers");
const router = express_1.default.Router();
//router.get('/rooms', checkAuth, listChatRooms);
//router.get('/rooms/:roomId', checkAuth, getChatRoomDetails);
//router.get('/history/:roomId', checkAuth, getChatHistory);
router.get('/history/:roomId', chatControllers_1.getChatHistory);
router.get('/rooms/:roomId', chatControllers_1.getChatRoomDetails);
router.get('/rooms', chatControllers_1.listChatRooms);
exports.default = router;
