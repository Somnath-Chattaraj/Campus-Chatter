"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const postsRoutes = express_1.default.Router();
postsRoutes.get("/communities", checkAuth_1.default, postController_1.getCommunities);
postsRoutes.post("/create", checkAuth_1.default, postController_1.createPost);
exports.default = postsRoutes;
