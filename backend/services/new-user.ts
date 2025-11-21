import { IncomingMessage, ServerResponse } from "node:http";
import { hashPassword } from "../util/auth";
import { User, Body } from "../types";
import { addNewItem, getItemByProperty } from "../db/controlers";
import { response } from "../util/response";
export const addNewUser = (req: IncomingMessage, res: ServerResponse) => {
  let rowBody: string = "";
  req.on("data", (chunk) => {
    rowBody += chunk;
  });
  req.on("end", async () => {
    const body: Body = JSON.parse(rowBody);

    if (!body.username || !body.password) {
      const statusCode = 400;
      const message = "User name and password are required";
      response({ res, statusCode, message, data: undefined });
    }
    const user = await getItemByProperty("users", "username", body.username);
    if (user && user.length > 0) {
      const statusCode = 409;
      const message = "User already exists";
      response({ res, statusCode, message, data: undefined });
    } else {
      const newUser = await addNewItem("users", {
        username: body.username,
        password: hashPassword(body.password),
      });
      if (newUser && newUser.length > 0) {
        const statusCode = 201;
        const message = "User registered successfully";
        response({ res, statusCode, message, data: undefined });
        return;
      } else {
        const statusCode = 500;
        const message = "Failed to register user";
        response({ res, statusCode, message, data: undefined });
        return;
      }
    }
  });
};
