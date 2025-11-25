import type { Request, Response, NextFunction } from "express";
import type { User } from "../types";
import { deleteItem } from "../db/controlers";
// import { response } from "../util/response";

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userid: number = Number(req.params.id);
  const user: User = res.locals.user;
  try {
    if (user.role !== "admin" && user.id !== userid) {
      const deletedUsers = await deleteItem("users", userid);
      if (deletedUsers && deletedUsers.length > 0) {
        res.status(200).json("User deleted successfully");
        return;
      }
      throw new Error("Failed to delete user");
    }
    throw new Error("Forbidden: You don't have permission to delete this user");
  } catch (error: any) {
    error.name = "DeleteUserFailed";
    return next(error);
  }
};
