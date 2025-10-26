import express from "express";
import { userController } from "../controllers/user.controller";

const r: express.Router = express.Router();

r.post("/login", userController.loginOrSignup);
r.post("/refresh", userController.refreshToken);

export default r;
