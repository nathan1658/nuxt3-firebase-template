import { createClient, type RedisClientType } from "redis";

let client: RedisClientType;
let connectionPromise: Promise<void> | null = null;

export async function connectToRedis(): Promise<void> {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const config = useRuntimeConfig();

      if (client?.isOpen) {
        return;
      }

      client = createClient({
        url: config.redisUri,
        password: config.redisPassword,
      }) as RedisClientType;

      client.on("error", err => {
        console.error("Redis error:", err);
      });

      client.on("connect", () => {
        console.log("✅ Redis connected successfully");
      });

      client.on("ready", () => {
        console.log("✅ Redis ready");
      });

      client.on("reconnecting", () => {
        console.log("🔄 Redis reconnecting...");
      });

      client.on("disconnect", () => {
        console.log("❌ Redis disconnected");
      });

      client.on("end", () => {
        console.log("❌ Redis connection ended");
        connectionPromise = null;
      });

      await client.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
}

export function getRedisClient(): RedisClientType {
  if (!client?.isOpen) {
    throw new Error("Redis client not connected. Ensure the plugin has initialized.");
  }
  return client;
}
