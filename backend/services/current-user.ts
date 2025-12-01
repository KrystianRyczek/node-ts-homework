import type { User } from "../types";
import { getUsers } from "../db/controlers";
import { Request, Response, NextFunction } from "express";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user;
  if (user.role !== "admin") {
    res.status(200).json(user);
    return;
  }
  try {
    const users = await getUsers();
    if (users && users.length > 0) {
      res.status(200).json(users);
      return;
    }
    throw new Error("No users found");
  } catch (error: any) {
    console.log(error);
    error.name = "GetUsersFailed";
    next(error);
  }
};
