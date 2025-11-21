import type { IncomingMessage, ServerResponse } from "node:http";
import { parseCookies, getUserFromToken } from "./util/auth";
import { User } from "./types";
import { htmlFile, cssFile, jsFile } from "./services/fetchStatic";
import { addNewUser } from "./services/new-user";
import { loginUser } from "./services/login-user";
import { getCurrentUser } from "./services/current-user";
import { updateUser } from "./services/update-user";
import { getCarsList } from "./services/get-cars";
import { addNewCar } from "./services/new-car";
import { buyCar } from "./services/buy-car";
import { sseHandler } from "./services/sse";
import { deleteUser } from "./services/delete-user";
import { deleteCar } from "./services/delete-car";
import { updateCar } from "./services/update-car";

export default async function routes(
  req: IncomingMessage,
  res: ServerResponse
) {
  console.log(`Received ${req.method} request for ${req.url}`);
  if (req.method === "GET" && req.url === "/") {
    return htmlFile(res);
  } else if (req.method === "GET" && req.url === "/style.css") {
    return cssFile(res);
  } else if (req.method === "GET" && req.url === "/main.js") {
    return jsFile(res);
  } else if (req.method === "POST" && req.url === "/register") {
    return addNewUser(req, res);
  } else if (req.method === "POST" && req.url === "/login") {
    return loginUser(req, res);
  }
  const cookies: { [key: string]: string } = parseCookies(req);

  const currentUser: User | null = cookies.token
    ? await getUserFromToken(cookies.token)
    : null;
  if (!currentUser) {
    res.statusCode = 401;
    res.write(JSON.stringify({ error: "Unauthorized" }));
    res.end();
    return;
  } else {
    if (req.method === "GET" && req.url === "/users") {
      return getCurrentUser(req, res, currentUser);
    } else if (req.method === "PUT" && req.url === `/users/${currentUser.id}`) {
      return updateUser(req, res, currentUser);
    } else if (
      req.method === "DELETE" &&
      (req.url === `/users/${currentUser.id}` || currentUser.role === "admin")
    ) {
      return deleteUser(req, res, currentUser);
    } else if (req.method === "GET" && req.url === "/cars") {
      return getCarsList(res);
    } else if (req.method === "POST" && req.url === "/cars") {
      return addNewCar(req, res, currentUser);
    } else if (req.method === "DELETE" && req.url?.startsWith("/cars")) {
      return deleteCar(req, res, currentUser);
    } else if (req.method === "PUT" && req.url?.startsWith("/cars")) {
      return updateCar(req, res, currentUser);
    } else if (
      req.method === "POST" &&
      req.url?.startsWith("/cars") &&
      req.url?.endsWith("/buy")
    ) {
      return buyCar(req, res, currentUser);
    } else if (req.method === "GET" && req.url === "/sse") {
      return sseHandler(req, res);
    } else {
      res.statusCode = 404;
      res.write(JSON.stringify({ error: "Not Found" }));
      res.end();
      return;
    }
  }
}
