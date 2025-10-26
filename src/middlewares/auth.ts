import { IUser } from "./../models/user";
import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = decoded as any;
      next();
    });
  } catch (error) {
    next(error);
  }
};
