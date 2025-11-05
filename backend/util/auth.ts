import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
import type { IncomingMessage, ServerResponse } from "node:http";
import bcrypt from "bcrypt";
dotenv.config({ path: "../.env" });
import { User } from "../types";

export function generateToken(id: string): string {
  const payload = { id };
  const secret = process.env.SECRET;

  if (!secret) {
    throw new Error("SECRET environment variable is not defined");
  }
  const token = jwt.sign(payload, secret, {
    expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
  });
  return token;
}

export function getUserFromToken(token: string): User | null {
  const secret = process.env.SECRET;
  if (!secret) {
    throw new Error("SECRET environment variable is not defined");
  }
  const { id, ...rest } = jwt.verify(token, secret) as { id: string };
  const userDb: User[] = JSON.parse(
    fs.readFileSync("../db/users.json", "utf8")
  );
  const user = userDb.find((user: User) => user.id === id) || null;

  return user;
}

export function setAuthCookie(res: ServerResponse, token: string) {
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; secure; Max-Age=600`);
}

export function parseCookies(req: IncomingMessage): Record<string, string> {
  const cookieHeader = req.headers.cookie;
  const cookies: Record<string, string> = {};

  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value);
    });
  }

  return cookies;
}
export function hashPassword(password: string): string {
  const saltRounds = process.env.SALT_ROUNDS;
  if (!saltRounds) {
    throw new Error("SALT_ROUNDS environment variable is not defined");
  } else {
    return bcrypt.hashSync(password, parseInt(saltRounds));
  }
}

export function clearAuthCookie(res: ServerResponse) {
  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
}
