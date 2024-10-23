import Redis from "ioredis";

const redisURL = process.env.REDIS_URL;

if (!redisURL) {
  throw new Error("REDIS_URL is not defined");
}
const redis = new Redis(redisURL);

export const getCachedData = async (key: string): Promise<string | null> => {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error(`Error fetching data from Redis for key: ${key}`, error);
    return null;
  }
};

export const setCachedData = async (
  key: string,
  value: string,
  expiry: number = 3600
): Promise<void> => {
  try {
    await redis.set(key, value, "EX", expiry);
  } catch (error) {
    console.error(`Error setting data in Redis for key: ${key}`, error);
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    await redis.quit();
  } catch (error) {
    console.error("Error disconnecting from Redis", error);
  }
};

export default redis;
