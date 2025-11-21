import type { IncomingMessage, ServerResponse } from "node:http";
import type { User, Body } from "../types";
import { hashPassword } from "../util/auth";
import { editItem } from "../db/controlers";
import { response } from "../util/response";

export const updateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  let rowBody: string = "";
  req.on("data", (chunk) => {
    rowBody += chunk;
  });
  req.on("end", async () => {
    const body: Body = JSON.parse(rowBody);
    if (!body.password || !body.username) {
      const statusCode = 400;
      const message = "User name and password are required";
      response({ res, statusCode, message, data: undefined });
    } else {
      if (currentUser.id) {
        const editedUser = await editItem("users", "id", currentUser.id, {
          username: body.username,
          password: hashPassword(body.password),
        });
        if (editedUser && editedUser.length > 0) {
          const statusCode = 200;
          const message = "User updated successfully";
          response({ res, statusCode, message, data: undefined });
        } else {
          const statusCode = 500;
          const message = "Failed to update user";
          response({ res, statusCode, message, data: undefined });
        }
      }
    }
  });
};
