// src/routes/chatRoutes.ts
import express from 'express';
import { listChatRooms, getChatRoomDetails, getChatHistory } from '../controllers/chatControllers';
import checkAuth from "../middleware/checkAuth";
const router = express.Router();

//router.get('/rooms', checkAuth, listChatRooms);
//router.get('/rooms/:roomId', checkAuth, getChatRoomDetails);
//router.get('/history/:roomId', checkAuth, getChatHistory);
router.get('/history/:roomId',  getChatHistory);
router.get('/rooms/:roomId',  getChatRoomDetails);
router.get('/rooms',  listChatRooms);

export default router;
