import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./lib/db.js";
import uploadRouter from "./routes/upload.js";
import blogRouter from "./routes/blogs.js";
import { connectRabbitMQ } from "./lib/rabbitmq.js";
import cors from "cors";
import path from "path";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
const PORT = process.env.PORT || "5002";
const VERSION = process.env.VERSION || "/api/v1";
const app = express();
connectDB();
connectRabbitMQ();

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
app.use("/uploads", express.static(path.resolve("src/uploads")));
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Blog API is running 🚀",
  });
});
app.use(VERSION, blogRouter);
app.use(VERSION, uploadRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
