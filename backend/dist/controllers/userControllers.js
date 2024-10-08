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
exports.addDetailsToUser = exports.githubSignInOrSignUp = exports.googleSignInOrSignUp = exports.addCourseToUser = exports.getUserDetailsById = exports.getCurrentUserDetails = exports.verifyUser = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendMail_1 = __importDefault(require("../mail/sendMail"));
const academic_email_verifier_1 = require("academic-email-verifier");
const checkAcademic_1 = __importDefault(require("../mail/checkAcademic"));
const googleSignInOrSignUp = (0, express_async_handler_1.default)(
//@ts-ignore
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, displayName } = req.body;
    if (!process.env.SECRET) {
        throw new Error("Secret not found");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        let isCollegeEmail;
        if ((0, checkAcademic_1.default)(email)) {
            isCollegeEmail = true;
        }
        else {
            isCollegeEmail = yield academic_email_verifier_1.Verifier.isAcademic(email);
        }
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                name: displayName,
                collegeEmailVerified: isCollegeEmail,
                emailVerified: true,
            },
        });
        const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
        const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
        res.cookie("Authorization", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        const userId = user.user_id;
        return res.status(201).json({ isCollegeEmail, userId });
    }
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const isCollegeEmail = false;
    const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
    res.cookie("Authorization", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({ isCollegeEmail });
}));
exports.googleSignInOrSignUp = googleSignInOrSignUp;
const githubSignInOrSignUp = (0, express_async_handler_1.default)(
//@ts-ignore
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, displayName } = req.body;
    if (!process.env.SECRET) {
        throw new Error("Secret not found");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!displayName) {
        displayName = email.split("@")[0];
    }
    if (!user) {
        let isCollegeEmail;
        if ((0, checkAcademic_1.default)(email)) {
            isCollegeEmail = true;
        }
        else {
            isCollegeEmail = yield academic_email_verifier_1.Verifier.isAcademic(email);
        }
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                name: displayName,
                collegeEmailVerified: isCollegeEmail,
                emailVerified: true,
            },
        });
        const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
        const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
        res.cookie("Authorization", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        return res.status(201).json({ isCollegeEmail });
    }
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const isCollegeEmail = false;
    const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
    res.cookie("Authorization", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({ isCollegeEmail });
}));
exports.githubSignInOrSignUp = githubSignInOrSignUp;
// @ts-ignore
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, collegeName, courseName, isOnline, location } = req.body;
    if (!process.env.SECRET) {
        throw new Error("Secret not found");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 8);
    if (!email || !name || !password) {
        res.status(400).json({ message: "Please provide all fields" });
        return;
    }
    const userExists = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (userExists) {
        res.status(409).json({ message: "User already exists" });
        return;
    }
    let isCollegeEmail;
    if ((0, checkAcademic_1.default)(email)) {
        isCollegeEmail = true;
    }
    else {
        isCollegeEmail = yield academic_email_verifier_1.Verifier.isAcademic(email);
    }
    if (isCollegeEmail == true) {
        if (!courseName || !collegeName || !location || isOnline === undefined) {
            return res.status(400).json({ message: "Please provide all fields" });
        }
        let college = yield prisma_1.default.college.findFirst({
            where: {
                name: collegeName,
            },
        });
        if (!college) {
            college = yield prisma_1.default.college.create({
                data: {
                    name: collegeName,
                    location,
                },
            });
        }
        const college_id = college.college_id;
        let course = yield prisma_1.default.course.findFirst({
            where: {
                name: courseName,
            },
        });
        let course_id;
        if (course) {
            course_id = course.course_id;
        }
        else {
            course = yield prisma_1.default.course.create({
                data: {
                    name: courseName,
                    college_id,
                    isOnline,
                },
            });
            course_id = course.course_id;
        }
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                collegeEmailVerified: true,
            },
        });
        const userCourse = yield prisma_1.default.userCourse.create({
            data: {
                user_id: user.user_id,
                course_id,
                college_id,
            },
        });
        const exp = Date.now() + 1000 * 60 * 5;
        const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
        const url = `${process.env.BACKEND_URL}/api/user/verify/${token}`;
        const htmlContent = `<a href="${url}">Verify using this link</a>`;
        (0, sendMail_1.default)(htmlContent, email);
        res.status(201).json({ message: "User created" });
    }
    else {
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                collegeEmailVerified: false,
            },
        });
        const exp = Date.now() + 1000 * 60 * 5;
        const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
        const url = `${process.env.BACKEND_URL}/api/user/verify/${token}`;
        const htmlContent = `<a href="${url}">Verify using this link</a>`;
        (0, sendMail_1.default)(htmlContent, email);
        res.status(201).json({ message: "User created" });
    }
}));
exports.registerUser = registerUser;
const verifyUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    if (!token) {
        res.status(400).json({ message: "Invalid token" });
        return;
    }
    // @ts-ignore
    const { sub, exp } = jsonwebtoken_1.default.verify(token, process.env.SECRET);
    // @ts-ignore
    if (exp < Date.now()) {
        res.status(400).json({ message: "Token expired" });
        return;
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            user_id: sub,
        },
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (user.emailVerified) {
        res.status(400).json({ message: "User already verified" });
        return;
    }
    yield prisma_1.default.user.update({
        where: {
            user_id: sub,
        },
        data: {
            emailVerified: true,
        },
    });
    res.status(200).json({ message: "User verified" });
}));
exports.verifyUser = verifyUser;
const loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!process.env.SECRET) {
        throw new Error("Secret not found");
    }
    if (!email || !password) {
        res.status(400).json({ message: "Please provide all fields" });
        return;
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (!user.password) {
        res.status(401).json({ message: "Logged in with Google Or Github" });
        return;
    }
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
    res.cookie("Authorization", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({ message: "User logged in" });
}));
exports.loginUser = loginUser;
const getCurrentUserDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            // @ts-ignore
            user_id: req.user.user_id,
        },
        select: {
            user_id: true,
            email: true,
            name: true,
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
            chatRooms: true,
        },
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json(user);
}));
exports.getCurrentUserDetails = getCurrentUserDetails;
const getUserDetailsById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            user_id: userId,
        },
        select: {
            email: true,
            name: true,
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
            chatRooms: true,
        },
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json(user);
}));
exports.getUserDetailsById = getUserDetailsById;
// @ts-ignore
const addCourseToUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseName, collegeName, isOnline, location } = req.body;
    if (!courseName || !collegeName || !location || isOnline === undefined) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    // @ts-ignore
    const userId = req.user.user_id;
    let college = yield prisma_1.default.college.findFirst({
        where: {
            name: collegeName,
        },
    });
    if (!college) {
        college = yield prisma_1.default.college.create({
            data: {
                name: collegeName,
                location,
            },
        });
    }
    const college_id = college.college_id;
    let course = yield prisma_1.default.course.findFirst({
        where: {
            name: courseName,
        },
    });
    let course_id;
    if (course) {
        course_id = course.course_id;
    }
    else {
        course = yield prisma_1.default.course.create({
            data: {
                name: courseName,
                college_id,
                isOnline,
            },
        });
        course_id = course.course_id;
    }
    yield prisma_1.default.userCourse.create({
        data: {
            user_id: userId,
            course_id,
            college_id,
        },
    });
    res.status(201).json({ message: "Course added to user" });
}));
exports.addCourseToUser = addCourseToUser;
// @ts-ignore
const addDetailsToUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collegeName, courseName, isOnline, location, id } = req.body;
    if (!collegeName || !courseName || !location || isOnline === undefined) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    let college = yield prisma_1.default.college.findFirst({
        where: {
            name: collegeName,
        },
    });
    if (!college) {
        college = yield prisma_1.default.college.create({
            data: {
                name: collegeName,
                location,
            },
        });
    }
    const college_id = college.college_id;
    let course = yield prisma_1.default.course.findFirst({
        where: {
            name: courseName,
        },
    });
    let course_id;
    if (course) {
        course_id = course.course_id;
    }
    else {
        course = yield prisma_1.default.course.create({
            data: {
                name: courseName,
                college_id,
                isOnline,
            },
        });
        course_id = course.course_id;
    }
    yield prisma_1.default.userCourse.create({
        data: {
            user_id: id,
            course_id,
            college_id,
        },
    });
    res.status(201).json({ message: "Course added to user" });
}));
exports.addDetailsToUser = addDetailsToUser;
