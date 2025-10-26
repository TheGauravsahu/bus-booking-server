import dotenv from "dotenv";
import mongoose from "mongoose";
import { buses, locations, generateSeats } from "./seedData";
import { busModel,  } from "../models/bus";

dotenv.config();

export interface ISeat  {
  seat_id: number;
  type: "window" | "side" | "path";
  booked: boolean;
}


export interface IBus {
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

const generateRandomTime = (baseDate: any) => {
  const hour = Math.floor(Math.random() * 12) + 6;
  const minute = Math.random() > 0.5 ? 30 : 0;

  const dateTime = new Date(baseDate);
  dateTime.setHours(hour, minute, 0, 0);

  return dateTime;
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connected to MongoDB");

    await busModel.deleteMany();
    console.log("Old bus data deleted");

    const busesToInsert = [] as IBus[];
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        const from = locations[i] as string;
        const to = locations[j] as string;

        const baseDate = new Date();

        for (let dayOffSet = 0; dayOffSet < 7; dayOffSet++) {
          const travelDate = new Date(baseDate);
          travelDate.setDate(travelDate.getDate() + dayOffSet);

          const returnDate = new Date(travelDate);
          returnDate.setDate(returnDate.getDate() + 1);

          buses.forEach((bus) => {
            const departureTime = generateRandomTime(travelDate);
            const arrivalTime = generateRandomTime(travelDate);

            busesToInsert.push({
              bus_id: `${bus.busId}_${from}_${to}_${dayOffSet}`,
              from,
              to,
              departureTime,
              arrivalTime,
              duration: "9h 30m",
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });

            busesToInsert.push({
              bus_id: `${bus.busId}_${from}_${to}_${dayOffSet + 1}`,
              from: to,
              to: from,
              departureTime: generateRandomTime(travelDate),
              arrivalTime: generateRandomTime(travelDate),
              duration: "9h 30m",
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });
          });
        }
      }
    }

    await busModel.insertMany(busesToInsert);
    console.log("Database seeded successfully ✅");
  } catch (error) {
    console.log("error seeding database", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
