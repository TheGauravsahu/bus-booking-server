import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URL || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "2d",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  ADMIN_LOGIN_EMAIL: process.env.ADMIN_LOGIN_EMAIL || "",
  ADMIN_LOGIN_PASSWORD: process.env.ADMIN_LOGIN_PASSWORD || "",
  COOKIE_PASSWORD: process.env.COOKIE_PASSWORD || "",
  NODE_ENV: process.env.NODE_ENV || "",
};
