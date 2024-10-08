"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routeControllers_1 = require("../controllers/routeControllers");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const roomRouter = express_1.default.Router();
roomRouter.get("/", checkAuth_1.default, routeControllers_1.searchRoom);
exports.default = roomRouter;
