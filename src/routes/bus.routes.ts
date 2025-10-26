import express from "express";
import { busController } from "../controllers/bus.controller";

const r: express.Router = express.Router();

r.get("/search", busController.getBusDetails);
r.get("/:busId", busController.getBusDetails);

export default r;
