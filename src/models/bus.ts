import mongoose from "mongoose";

export interface ISeat extends mongoose.Document {
  seat_id: number;
  type: "window" | "side" | "path";
  booked: boolean;
}

const seatSchema = new mongoose.Schema<ISeat>(
  {
    seat_id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["window", "side", "path"],
      required: true,
    },
    booked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export interface IBus extends mongoose.Document {
  bus_id: string;
  from: string;
  to: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: string;
  availableSeats: number;
  price: number;
  originalPrice: number;
  company: string;
  busType: string;
  rating: number;
  totalReviews: number;
  badges: string[];
  seats: ISeat[];
}

const busSchema = new mongoose.Schema<IBus>(
  {
    bus_id: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    busType: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    badges: [{ type: String }],
    seats: [{ seatSchema }],
  },
  { timestamps: true }  
);

export const busModel = mongoose.model("buses", busSchema);
