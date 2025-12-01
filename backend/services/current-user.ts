import type { Request, Response, NextFunction } from "express";
import type { User } from "../types";
import { getUsers } from "../db/controlers";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user;
  if (user.role !== "admin") {
    return res.status(200).json(user);
  }
  try {
    const users: User[] | null = await getUsers();
    if (users && users.length > 0) {
      return res.status(200).json(users);
    }
    throw new Error("No users found");
  } catch (error: any) {
    error.name = "GetUsersFailed";
    next(error);
  }
};
