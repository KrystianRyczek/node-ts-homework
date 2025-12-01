import { Request, Response, NextFunction } from "express";
import { getUserFromToken, parseCookies } from "../util/auth";
import { User } from "../types";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = parseCookies(req).token;

  try {
    if (!token) {
      throw new Error("No token provided");
    }
    const user: User | null = await getUserFromToken(token);
    if (!user) {
      throw new Error("User not found");
    }
    if (user) {
      res.locals.user = user;
      return next();
    }
    throw new Error("Invalid token");
  } catch (err: any) {
    err.name = "Unauthorized";
    return next(err);
  }
}
export default authMiddleware;
