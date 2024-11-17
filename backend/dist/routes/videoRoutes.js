"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const videoController_1 = require("../controllers/videoController");
const rateLimit_1 = __importDefault(require("../middleware/rateLimit"));
const router = express_1.default.Router();
router.post("/createroom", checkAuth_1.default, rateLimit_1.default, videoController_1.createRoom);
router.delete("/deleteroom", checkAuth_1.default, rateLimit_1.default, videoController_1.deleteRoom);
exports.default = router;
