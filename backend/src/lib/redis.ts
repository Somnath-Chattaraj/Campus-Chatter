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

export const deleteCachedPosts = async (collegeId: string): Promise<void> => {
  try {
    const collegePattern = `posts:${collegeId}:page:*`;
    const allPattern = `posts:all:page:*`;
    const collegeStream = redis.scanStream({ match: collegePattern });
    const allStream = redis.scanStream({ match: allPattern });
    collegeStream.on("data", (keys) => {
      if (keys.length) {
        redis.del(...keys);
      }
    });
    allStream.on("data", (keys) => {
      if (keys.length) {
        redis.del(...keys);
      }
    });
    collegeStream.on("end", () => {
      console.log(`Deleted cache for collegeId: ${collegeId}`);
    });

    allStream.on("end", () => {
      console.log(`Deleted all cache entries.`);
    });
  } catch (error) {
    console.error("Error deleting cached posts from Redis", error);
  }
};

export default redis;
