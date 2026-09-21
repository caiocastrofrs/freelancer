import { Router } from "express";
import { signin, signup } from "../controllers/authController.js";
import validateSignUp from "../middlewares/signUpValidator.js";

const authRoutes = Router();

authRoutes.post("/signin", signin);
authRoutes.post("/signup", validateSignUp, signup);
// authRoutes.post("/logout", logout);

export default authRoutes;
