"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    email: zod_1.default.string().email({ message: "Invalid email address " }),
    username: zod_1.default
        .string()
        .min(3, { message: "Username must be at least 3 characters long " }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long. " })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character ",
    }),
    collegeName: zod_1.default.string().optional(),
    courseName: zod_1.default.string().optional(),
    isOnline: zod_1.default.boolean(),
    location: zod_1.default.string().optional(),
});
