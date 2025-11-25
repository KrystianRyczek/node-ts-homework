import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { IncomingMessage, ServerResponse } from "node:http";
import bcrypt from "bcrypt";
dotenv.config({ path: "../.env" });
import { Car, User } from "../types";
import { getItemByProperty } from "../db/controlers";
import { Request, Response, NextFunction } from "express";

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

export async function getUserFromToken(token: string): Promise<User | null> {
  const secret = process.env.SECRET;
  if (!secret) {
    throw new Error("SECRET environment variable is not defined");
  }
  const { id, ...rest } = jwt.verify(token, secret) as { id: number };
  const user = await getItemByProperty("users", "id", id);

  if (user) {
    return user[0] as User;
  }
  return null;
}

export function setAuthCookie(res: Response, token: string): void {
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; secure; Max-Age=600`);
}

export function parseCookies(req: Request): Record<string, string> {
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

export function clearAuthCookie(res: ServerResponse): void {
  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
}
