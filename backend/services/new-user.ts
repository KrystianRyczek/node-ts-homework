import { IncomingMessage, ServerResponse } from "node:http";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../util/auth";
import { User, Body } from "../types";
import { collectionsUpdate, getCollection } from "../db/db";

export const addNewUser = (req: IncomingMessage, res: ServerResponse) => {
  const users = process.env.USERS_DB_NAME || "users";

  let rowBody: string = "";
  req.on("data", (chunk) => {
    rowBody += chunk;
  });
  req.on("end", () => {
    const body: Body = JSON.parse(rowBody);
    const userDb: User[] = getCollection(res, users) as User[];
    const userIndex: number = userDb?.findIndex(
      (user: User) => user.username === body.username
    );
    if (userIndex !== -1) {
      res.statusCode = 409;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ error: "User already exists" }));
      res.end();
      return;
    } else {
      body.password = hashPassword(body.password);
      const updatedUserDb: User[] = [
        ...userDb,
        {
          id: uuidv4(),
          username: body.username,
          password: body.password,
          role: "user",
          balance: 10000,
          refreshToken: [],
        },
      ];
      collectionsUpdate(res, users, updatedUserDb);
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ message: "User registered successfully" }));
      res.end();
    }
  });
};
