import express from "express";
import { calAvgRating } from "../controllers/ratingController";

const router = express.Router();

router.route("/").get(calAvgRating);

export default router;
