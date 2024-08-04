import express from "express";
import {checkModeration} from "../middleware/moderation"
const router = express.Router();
router.post("/reviews/approve",checkModeration);
export default router;