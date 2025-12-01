import type { Request, Response, NextFunction } from "express";
import type { Car, User } from "../types";
import { createNewCar } from "../db/controlers";

export const addNewCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser: User = res.locals.user;
  try {
    if (!req.body.model || !req.body.price) {
      throw new Error("Car model and price are required");
    }
  } catch (error: any) {
    error.name = "BodyData";
    return next(error);
  }
  try {
    const newCar: Car | null = await createNewCar({
      model: req.body.model,
      price: req.body.price,
      ownerId: currentUser?.id,
    });

    if (newCar) {
      return res.status(201).json("Car added successfully");
    }
    throw new Error("Failed to add car");
  } catch (error: any) {
    error.name = "AddNewCarFailed";
    return next(error);
  }
};
