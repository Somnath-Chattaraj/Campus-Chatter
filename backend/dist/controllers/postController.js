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
exports.createPost = exports.getCommunities = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
// @ts-ignore
const getCommunities = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user_id = req.user.user_id;
    // return res.status(200).json({ message: "Communities fetched" });
    const communities = yield prisma_1.default.userCourse.findMany({
        where: {
            user_id: user_id,
        },
        select: {
            college_id: true,
        },
        distinct: ["college_id"],
    });
    return res.status(200).json({ communities });
}));
exports.getCommunities = getCommunities;
// @ts-ignore
const createPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, collegeId } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;
    if (!title || !content || !collegeId) {
        return res.status(400).json({ message: "Required fields are missing" });
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { user_id },
    });
    if (!user) {
        return res.status(404).json({ message: "User not recognized" });
    }
    const post = yield prisma_1.default.post.create({
        // @ts-ignore
        data: {
            title,
            content,
            user_id,
        },
    });
    return res.status(201).json({ post });
}));
exports.createPost = createPost;
