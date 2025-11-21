import type { IncomingMessage, ServerResponse } from "node:http";
import type { User } from "../types";
import { deleteItem } from "../db/controlers";
import { response } from "../util/response";

export const deleteUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const users = process.env.USERS_DB_NAME || "users";
  const userId: number = Number(req.url?.split("/")[2]);
  if (currentUser.role !== "admin" && currentUser.id !== userId) {
    const statusCode = 403;
    const message = "Forbidden: You don't have permission to delete this user";
    response({ res, statusCode, message, data: undefined });
  } else {
    const deletedUsers = await deleteItem(users, userId);
    if (deletedUsers && deletedUsers.length > 0) {
      const statusCode = 200;
      const message = "User deleted successfully";
      response({ res, statusCode, message, data: undefined });
    } else {
      const statusCode = 409;
      const message = "User not found";
      response({ res, statusCode, message, data: undefined });
    }
  }
};
