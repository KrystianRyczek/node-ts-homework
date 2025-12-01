import bcrypt from "bcrypt";
import { generateToken, setAuthCookie } from "../util/auth";
import { User } from "../types";
import { getUserByName } from "../db/controlers";
import { Request, Response, NextFunction } from "express";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Login attempt for user:", req.body.username);
  if (!req.body.username || !req.body.password) {
    const error = new Error("Username and password are required");
    error.name = "BodyData";
    return next(error);
  }
  try {
    const dbResponse = await getUserByName(req.body.username);
    console.log("Database response:", dbResponse);
    if (dbResponse) {
      const user = dbResponse;
      const passwordMatch: boolean = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (passwordMatch) {
        const token: string = generateToken(`${user.id}`);
        setAuthCookie(res, token);
        res.status(200).json("Login successful");
        return;
      }
    }
    throw new Error("User credentials are invalid");
  } catch (error: any) {
    error.name = "IncorrectCredentials";
    return next(error);
  }
};
