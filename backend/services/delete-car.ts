import type { IncomingMessage, ServerResponse } from "node:http";
import type { Car, User } from "../types";
import { collectionsUpdate, getCollection } from "../db/db";

export const deleteCar = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const cars = process.env.CARS_DB_NAME || "cars";
  const carId: string | undefined = req.url?.split("/")[2];
  const carsDb: Car[] = getCollection(res, cars) as Car[];
  const carIndex: number = carsDb.findIndex(
    (car) => car.id === carId && car.ownerId === currentUser.id
  );

  if (carIndex === -1 && currentUser.role !== "admin") {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ error: "Access denied" }));
    res.end();
    return;
  } else {
    const updatedCars: Car[] = carsDb.filter((car) => car.id !== carId);
    collectionsUpdate(res, cars, updatedCars);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ message: "Car deleted successfully" }));
    res.end();
    return;
  }
};
