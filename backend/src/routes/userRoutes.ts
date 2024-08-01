import express from "express";
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  getCurrentUserDetails,
  getUserDetailsById
} from "../controllers/userControllers";
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify/:token").get(verifyUser);
router.get("/me", checkAuth, getCurrentUserDetails); // get the user details of the current user
router.get("/get/:userId", checkAuth, getUserDetailsById); // get the user details of a specific user
export default router;
