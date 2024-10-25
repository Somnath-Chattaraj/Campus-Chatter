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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error("REDIS_URL is not defined");
}
const redis = new ioredis_1.default(redisUrl);
const MAX_REQUESTS = 100;
const WINDOW_SIZE_IN_SECONDS = 60;
const rateLimiter = (0, express_async_handler_1.default)(
//@ts-ignore
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const clientIp = req.user.user_id;
    // console.log(clientIp);
    const key = `rate-limit:${clientIp}`;
    const requestCount = yield redis.get(key);
    if (requestCount && parseInt(requestCount) >= MAX_REQUESTS) {
        return res
            .status(429)
            .json({ message: "Too many requests, please try again later." });
    }
    const ttl = yield redis.ttl(key);
    if (ttl < 0) {
        yield redis.set(key, 1, "EX", WINDOW_SIZE_IN_SECONDS);
    }
    else {
        yield redis.incr(key);
    }
    next();
}));
exports.default = rateLimiter;
