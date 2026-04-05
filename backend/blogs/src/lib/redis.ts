import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisUrl = process.env.REDIS_URL || "";

if (!redisUrl) console.error("redis url not found");

export const redisClient = createClient({
  url: redisUrl,
});
