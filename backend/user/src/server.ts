import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./lib/db.js";
import userRouter from "./routes/users.js";
import uploadRouter from "./routes/upload.js";
import { errorHandler } from "./utils/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
const PORT = process.env.PORT || "5000";
const VERSION = process.env.VERSION || "/api/v1";
const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
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
app.use(VERSION, userRouter);
app.use(VERSION, uploadRouter);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
