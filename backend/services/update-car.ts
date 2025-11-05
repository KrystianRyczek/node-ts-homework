import type { IncomingMessage, ServerResponse } from "node:http";
import type { Car, User, Body } from "../types";
import { collectionsUpdate, getCollection } from "../db/db";

export const updateCar = (
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
    let rowBody: string = "";
    req.on("data", (chunk) => {
      rowBody += chunk;
    });
    req.on("end", () => {
      const body: Body = JSON.parse(rowBody);
      if (!body.model || !body.price) {
        res.statusCode = 400;
        res.write(JSON.stringify({ error: "Model and price are required" }));
        res.end();
        return;
      } else {
        const carIndex: number = carsDb.findIndex((car) => car.id === carId);
        const updatedCar: Car = { ...carsDb[carIndex], ...body };
        const updatedCarsDb: Car[] = [...carsDb];
        updatedCarsDb[carIndex] = updatedCar;
        collectionsUpdate(res, cars, updatedCarsDb);
        res.statusCode = 200;
        res.write(
          JSON.stringify({
            message: "Car updated successfully",
          })
        );
        res.end();
      }
    });
    return;
  }
};
