import type { IncomingMessage, ServerResponse } from "node:http";
import type { Car, User } from "../types";
import { v4 as uuidv4 } from "uuid";
import { collectionsUpdate, getCollection } from "../db/db";

export const addNewCar = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const cars = process.env.CARS_DB_NAME || "cars";
  let rawBody: string = "";
  req.on("data", (chunk) => {
    rawBody += chunk;
  });
  req.on("end", () => {
    const body = JSON.parse(rawBody);
    if (!body.model && !body.price) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ error: "Invalid car data" }));
      res.end();
      return;
    } else {
      const carsDb: Car[] = getCollection(res, cars) as Car[];
      carsDb.push({ id: uuidv4(), ...body, ownerId: currentUser.id });
      collectionsUpdate(res, cars, carsDb);
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ message: "Car added successfully" }));
      res.end();
      return;
    }
  });
};
