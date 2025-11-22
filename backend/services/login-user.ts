import { type IncomingMessage, type ServerResponse } from "node:http";
import bcrypt from "bcrypt";
import { generateToken, setAuthCookie } from "../util/auth";
import { Body, User } from "../types";
import { getItemByProperty } from "../db/controlers";
import { response } from "../util/response";

export const loginUser = (req: IncomingMessage, res: ServerResponse) => {
  let rowBody: string = "";
  req.on("data", (chunk) => {
    rowBody += chunk;
  });
  req.on("end", async () => {
    const body: Body = JSON.parse(rowBody);
    if (!body.username || !body.password) {
      const statusCode = 400;
      const message = "Username and password are required";
      response({ res, statusCode, message, data: undefined });
    }
    const user = (await getItemByProperty(
      "users",
      "username",
      body.username
    )) as User[];
    if (user.length === 0) {
      const statusCode = 401;
      const message = "User credentials are invalid";
      response({ res, statusCode, message, data: undefined });
    } else {
      const passwordMatch: boolean = bcrypt.compareSync(
        body.password,
        user[0].password
      );
      if (!passwordMatch) {
        const statusCode = 401;
        const message = "User credentials are invalid";
        response({ res, statusCode, message, data: undefined });
      } else {
        const token: string = generateToken(`${user[0].id}`);
        setAuthCookie(res, token);
        const statusCode = 200;
        const message = "Login successful";
        response({ res, statusCode, message, data: undefined });
      }
    }
  });
};
