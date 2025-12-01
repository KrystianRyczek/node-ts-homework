import type { Request, Response, NextFunction } from "express";
import type { Car, User } from "../types";
import { getCarById, deleteCarById } from "../db/controlers";

export const deleteCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user;
  const carId: number = Number(req.params.id);
  try {
    const carToDelete: Car | null = await getCarById(carId);
    if (carToDelete) {
      if (user.role !== "admin" && user.id !== carToDelete.ownerId) {
        const deletedCars: Car | null = await deleteCarById(carId);
        if (deletedCars) {
          return res.status(200).json("Car deleted successfully");
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
