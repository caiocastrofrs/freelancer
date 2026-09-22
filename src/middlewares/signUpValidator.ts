import type { NextFunction, Request, Response } from "express";
import validator from "validator";

import User from "../models/User.js";

const { isEmail, isStrongPassword, isLength } = validator;

function validateUsername(username: string) {
  //Invalida caracteres especiais e underscore no começo ou final
  const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/;

  return isLength(username, { min: 6 }) && regex.test(username);
}

const validateSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!validateUsername(req.body.username)) {
    return res.status(400).json({ message: "Invalid username" });
  } else {
    const user = await User.findOne({ username: req.body.username });
    if (user)
      return res.status(400).json({ message: "username already taken" });
  }

  if (!isEmail(req.body.email)) {
    return res.status(400).json({ message: "Invalid email" });
  } else {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: "email already taken" });
  }

  if (
    !isStrongPassword(req.body.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({ message: "Invalid password" });
  }

  next();
};

export default validateSignUp;
