import type { Request, Response, NextFunction } from "express";
import type { User } from "../types";
import bcrypt from "bcrypt";
import { generateToken, setAuthCookie } from "../util/auth";
import { getUserByName } from "../db/controlers";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.username || !req.body.password) {
    const error = new Error("Username and password are required");
    error.name = "BodyData";
    return next(error);
  }
  try {
    const user: User | null = await getUserByName(req.body.username);
    if (user) {
      const passwordMatch: boolean = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (passwordMatch) {
        const token: string = generateToken(`${user.id}`);
        setAuthCookie(res, token);
        return res.status(200).json("Login successful");
      }
    }
    throw new Error("User credentials are invalid");
  } catch (error: any) {
    error.name = "IncorrectCredentials";
    return next(error);
  }
};
