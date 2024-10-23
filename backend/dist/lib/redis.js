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
exports.disconnectRedis = exports.setCachedData = exports.getCachedData = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisURL = process.env.REDIS_URL;
if (!redisURL) {
    throw new Error("REDIS_URL is not defined");
}
const redis = new ioredis_1.default(redisURL);
const getCachedData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield redis.get(key);
    }
    catch (error) {
        console.error(`Error fetching data from Redis for key: ${key}`, error);
        return null;
    }
});
exports.getCachedData = getCachedData;
const setCachedData = (key_1, value_1, ...args_1) => __awaiter(void 0, [key_1, value_1, ...args_1], void 0, function* (key, value, expiry = 3600) {
    try {
        yield redis.set(key, value, "EX", expiry);
    }
    catch (error) {
        console.error(`Error setting data in Redis for key: ${key}`, error);
    }
});
exports.setCachedData = setCachedData;
const disconnectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis.quit();
    }
    catch (error) {
        console.error("Error disconnecting from Redis", error);
    }
});
exports.disconnectRedis = disconnectRedis;
exports.default = redis;
