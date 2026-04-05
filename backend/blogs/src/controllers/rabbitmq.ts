import amqp from "amqplib";
import { redisClient } from "../lib/redis.js";
import { Blogs } from "../models/blogs.js";

interface cacheInvalidationMessage {
  action: string;
  key: string[];
}

export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });

    const channel = await connection.createChannel();
    const queueName = "cache-invalidation";

    await channel.assertQueue(queueName, { durable: true });
    console.log("Blog server cache consumer started");

    channel.consume(queueName, async (msg) => {
      try {
        if (msg) {
          const message = JSON.parse(
            msg.content.toString(),
          ) as cacheInvalidationMessage;
          console.log(
            "Blog service received cache invalidation message:",
            message,
          );
          if (message.action == "invalidateCache") {
            for (const pattern of message.key) {
              const keys = await redisClient.keys(pattern);
              if (keys.length > 0) {
                await redisClient.del(keys);
                console.log(
                  `Deleted ${keys.length} keys matching pattern: ${pattern}`,
                );
              }
            }
          }
          channel.ack(msg);
        }
      } catch (error) {
        console.error("Error consuming cache invalidation message:", error);
        if (!msg) return;
        channel.nack(msg, false, true);
      }
    });
  } catch (error) {
    console.error("Fail to start rabbitmq consumer:", error);
  }
};
