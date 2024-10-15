"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.verifyOtp = exports.otpGenerator = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendMail_1 = __importDefault(require("../mail/sendMail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.otpGenerator = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const otpCode = otp_generator_1.default.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
    });
    try {
        const user = yield prisma_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.emailVerified) {
            return res.status(400).json({ message: "Email not verified" });
        }
        const response = yield prisma_1.default.otp.create({
            data: {
                otp: otpCode,
                user: {
                    connect: {
                        email,
                    },
                },
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        const htmlContent = `<h1>Your OTP is ${otpCode}</h1>`;
        yield (0, sendMail_1.default)(htmlContent, email);
        res
            .status(200)
            .json({ message: "OTP generated successfully and email sent" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in generating OTP" });
    }
}));
exports.verifyOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, email } = req.body;
    try {
        const otpData = yield prisma_1.default.otp.findFirst({
            where: {
                otp: otp,
                user: {
                    email,
                },
                expiresAt: {
                    gte: new Date(),
                },
            },
        });
        if (otpData === null) {
            return res.status(404).json({ message: "Invalid OTP" });
        }
        res.status(200).json({ message: "OTP verified successfully" });
        // await prisma.otp.delete({
        //   where: {
        //     id: otpData.id,
        //   },
        // });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in verifying OTP" });
    }
}));
exports.changePassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 8);
    try {
        const response = yield prisma_1.default.user.update({
            where: {
                email,
            },
            data: {
                password: hashedPassword,
            },
        });
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in changing password" });
    }
}));
