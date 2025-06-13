import { getRedisClient } from "~/server/utils/redis";

export default defineEventHandler(async _ => {
  const client = getRedisClient();
  const value = await client.get("test");
  console.log("🔄 Redis value:", value);
  // inc by 1
  await client.incr("test");
  const value2 = await client.get("test");
  console.log("🔄 Redis value2:", value2);
  return {
    value2,
  };
});
