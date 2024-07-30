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
exports.calAvgRating = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
// @ts-ignore
const calAvgRating = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { college } = req.body;
    if (!college || typeof college !== "string") {
        return res.status(400).json({ message: "Invalid request" });
    }
    try {
        const reviews = yield prisma_1.default.review.findMany({
            where: {
                College: {
                    name: {
                        contains: college,
                        mode: "insensitive",
                    },
                },
            },
            select: {
                rating: true,
                review: true,
            },
        });
        let avgRating = 0;
        let count = 0;
        for (const review of reviews) {
            avgRating += review.rating;
            count++;
        }
        avgRating /= count;
        res.status(200).json({ avgRating });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.calAvgRating = calAvgRating;
