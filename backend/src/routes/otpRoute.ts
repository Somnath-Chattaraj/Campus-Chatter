import express from "express";
import { calAvgRating } from "../controllers/ratingController";
import { otpGenerator, verifyOtp } from "../controllers/otpController";
import checkAuth from "../middleware/checkAuth";

export const Otprouter = express.Router();

Otprouter.post('/', checkAuth ,otpGenerator);
Otprouter.get('/verify', checkAuth,verifyOtp);

