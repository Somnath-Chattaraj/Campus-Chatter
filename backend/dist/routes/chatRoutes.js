"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/chatRoutes.ts
const express_1 = __importDefault(require("express"));
const chatControllers_1 = require("../controllers/chatControllers");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const router = express_1.default.Router();
router.get('/rooms', checkAuth_1.default, chatControllers_1.listChatRooms);
router.get('/rooms/:roomId', checkAuth_1.default, chatControllers_1.getChatRoomDetails);
router.get('/history/:roomId', checkAuth_1.default, chatControllers_1.getChatHistory);
exports.default = router;
