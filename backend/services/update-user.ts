import type { Request, Response, NextFunction } from "express";
import type { User } from "../types";
import { hashPassword } from "../util/auth";
import { editItem } from "../db/controlers";

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser: User = res.locals.user;
  try {
    if (!req.body.password || !req.body.username) {
      throw new Error("User name and password are required");
    }
  } catch (error: any) {
    console.log(error);
    error.name = "NoBodyData";
    return next(error);
  }
  try {
    if (currentUser.role === "admin" || currentUser.id === +req.params.id) {
      const editedUser = await editItem("users", "id", +req.params.id, {
        username: req.body.username,
        password: hashPassword(req.body.password),
      });
      if (editedUser && editedUser.length > 0) {
        res.status(200).json("User updated successfully");
        return;
      }
      throw new Error("Failed to update user");
    }
    throw new Error("Access denied");
  } catch (error: any) {
    console.log(error);
    error.name = "UpdateUserFailed";
    return next(error);
  }
};
