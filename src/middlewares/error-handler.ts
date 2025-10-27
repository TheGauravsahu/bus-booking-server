import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught in error handler", err);
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: msg,
    message: "Something went wrong",
    data: []
  });
};
