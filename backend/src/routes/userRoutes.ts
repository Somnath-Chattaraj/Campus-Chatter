import express from "express";
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  getCurrentUserDetails,
  getUserDetailsById,
  addCourseToUser,
  googleSignInOrSignUp,
  githubSignInOrSignUp,
  addDetailsToUser,
} from "../controllers/userControllers";
import checkAuth from "../middleware/checkAuth";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify/:token").get(verifyUser);
router.get("/me", checkAuth, getCurrentUserDetails); // get the user details of the current user
router.get("/get/:userId", checkAuth, getUserDetailsById); // get the user details of a specific user
router.post("/addcourse", checkAuth, addCourseToUser); // add a course to the current user
router.post("/google", googleSignInOrSignUp); // sign in or sign up using google
router.post("/github", githubSignInOrSignUp); // sign in or sign up using github
router.post("/addDetails", checkAuth, addDetailsToUser); // add details to the current user

export default router;
