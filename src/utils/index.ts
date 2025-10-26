import config from "../config/config";
import { IUser } from "../models/user";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface IPayload {
  id: string;
  email: string;
}

export const generateTokens = (user: IUser) => {
  const payload: IPayload = {
    id: user._id as string,
    email: user.email,
  };
  const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY!,
  } as SignOptions);

  const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY!,
  } as SignOptions);

  return { accessToken, refreshToken };
};

export const comparePassword = async (
  inputPassword: string,
  password: string
) => {
  const isMatch = await bcrypt.compare(inputPassword, password);
  return isMatch;
};
