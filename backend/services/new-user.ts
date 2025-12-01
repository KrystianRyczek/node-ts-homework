import type { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { hashPassword } from "../util/auth";
import { User } from "../types";
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
    const user = await getUserByName(req.body.username);
    if (user) {
      throw new Error("User name is taken!");
    }
  } catch (error: any) {
    console.log(error);
    error.name = "OcupatedUserName";
    return next(error);
  }
  try {
    const password = hashPassword(req.body.password);
    const newUser = { ...req.body, password };
    await createNewUser(newUser);
    res.status(201).json("User created successfully");
  } catch (error: any) {
    console.log(error);
    error.name = "AddNewUserFailed";
    next(error);
  }
};
