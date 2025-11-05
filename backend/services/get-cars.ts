import type { ServerResponse } from "node:http";
import { getCollection } from "../db/db";
import { Car } from "../types";

export const getCarsList = (res: ServerResponse) => {
  const cars = process.env.CARS_DB_NAME || "cars";
  const carsDb: Car[] = getCollection(res, cars) as Car[];
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(carsDb));
  res.end();
};
