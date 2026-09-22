import { Router } from "express";

import { logout, signin, signup } from "../controllers/authController.js";
import validateSignUp from "../middlewares/signUpValidator.js";
import validateAccessResource from "../middlewares/validateAccessResource.js";

const authRoutes = Router();

authRoutes.post("/signin", signin);
authRoutes.post("/signup", validateSignUp, signup);
authRoutes.post("/logout", validateAccessResource, logout);

export default authRoutes;
