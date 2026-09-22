import { compare } from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import encryptPassword from "../utils/encryptPassword.js";

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) return res.status(400).json("User not found");

  const doPasswordMatch = await compare(password, user.password);
  if (!doPasswordMatch) return res.status(401).json("Password not match");

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });

  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, message: "Login successful" });
};

export const signup = async (req: Request, res: Response) => {
  const user = await User.create({
    ...req.body,
    password: encryptPassword(req.body.password),
  });
  await user.save();
  res.status(201).json(user);
};

export const logout = async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);

  if (!user) return res.status(400).json("User not found");

  await User.findByIdAndUpdate(req.userId, {
    refreshTokens: user.refreshTokens.filter(
      (refToken) => refToken["token"] !== req.cookies["refreshToken"],
    ),
  });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json("logout successfully");
};
