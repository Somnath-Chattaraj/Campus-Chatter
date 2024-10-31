import express from "express";
import checkAuth from "../middleware/checkAuth";
import { createRoom, deleteRoom } from "../controllers/videoController";
import rateLimiter from "../middleware/rateLimit";

const router = express.Router();

router.post("/createroom", checkAuth, rateLimiter, createRoom);
router.delete("/deleteroom", checkAuth, rateLimiter, deleteRoom);

export default router;
