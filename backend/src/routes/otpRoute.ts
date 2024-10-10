import express from "express";
import { calAvgRating } from "../controllers/ratingController";
import { changePassword, otpGenerator, verifyOtp } from "../controllers/otpController";

const Otprouter = express.Router();

Otprouter.post('/' ,otpGenerator);
Otprouter.post('/verify',verifyOtp);
Otprouter.post('/change', changePassword);
export default Otprouter;
