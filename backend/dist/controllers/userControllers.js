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
exports.updateDetails = exports.logOut = exports.getAllUser = exports.addUsername = exports.addDetailsToUser = exports.githubSignInOrSignUp = exports.googleSignInOrSignUp = exports.addCourseToUser = exports.getUserDetailsById = exports.getCurrentUserDetails = exports.verifyUser = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendMail_1 = __importDefault(require("../mail/sendMail"));
const academic_email_verifier_1 = require("academic-email-verifier");
const checkAcademic_1 = __importDefault(require("../mail/checkAcademic"));
const registerSchema_1 = require("../validation/registerSchema");
const redis_1 = __importDefault(require("../lib/redis"));
const redis_2 = require("../lib/redis");
const axios_1 = __importDefault(require("axios"));
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
        const username = null;
        return res.status(201).json({ isCollegeEmail, userId, username });
    }
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const isCollegeEmail = false;
    const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
    res.cookie("Authorization", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    const username = user.username;
    const userId = user.user_id;
    res.status(200).json({ isCollegeEmail, username, userId });
}));
exports.googleSignInOrSignUp = googleSignInOrSignUp;
const githubSignInOrSignUp = (0, express_async_handler_1.default)(
//@ts-ignore
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = req.body;
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
        const username = null;
        return res.status(201).json({ isCollegeEmail, userId, username });
    }
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const isCollegeEmail = false;
    const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
    res.cookie("Authorization", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    const username = user.username;
    res.status(200).json({ isCollegeEmail, username });
}));
exports.githubSignInOrSignUp = githubSignInOrSignUp;
// @ts-ignore
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, collegeName, courseName, isOnline, location, captchaToken, } = req.body;
    if (!process.env.SECRET) {
        throw new Error("Secret not found");
    }
    const response = yield axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
        params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken,
        },
    });
    const { success } = response.data;
    if (!success) {
        return res.status(400).json({ error: "Invalid captcha" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 8);
    if (!email || !username || !password || !captchaToken) {
        res.status(400).json({ message: "Please provide all fields" });
        return;
    }
    if (registerSchema_1.registerSchema.safeParse(req.body).success === false) {
        res.status(400).json({ message: registerSchema_1.registerSchema.safeParse(req.body).error });
        return;
    }
    const userExists = yield prisma_1.default.user.findFirst({
        where: {
            OR: [{ email: email }, { username: username }],
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
                username,
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
                username,
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
const resendURL = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
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
}));
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
        res
            .status(400)
            .json({ message: "Token expired. Login to verify your email" });
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
    if (!user.emailVerified) {
        const exp = Date.now() + 1000 * 60 * 5;
        // @ts-ignore
        const token = jsonwebtoken_1.default.sign({ sub: user.user_id, exp }, process.env.SECRET);
        const url = `${process.env.BACKEND_URL}/api/user/verify/${token}`;
        const htmlContent = `<a href="${url}">Verify using this link</a>`;
        (0, sendMail_1.default)(htmlContent, email);
        res.status(201).json({ message: "Email Sent" });
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
            username: true,
            pic: true,
            collegeEmailVerified: true,
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
const addUsername = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, id } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    const response = yield prisma_1.default.user.findFirst({
        where: {
            OR: [{ username: username }],
        },
    });
    const user1 = yield prisma_1.default.user.findUnique({
        where: {
            user_id: id,
        },
    });
    if (!user1) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user1.username) {
        return res
            .status(409)
            .json({ message: "You are not authorized to change the username" });
    }
    if (response) {
        return res.status(409).json({ message: "Username already exists" });
    }
    yield prisma_1.default.user.update({
        where: {
            user_id: id,
        },
        data: {
            username,
        },
    });
    res.status(201).json({ message: "Username updated" });
}));
exports.addUsername = addUsername;
// @ts-ignore
const addDetailsToUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, collegeName, courseName, isOnline, location, id } = req.body;
    if (!collegeName ||
        !courseName ||
        !location ||
        isOnline === undefined ||
        !username) {
        return res.status(400).json({ message: "Please provide all fields" });
    }
    const user = yield prisma_1.default.user.findFirst({
        where: {
            OR: [{ username: username }],
        },
    });
    const user1 = yield prisma_1.default.user.findUnique({
        where: {
            user_id: id,
        },
    });
    if (!user1) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user1.username) {
        return res
            .status(409)
            .json({ message: "You are not authorized to change the username" });
    }
    if (user) {
        return res.status(409).json({ message: "Username already exists" });
    }
    yield prisma_1.default.user.update({
        where: {
            user_id: id,
        },
        data: {
            username,
        },
    });
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
const getAllUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        select: {
            user_id: true,
            username: true,
        },
    });
    res.status(200).json(users);
}));
exports.getAllUser = getAllUser;
const logOut = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("Authorization");
    res.status(200).json({ message: "Logged out" });
}));
exports.logOut = logOut;
// @ts-ignore
const updateDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.user.user_id;
    let { username, pic } = req.body;
    if (!username) {
        // @ts-ignore
        username = req.user.username;
    }
    if (!pic) {
        // @ts-ignore
        pic = req.user.pic;
    }
    // @ts-ignore
    if (username !== req.user.username) {
        const response = yield prisma_1.default.user.findFirst({
            where: {
                OR: [{ username: username }],
            },
        });
        if (response) {
            return res.status(409).json({ message: "Username already exists" });
        }
    }
    if (!pic) {
        // @ts-ignore
        pic = req.user.pic;
    }
    yield prisma_1.default.user.update({
        where: {
            user_id: userId,
        },
        data: {
            username,
            // @ts-ignore
            pic,
        },
    });
    const college = yield prisma_1.default.userCourse.findFirst({
        where: {
            user_id: userId,
        },
        select: {
            college_id: true,
        },
    });
    if (!college) {
        return res.status(404).json({ message: "User not found" });
    }
    yield redis_1.default.del(`user:${userId}`);
    yield (0, redis_2.deleteCachedPosts)(college.college_id);
    return res.status(200).json({ message: "Details updated" });
}));
exports.updateDetails = updateDetails;
