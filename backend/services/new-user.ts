import type { NextFunction, Request, Response } from "express";
import type { User } from "../types";
import Joi from "joi";
import { hashPassword } from "../util/auth";
import { createNewUser, getUserByName } from "../db/controlers";

const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(30).required(),
});

export const addNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = signUpSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  try {
    const user: User | null = await getUserByName(req.body.username);
    if (user) {
      throw new Error("User name is taken!");
    }
  } catch (error: any) {
    error.name = "OcupatedUserName";
    return next(error);
  }
  try {
    const password = hashPassword(req.body.password);
    const newUser: User | null = await createNewUser({ ...req.body, password });
    if (newUser) {
      return res.status(201).json("User created successfully");
    }
    throw new Error("Failed to create user");
  } catch (error: any) {
    error.name = "AddNewUserFailed";
    next(error);
  }
};
