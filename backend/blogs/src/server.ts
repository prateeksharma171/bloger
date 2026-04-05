import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./lib/db.js";
import blogRouter from "./routes/blogs.js";
import { redisClient } from "./lib/redis.js";
import { startCacheConsumer } from "./controllers/rabbitmq.js";
import cors from "cors";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
const PORT = process.env.PORT || "5001";
const VERSION = process.env.VERSION || "/api/v1";
const app = express();
connectDB();
startCacheConsumer();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Blog API is running 🚀",
  });
});

redisClient
  .connect()
  .then(() => console.log("Connected to redis"))
  .catch(console.error);

app.use(VERSION, blogRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
