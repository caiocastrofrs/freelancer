import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import User from "../models/User.js";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

const validateAccessResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.accessToken)
    return res.status(401).json("missing authentication");

  try {
    const decodedToken = jwt.verify(
      req.cookies.accessToken,
      process.env.JWT_SECRET as string,
    ) as AccessTokenPayload;

    const user = await User.findById(decodedToken.userId);
    if (!user) return res.status(400).json("user not found");

    const found = user.refreshTokens.find(
      (refreshToken) => refreshToken["token"] === req.cookies["refreshToken"],
    );

    if (!found) return res.status(401).json("missing authentication");
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json("invalid or expired token");
  }
};

export default validateAccessResource;
