import { Router } from "express";
import {
  deleteUser,
  getUser,
  updateUserUsername,
} from "../controllers/userController.js";

const userRoutes = Router({ mergeParams: true });

userRoutes.get("/:userId", getUser);
userRoutes.put("/:userId", updateUserUsername);
userRoutes.delete("/:userId", deleteUser);

export default userRoutes;
