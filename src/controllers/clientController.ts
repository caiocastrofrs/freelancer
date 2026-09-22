import type { Request, Response } from "express";

import User from "../models/User.js";

export const createClient = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    user.clients.push(req.body);
    await user.save();
    res.status(201).json(user.clients.at(-1));
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

export const updateClient = async (req: Request, res: Response) => {};
export const deleteClient = async (req: Request, res: Response) => {};
