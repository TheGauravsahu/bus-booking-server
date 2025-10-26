import createHttpError from "http-errors";
import { asyncHandler } from "../middlewares/async-handler";
import { Request, Response, NextFunction } from "express";
import { busModel } from "../models/bus";

class BusController {
  getBusDetails = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { busId } = req.params;
      if (!busId) throw createHttpError(400, "Bus Id is required.");

      const bus = await busModel.findOne({ bus_id: busId });
      if (!bus) throw createHttpError(404, "Bus not found.");

      return res.status(200).json({
        success: true,
        message: "Bus details retrived successfully.",
        data: bus,
      });
    }
  );

  searchBuses = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { to, from, date } = req.body;
      if (!to || !from || !date)
        throw createHttpError(400, "from, to, and date are required.");

      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

      const buses = await busModel.find({
        from,
        to,
        departureTime: { $gte: startOfDay, $lte: endOfDay },
      });
      return res.status(200).json({
        success: true,
        message: "Buses retrived successfully",
        data: buses,
      });
    }
  );
}

export const busController = new BusController();
