import type { IncomingMessage, ServerResponse } from "node:http";
import type { User, Body } from "../types";
import { hashPassword } from "../util/auth";
import { collectionsUpdate, getCollection } from "../db/db";

export const updateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const users = process.env.USERS_DB_NAME || "users";

  let rowBody: string = "";
  req.on("data", (chunk) => {
    rowBody += chunk;
  });
  req.on("end", () => {
    const body: Body = JSON.parse(rowBody);
    if (!body.password || !body.username) {
      res.statusCode = 400;
      res.write(
        JSON.stringify({ error: "User name and password are required" })
      );
      res.end();
      return;
    }
    body.password = hashPassword(body.password);
    const userDb: User[] = getCollection(res, users) as User[];
    const userIndex: number = userDb.findIndex(
      (user) => user.id === currentUser.id
    );
    if (userIndex !== -1) {
      const updatedUser: User = { ...userDb[userIndex], ...body };
      const updatedUserDb: User[] = [...userDb];
      updatedUserDb[userIndex] = updatedUser;
      collectionsUpdate(res, users, updatedUserDb);
      res.statusCode = 200;
      res.write(
        JSON.stringify({
          message: "User updated successfully",
          user: updatedUser,
        })
      );
      res.end();
    } else {
      res.statusCode = 409;
      res.write(JSON.stringify({ error: "User not found" }));
      res.end();
    }
  });
};
