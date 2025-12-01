import type { NextFunction, Request, Response } from "express";
import type { Car, EventLog, User } from "../types";
import { buyEventEmiter } from "./sse";
import { deleteCarById, editUser, getCarById } from "../db/controlers";

export const buyCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const carId: number = Number(req.params.id);
    const currentUser: User = res.locals.user;
    const soldCar: Car | null = await getCarById(carId);
    if (soldCar && currentUser.balance >= soldCar.price) {
      const updatedUser: User | null = await editUser(currentUser.id, {
        balance: currentUser.balance - soldCar.price,
      });
      if (updatedUser) {
        const deletedCar: Car | null = await deleteCarById(carId);
        if (deletedCar) {
          const newEvent: EventLog = {
            carId: soldCar.id,
            buyerId: currentUser.id,
            model: soldCar.model,
            event: "sell",
          };
          buyEventEmiter.emit("buyCar", newEvent);
          res.status(200).json("Car purchased successfully");
          return;
        }
        throw new Error("Failed to purchase car");
      }
    }
    throw new Error("Car not available any more or insufficient balance");
  } catch (error: any) {
    error.name = "BuyCarFailed";
    return next(error);
  }
};
