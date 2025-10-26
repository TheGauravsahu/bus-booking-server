import mongoose from "mongoose";
import { IUser } from "./user";
import { IBus } from "./bus";

export interface ITicket extends mongoose.Document {
  user: IUser;
  bus: IBus;
  date: Date;
  seatNumbers: number[];
  total_fare: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  pnr: string;
  booked_at: Date;
}

const ticketSchema = new mongoose.Schema<ITicket>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buses",
      required: true,
    },
    date: { type: Date, required: true },
    seatNumbers: [{ type: Number, required: true }],
    total_fare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    booked_at: {
      type: Date,
      default: Date.now,
    },
    pnr: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export const ticketModel = mongoose.model("tickets", ticketSchema);
