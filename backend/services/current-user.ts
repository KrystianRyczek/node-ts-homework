import type { IncomingMessage, ServerResponse } from "node:http";
import type { User } from "../types";
import { getItems } from "../db/controlers";
import { response } from "../util/response";

export const getCurrentUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  if (currentUser.role !== "admin") {
    const statusCode = 200;
    const message = JSON.stringify(currentUser);
    const data = currentUser;
    response({ res, statusCode, message, data });
  } else {
    const users = await getItems("users");
    if (users && users.length > 0) {
      const statusCode = 200;
      const message = JSON.stringify(users);
      response({ res, statusCode, message, data: undefined });
    } else {
      const statusCode = 404;
      const message = "No users found";
      response({ res, statusCode, message, data: undefined });
    }
  }
};
