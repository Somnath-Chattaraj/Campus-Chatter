"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const router = express_1.default.Router();
router.route("/register").post(userControllers_1.registerUser);
router.route("/login").post(userControllers_1.loginUser);
router.route("/verify/:token").get(userControllers_1.verifyUser);
router.get("/me", checkAuth_1.default, userControllers_1.getCurrentUserDetails); // get the user details of the current user
// router.get("/get/:userId", checkAuth, getUserDetailsById); // get the user details of a specific user
router.post("/addcourse", checkAuth_1.default, userControllers_1.addCourseToUser); // add a course to the current user
router.post("/google", userControllers_1.googleSignInOrSignUp); // sign in or sign up using google
router.post("/github", userControllers_1.githubSignInOrSignUp); // sign in or sign up using github
router.post("/addDetails", userControllers_1.addDetailsToUser); // add details to the current user
router.post("/addusername", userControllers_1.addUsername); // change the username of the current user
router.get('/all', userControllers_1.getAllUser);
exports.default = router;
