"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otpController_1 = require("../controllers/otpController");
const Otprouter = express_1.default.Router();
Otprouter.post('/', otpController_1.otpGenerator);
Otprouter.post('/verify', otpController_1.verifyOtp);
Otprouter.post('/change', otpController_1.changePassword);
exports.default = Otprouter;
