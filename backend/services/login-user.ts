import bcrypt from "bcrypt";
import { generateToken, setAuthCookie } from "../util/auth";
import { User } from "../types";
import { getItemByProperty } from "../db/controlers";
import { Request, Response, NextFunction } from "express";

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
    const dbResponse = await getItemByProperty(
      "users",
      "username",
      req.body.username
    );
    if (dbResponse && dbResponse.length > 0) {
      const user = dbResponse as User[];
      const passwordMatch: boolean = bcrypt.compareSync(
        req.body.password,
        user[0].password
      );
      if (passwordMatch) {
        const token: string = generateToken(`${user[0].id}`);
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
