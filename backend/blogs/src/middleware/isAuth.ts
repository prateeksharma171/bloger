import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tryCatch } from "../utils/tryCatch.js";
dotenv.config();

const secret = process.env.JWT_SECRET;

export const isAuth = tryCatch(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    if (!secret) {
      return res.status(500).json({ message: "Jwt Secret Not Found" });
    }
    const decodedToken: any = jwt.verify(token, secret);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});
