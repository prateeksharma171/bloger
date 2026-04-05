import type { NextFunction, Request, RequestHandler, Response } from "express";

export const tryCatch = <
  Req extends Request = Request,
  Res extends Response = Response,
>(
  handler: (req: Req, res: Res, next: NextFunction) => any,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as Req, res as Res, next);
    } catch (error: any) {
      return res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  };
};