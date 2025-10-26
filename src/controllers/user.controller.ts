import { asyncHandler } from "../middlewares/async-handler";
import { Request, Response, NextFunction } from "express";
import { IUser, userModel } from "../models/user";
import createHttpError from "http-errors";
import { IPayload, comparePassword, generateTokens } from "../utils/index";
import bcrypt from "bcryptjs";
import config from "../config/config";
import jwt, { SignOptions } from "jsonwebtoken";

class UserController {
  loginOrSignup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email || !password) {
        throw createHttpError(400, "Email and password are required.");
      }

      let user = await userModel.findOne({ email }).select("+password");

      // login
      if (user) {
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) throw createHttpError(400, "Invalid credentials.");

        const userObj = {
          _id: user._id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          user_image: user.user_image,
        } as IUser;

        const tokens = generateTokens(userObj);
        return res.status(200).json({
          success: true,
          message: "Login successful.",
          data: { user, tokens },
        });
      }

      // signup
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userModel.create({ email, password: hashedPassword });

      const userObj = {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        user_image: user.user_image,
      } as IUser;

      const tokens = generateTokens(userObj);

      return res.status(201).json({
        success: true,
        message: "Signup successfull.",
        data: { user, tokens },
      });
    }
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { refreshToken: reqRefreshToken } = req.body;
      if (!reqRefreshToken) {
        throw createHttpError(401, "No refresh token provided");
      }

      const decoded = jwt.verify(
        reqRefreshToken,
        config.REFRESH_TOKEN_SECRET
      ) as IPayload;

      const user = await userModel.findById(decoded.id);
      if (!user) throw createHttpError(404, "User not found");

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        config.ACCESS_TOKEN_SECRET,
        {
          expiresIn: config.ACCESS_TOKEN_EXPIRY!,
        } as SignOptions
      );

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully.",
        data: newAccessToken,
      });
    }
  );
}

export const userController = new UserController();
