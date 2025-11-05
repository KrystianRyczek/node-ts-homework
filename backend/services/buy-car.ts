import type { IncomingMessage, ServerResponse } from "node:http";
import type { Car, EventLog, User } from "../types";
import { collectionsUpdate, getCollection } from "../db/db";
import { buyEventEmiter } from "./sse";

export const buyCar = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const users = process.env.USERS_DB_NAME || "users";
  const cars = process.env.CARS_DB_NAME || "cars";
  const carId: string | undefined = req.url?.split("/")[2];
  const carsDb: Car[] = getCollection(res, cars) as Car[];
  const carIndex: number = carsDb.findIndex((car) => car.id === carId);

  if (carIndex === -1) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ error: "Car not found" }));
    res.end();
    return;
  } else {
    const userDb: User[] = getCollection(res, users) as User[];
    const userIndex: number = userDb.findIndex(
      (user: User) => user.id === currentUser.id
    );
    if (userIndex === -1) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ error: "User not found" }));
      res.end();
      return;
    } else {
      const availableCars: Car[] = carsDb.filter((car) => car.id !== carId);
      collectionsUpdate(res, cars, availableCars);
      const updatedUser: User[] = [...userDb];
      updatedUser[userIndex].balance -= carsDb[carIndex].price;
      collectionsUpdate(res, users, updatedUser);
      const newEvent: EventLog = {
        carId: carsDb[carIndex].id,
        ownerId: currentUser.id,
        model: carsDb[carIndex].model,
        event: "sell",
      };
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ message: "Car purchased successfully" }));
      res.end();
      buyEventEmiter.emit("buyCar", newEvent);
      return;
    }
  }
};
