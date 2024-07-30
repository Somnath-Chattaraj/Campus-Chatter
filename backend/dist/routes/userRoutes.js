"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const router = express_1.default.Router();
router.route("/register").post(userControllers_1.registerUser);
router.route("/login").post(userControllers_1.loginUser);
router.route("/verify/:token").get(userControllers_1.verifyUser);
exports.default = router;
