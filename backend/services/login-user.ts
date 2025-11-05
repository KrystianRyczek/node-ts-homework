import { type IncomingMessage, type ServerResponse } from "node:http";
import bcrypt from "bcrypt";
import { generateToken, setAuthCookie } from "../util/auth";
import { Body, User } from "../types";
import { getCollection } from "../db/db";

export const loginUser = (req: IncomingMessage, res: ServerResponse) => {
  const users = process.env.USERS_DB_NAME || "users";
  let rowBody: string = "";
  req.on("data", (chunk) => {
    rowBody += chunk;
  });
  req.on("end", () => {
    const body: Body = JSON.parse(rowBody);
    if (!body.username || !body.password) {
      res.statusCode = 400;
      res.write(
        JSON.stringify({ error: "Username and password are required" })
      );
      res.end();
      return;
    } else {
      const userDb: User[] = getCollection(res, users) as User[];
      const user: User | undefined = userDb.find(
        (user: { username: string; password: string }): boolean =>
          user.username === body.username
      );
      const passwordMatch: boolean = user
        ? bcrypt.compareSync(body.password, user.password)
        : false;
      if (user && passwordMatch) {
        const token: string = generateToken(user.id);
        setAuthCookie(res, token);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ message: "Login successful" }));
        res.end();
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ error: "Invalid username or password" }));
        res.end();
      }
    }
  });
};
