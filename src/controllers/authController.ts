import type { Request, Response } from "express";
import User from "../models/User.js";
import encryptPassword from "../utils/encryptPassword.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export const signin = async (req: Request, res: Response) => {
  //TODO: IMPLEMENTAR JWT E SESSÃO
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
  //TODO: IMPLEMENTAR JWT E SESSÃO
};
