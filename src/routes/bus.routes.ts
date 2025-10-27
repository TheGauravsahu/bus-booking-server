import express from "express";
import { busController } from "../controllers/bus.controller";

const r: express.Router = express.Router();

r.post("/search", busController.searchBuses);
r.get("/:busId", busController.getBusDetails);

export default r;
