import express from "express";
import { ticketController } from "../controllers/ticket.controller";

const r: express.Router = express.Router();

r.post("/book", ticketController.bookTicket);
r.get("/my-tickets", ticketController.getUserTickets);

export default r;
