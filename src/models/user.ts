import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  phone: string;
  name: string;
  email: string;
  user_image: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    phone: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    user_image: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model<IUser>("users", userSchema);
