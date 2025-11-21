import type { ServerResponse } from "node:http";
import { Car, User } from "../types";

export const response = ({
  res,
  message,
  statusCode,
  data,
}: {
  res: ServerResponse;
  message: string;
  statusCode: number;
  data: undefined | User | User[] | Car | Car[];
}) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  data
    ? res.write(JSON.stringify({ message, data }))
    : res.write(JSON.stringify({ message }));
  res.end();
  return;
};
