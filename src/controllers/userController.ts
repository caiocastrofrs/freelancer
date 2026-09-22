import type { Request, Response } from "express";
import mongoose from "mongoose";

import User from "../models/User.js";

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (
    !userId ||
    Array.isArray(userId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(req.params.userId);

  if (user) {
    res.send(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUserUsername = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.body.username) {
    user.username = req.body.username;
  }
  await user.save();
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  await User.deleteOne({ _id: req.params.userId });
  res.sendStatus(200);
};
