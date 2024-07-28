import express from "express";
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
} from "../controllers/userControllers";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify/:token").get(verifyUser);

export default router;
