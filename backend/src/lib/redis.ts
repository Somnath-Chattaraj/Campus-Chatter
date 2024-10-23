import Redis from "ioredis";

const redisURL = process.env.REDIS_URL;

if (!redisURL) {
  throw new Error("REDIS_URL is not defined");
}
const redis = new Redis(redisURL);
