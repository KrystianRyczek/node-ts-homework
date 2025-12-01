import type { Request, Response, NextFunction } from "express";
import type { Car, User } from "../types";
import { editCar, getCarById } from "../db/controlers";

export const updateCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Update car service");
  const carId = req.params.id;
  const currentUser: User = res.locals.user;
  try {
    if (!req.body.model || !req.body.price) {
      throw new Error("Car model and price are required");
    }
  } catch (error: any) {
    error.name = "NoBodyData";
    return next(error);
  }
  try {
    const carToUpdate = (await getCarById(+carId)) as Car | null;
    if (carToUpdate) {
      if (
        currentUser.role === "admin" ||
        currentUser.id === +carToUpdate.ownerId
      ) {
        const editedCar = await editCar(+carId, {
          model: req.body.model,
          price: req.body.price,
        });
        if (editedCar) {
          res.status(200).json("Car updated successfully");
          return;
        }
        throw new Error("Car update failed");
      }
      throw new Error("Access denied");
    }
    throw new Error("Car not found");
  } catch (error: any) {
    console.log(error);
    error.name = "UpdateCarFailed";
    return next(error);
  }
};
