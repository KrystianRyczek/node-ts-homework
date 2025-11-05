import type { IncomingMessage, ServerResponse } from "node:http";
import type { User } from "../types";
import { getCollection } from "../db/db";

export const getCurrentUser = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const users = process.env.USERS_DB_NAME || "users";
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  if (currentUser.role === "admin") {
    const userDb: User[] = getCollection(res, users) as User[];
    res.write(JSON.stringify(userDb));
  } else {
    res.write(JSON.stringify(currentUser));
  }
  res.end();
};
