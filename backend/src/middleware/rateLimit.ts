import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}
const redis = new Redis(redisUrl);
const MAX_REQUESTS = 100;
const WINDOW_SIZE_IN_SECONDS = 60;

const rateLimiter = asyncHandler(
  //@ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const clientIp = req.user.user_id;
    // console.log(clientIp);
    const key = `rate-limit:${clientIp}`;
    const requestCount = await redis.get(key);

    if (requestCount && parseInt(requestCount) >= MAX_REQUESTS) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }

    const ttl = await redis.ttl(key);

    if (ttl < 0) {
      await redis.set(key, 1, "EX", WINDOW_SIZE_IN_SECONDS);
    } else {
      await redis.incr(key);
    }

    next();
  }
);

export default rateLimiter;
