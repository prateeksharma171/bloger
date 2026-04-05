import { channel } from "../lib/rabbitmq.js";

export const publishToQueue = async (queueName: string, data: any) => {
  try {
    if (!channel) {
      console.error("RabbitMQ channel is not initialized");
      return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    console.log(`Published to ${queueName}:`, data);
  } catch (error) {
    console.error("Error publishing to queue:", error);
  }
};

export const cacheInvalidate = async (cacheKey: string[]) => {
  try {
    if (!channel) {
      console.error("RabbitMQ channel is not initialized");
      return;
    }
    const message = {
      action: "invalidateCache",
      key: cacheKey,
    };
    await publishToQueue("cache-invalidation", message);
    console.log("Cache invalidation message sent to queue");
  } catch (error) {
    console.error("Error publishing to queue:", error);
  }
};
