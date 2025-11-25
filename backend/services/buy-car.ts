import type { NextFunction, Request, Response } from "express";
import type { Car, EventLog, User } from "../types";
import { buyEventEmiter } from "./sse";
import { deleteItem, editItem, getItemByProperty } from "../db/controlers";

export const buyCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const carId: number = Number(req.params.id);
    const currentUser: User = res.locals.user;
    const soldCar = (await getItemByProperty("cars", "id", carId)) as Car[];
    if (soldCar.length > 0 && currentUser.balance >= soldCar[0].price) {
      const updatedUser = await editItem("users", "id", currentUser.id, {
        balance: currentUser.balance - soldCar[0].price,
      });
      if (updatedUser && updatedUser.length > 0) {
        const deletedCars = await deleteItem("cars", carId);
        if (deletedCars && deletedCars.length > 0) {
          const newEvent: EventLog = {
            carId: soldCar[0].id,
            buyerId: currentUser.id,
            model: soldCar[0].model,
            event: "sell",
          };
          buyEventEmiter.emit("buyCar", newEvent);
          res.status(200).json("Car purchased successfully");
          return;
        }
        throw new Error("Failed to purchase car");
      }
    }
    throw new Error("Car not available or insufficient balance");
  } catch (error: any) {
    console.log(error);
    error.name = "BuyCarFailed";
    return next(error);
  }
};
