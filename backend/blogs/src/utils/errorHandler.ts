import type { NextFunction, Request, Response } from "express";
import multer from "multer";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          message: "File size exceeds 2MB limit",
        });

      default:
        return res.status(400).json({
          message: err.message,
        });
    }
  }

  if (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next();
};
