import express from "express";
import { calAvgRating } from "../controllers/ratingController";

const router = express.Router();

router.route("/rating").get(calAvgRating);

export default router;
