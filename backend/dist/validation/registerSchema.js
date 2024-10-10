"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address " }),
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters long " }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long. " })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character ",
    }),
    collegeName: zod_1.z.string().optional(),
    courseName: zod_1.z.string().optional(),
    isOnline: zod_1.z.boolean(),
    location: zod_1.z.string().optional(),
});
