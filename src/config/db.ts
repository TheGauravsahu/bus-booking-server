import config from "./config";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("failed to conntect to mongoDB.");
  }
};
