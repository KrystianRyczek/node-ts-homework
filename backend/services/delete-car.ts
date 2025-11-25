import type { Request, Response, NextFunction } from "express";
import type { Car, User } from "../types";
import { deleteItem, getItemByProperty } from "../db/controlers";

export const deleteCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = res.locals.user;
  const carId: number = Number(req.params.id);
  try {
    const carToDelete = (await getItemByProperty("cars", "id", carId)) as Car[];
    if (carToDelete && carToDelete.length > 0) {
      if (user.role !== "admin" && user.id !== carToDelete[0].ownerid) {
        const deletedCars = await deleteItem("cars", carId);
        if (deletedCars && deletedCars.length > 0) {
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
