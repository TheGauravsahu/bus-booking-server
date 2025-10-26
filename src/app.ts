import cors, { CorsOptions } from "cors";
import express from "express";
import config from "./config/config";
import { connectDB } from "./config/db";
import { errorHandler } from "./middlewares/error-handler";
import userRouter from "./routes/user.routes";
import busRouter from "./routes/bus.routes";
import ticketRouter from "./routes/ticket.routes";
import { verifyToken } from "./middlewares/auth";

const app = express();

const corsOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/buses", busRouter);
app.use("/api/tickets", verifyToken, ticketRouter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server started on port ${config.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start the server", error);
    process.exit(1);
  }
};

startServer();
