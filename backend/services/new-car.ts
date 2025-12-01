import { Request, Response, NextFunction } from "express";
import type { User } from "../types";
import { createNewCar } from "../db/controlers";
import { create } from "domain";

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
    console.log(error);
    error.name = "BodyData";
    return next(error);
  }
  try {
    const newCar = await createNewCar({
      model: req.body.model,
      price: req.body.price,
      ownerId: currentUser?.id,
    });

    if (newCar) {
      res.status(201).json("Car added successfully");
      return;
    }
    throw new Error("Failed to add car");
  } catch (error: any) {
    console.log(error);
    error.name = "AddNewCarFailed";
    return next(error);
  }
};
