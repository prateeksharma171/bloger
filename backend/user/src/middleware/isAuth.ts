import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tryCatch } from "../utils/tryCatch.js";

dotenv.config();

const secret = process.env.JWT_SECRET;

type AuthUserPayload = {
  userId: string;
  email?: string;
};

export interface AuthRequest extends Request {
  user: AuthUserPayload | null;
}

export const isAuth = tryCatch<AuthRequest>(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  const cookieToken = req.cookies?.accessToken;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  if (!secret) {
    return res.status(500).json({ message: "Jwt Secret Not Found" });
  }

  const decodedToken = jwt.verify(token, secret) as {
    userId?: string;
    email?: string;
  };

  if (!decodedToken?.userId) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = decodedToken.email
    ? {
        userId: decodedToken.userId,
        email: decodedToken.email,
      }
    : {
        userId: decodedToken.userId,
      };
  next();
});
