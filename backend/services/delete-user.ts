import type { IncomingMessage, ServerResponse } from "node:http";
import type { User } from "../types";
import { collectionsUpdate, getCollection } from "../db/db";

export const deleteUser = (req: IncomingMessage, res: ServerResponse) => {
  const users = process.env.USERS_DB_NAME || "users";
  const userId: string | undefined = req.url?.split("/")[2];
  const userDb: User[] = getCollection(res, users) as User[];
  const userIndex: number = userDb.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    const updatedUserDb: User[] = userDb.filter((user) => user.id !== userId);
    collectionsUpdate(res, users, updatedUserDb);
    res.statusCode = 200;
    res.write(
      JSON.stringify({
        message: "User deleted successfully",
      })
    );
    res.end();
  } else {
    res.statusCode = 409;
    res.write(JSON.stringify({ error: "User not found" }));
    res.end();
  }
};
