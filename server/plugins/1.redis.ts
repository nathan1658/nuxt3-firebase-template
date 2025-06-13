import { connectToRedis, getRedisClient } from "~/server/utils/redis";

export default defineNitroPlugin(async nitroApp => {
  try {
    await connectToRedis();
  } catch (error) {
    console.error("Failed to initialize Redis plugin:", error);
  }

  nitroApp.hooks.hook("request", async () => {
    try {
      const client = getRedisClient();
      if (!client?.isOpen) {
        await connectToRedis();
      }
    } catch (error: unknown) {
      console.error("Failed to connect to Redis on request:", error);
      try {
        await connectToRedis();
      } catch (reconnectError) {
        console.error("Failed to reconnect Redis on request:", reconnectError);
      }
    }
  });

  nitroApp.hooks.hook("close", async () => {
    try {
      const client = getRedisClient();
      if (client?.isOpen) {
        await client.quit();
        console.log("🔴 Redis connection closed due to server shutdown");
      }
    } catch (error) {
      console.error("Error closing Redis connection:", error);
    }
  });
});
