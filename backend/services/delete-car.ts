import type { Request, Response, NextFunction } from "express";
import type { Car, User } from "../types";
import { getCarById, deleteCarById } from "../db/controlers";
import { Cars } from "@prisma/client";

export const deleteCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user;
  const carId: number = Number(req.params.id);
  try {
    const carToDelete = await getCarById(carId);
    if (carToDelete) {
      if (user.role !== "admin" && user.id !== carToDelete.ownerId) {
        const deletedCars: Cars | null = await deleteCarById(carId);
        if (deletedCars) {
          res.status(200).json("Car deleted successfully");
          return;
        }
        throw new Error("Failed to delete car");
      }
      throw new Error(
        "Forbidden: You don't have permission to delete this car"
      );
    }
  } catch (error: any) {
    error.name = "DeleteCarFailed";
    return next(error);
  }
};
