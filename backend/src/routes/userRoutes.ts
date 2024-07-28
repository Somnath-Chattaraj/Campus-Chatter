import express from "express";
import { Request, Response } from "express";
import { registerUser } from "../controllers/userControllers";

const router = express.Router();

router.route("/register").post(registerUser);

export default router;
