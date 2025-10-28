import { asyncHandler } from "../middlewares/async-handler";
import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import { ticketModel } from "../models/ticket";
import createHttpError from "http-errors";
import { busModel } from "../models/bus";

class TicketController {
  getUserTickets = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.id;
      const tickets = await ticketModel
        .find({
          user: userId,
        })
        .populate("bus")
        .sort({ bookedAt: -1 });

      if (!tickets || tickets.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No tickets found",
          data: [],
        });
      }
      return res.status(200).json({
        success: true,
        message: "Tickets retrived successfully",
        data: tickets,
      });
    }
  );

  bookTicket = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { busId, date, seatNumbers } = req.body;
      const userId = req.user?.id;

      if (!busId || !date || !seatNumbers) {
        throw createHttpError(400, "All fields are required");
      }

      const bus = await busModel.findOne({ bus_id: busId });
      if (!bus) {
        throw createHttpError(404, "Bus not found");
      }

      const unavailableSeats = seatNumbers.filter((seatNo: number) => {
        bus.seats?.some((seat) => seat.seat_id === seatNo && seat.booked);
      });

      if (unavailableSeats.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Some seats are already booked",
          data: unavailableSeats,
        });
      }

      const total_fare = bus.price * seatNumbers.length;
      const newTicket = await ticketModel.create({
        user: userId,
        bus: bus._id,
        date,
        seatNumbers,
        total_fare,
        pnr: "PNR-" + uuid().slice(0, 8).toUpperCase(),
      });

      bus.seats.forEach((seat) => {
        if (seatNumbers.includes(seat.seat_id)) {
          seat.booked = true;
        }
      });

      bus.availableSeats -= seatNumbers.length;
      await bus.save();
      const populatedTicket = await ticketModel
        .findById(newTicket._id)
        .populate("bus");

      return res.status(201).json({
        success: true,
        message: "Ticket booked successfully",
        data: populatedTicket,
      });
    }
  );
}

export const ticketController = new TicketController();
