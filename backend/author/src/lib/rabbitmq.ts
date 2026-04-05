import amqp from "amqplib";

export let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });

    channel = await connection.createChannel();

    console.log("Connection created using rabbitmq!");

    return channel;
  } catch (error) {
    console.log("fail to connect to rabbitmq", error);
  }
};
