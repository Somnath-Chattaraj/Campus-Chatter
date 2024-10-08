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
exports.editReview = exports.deleteReview = exports.getFullReview = exports.getBulkReviews = exports.filterReviews = exports.postReview = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
// import { checkModerationForString } from "../middleware/moderation";
// @ts-ignore
const postReview = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { review, rating, college, course: Ucourse, reviewForCollege, } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;
    if (!review || !rating || (!college && !Ucourse)) {
        return res.status(400).json({ message: "Required fields are missing" });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    try {
        const user = yield prisma_1.default.user.findFirst({
            where: { user_id },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { collegeEmailVerified, emailVerified } = user;
        if (!collegeEmailVerified || !emailVerified) {
            return res.status(403).json({
                message: "Please verify your college email to write a review",
            });
        }
        const courses = yield prisma_1.default.userCourse.findMany({
            select: {
                Course: {
                    select: {
                        course_id: true,
                        name: true,
                        isOnline: true,
                        College: {
                            select: {
                                college_id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            where: { user_id },
        });
        const findCourse = (condition) => {
            return courses.find(condition);
        };
        const createReview = (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield prisma_1.default.review.create({
                    data: reviewData,
                });
                return res.status(201).json({ message: "Review written successfully" });
            }
            catch (err) {
                console.error("Error creating review:", err);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
        if (reviewForCollege && college) {
            const course = findCourse((course) => { var _a; return ((_a = course.Course.College) === null || _a === void 0 ? void 0 : _a.name.toLowerCase()) === college.toLowerCase(); });
            if (course) {
                const courseCollegeId = (_a = course.Course.College) === null || _a === void 0 ? void 0 : _a.college_id;
                yield createReview({
                    user_id,
                    college_id: courseCollegeId,
                    rating,
                    review,
                    createdAt: new Date(),
                });
                return res.status(201).json({ message: "Review written for college" });
            }
            else {
                return res
                    .status(404)
                    .json({ message: "You were never enrolled in this college" });
            }
        }
        else if (!reviewForCollege && Ucourse) {
            const course = findCourse((course) => course.Course.name.toLowerCase() === Ucourse.toLowerCase());
            if (course) {
                const courseId = course.Course.course_id;
                yield createReview({
                    user_id,
                    course_id: courseId,
                    rating,
                    review,
                    createdAt: new Date(),
                });
                return res.status(201).json({ message: "Review written for course" });
            }
            else {
                return res
                    .status(404)
                    .json({ message: "You were never enrolled in this course" });
            }
        }
        else {
            return res.status(400).json({ message: "Invalid request" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.postReview = postReview;
// @ts-ignore
const getBulkReviews = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield prisma_1.default.review.findMany({
            select: {
                review_id: true,
                review: true,
                rating: true,
                createdAt: true,
                updatedAt: true,
                College: true,
                Course: true,
                User: {
                    select: {
                        email: true,
                        username: true,
                        userCourses: {
                            select: {
                                Course: {
                                    select: {
                                        name: true,
                                        College: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        user_id: true,
                    },
                },
            },
        });
        return res.status(200).json(reviews);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.getBulkReviews = getBulkReviews;
// @ts-ignore
const filterReviews = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== "string") {
        return res
            .status(400)
            .send("Keyword query parameter is required and should be a string");
    }
    try {
        const reviews = yield prisma_1.default.review.findMany({
            where: {
                OR: [
                    {
                        College: {
                            name: {
                                contains: keyword,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        Course: {
                            name: {
                                contains: keyword,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            },
            select: {
                review_id: true,
                review: true,
                rating: true,
                createdAt: true,
                updatedAt: true,
                College: true,
                Course: true,
                User: true,
            },
        });
        res.json(reviews);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching reviews");
    }
}));
exports.filterReviews = filterReviews;
// @ts-ignore
const getFullReview = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const review = yield prisma_1.default.review.findFirst({
        where: {
            review_id: reviewId,
        },
        select: {
            review_id: true,
            review: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
            College: true,
            Course: true,
            User: {
                select: {
                    email: true,
                    username: true,
                    userCourses: {
                        select: {
                            Course: {
                                select: {
                                    name: true,
                                    College: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    reviews: true,
                },
            },
        }
    });
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    try {
        return res.status(200).json(review);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.getFullReview = getFullReview;
// @ts-ignore
const deleteReview = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    // @ts-ignore
    const user_id = req.user.user_id;
    const review = yield prisma_1.default.review.findFirst({
        where: {
            review_id: reviewId,
            user_id,
        },
    });
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    try {
        yield prisma_1.default.review.delete({
            where: {
                review_id: reviewId,
                user_id,
            },
        });
        return res.status(200).json({ message: "Review deleted" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.deleteReview = deleteReview;
// @ts-ignore
const editReview = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const { rating, updateReview } = req.body;
    // @ts-ignore
    const user_id = req.user.user_id;
    const review = yield prisma_1.default.review.findFirst({
        where: {
            review_id: reviewId,
            user_id,
        },
    });
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    try {
        yield prisma_1.default.review.update({
            where: {
                review_id: reviewId,
                user_id,
            },
            data: {
                rating,
                review: updateReview,
                updatedAt: new Date(),
            },
        });
        return res.status(200).json({ message: "Review updated" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.editReview = editReview;
