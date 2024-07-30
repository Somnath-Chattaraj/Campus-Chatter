import express from "express";
import moderation from "../middleware/moderation.js"
const router = express.Router();
router.post("/reviews/approve",moderation);
export default router;