import Redis from "ioredis";
import * as dotenv from 'dotenv'
dotenv.config()

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
});

redis.on("connect", () => console.log("📦 Redis conectado"));
redis.on("error", (err) => console.error("❌ Redis erro:", err));

export default redis;
