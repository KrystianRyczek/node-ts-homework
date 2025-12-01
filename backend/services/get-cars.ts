import type { Request, Response, NextFunction } from "express";
import type { Car } from "../types";
import { getCars } from "../db/controlers";

export const getCarsList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cars: Car[] | null = await getCars();
    if (cars && cars.length > 0) {
      return res.status(200).json(cars);
    }
    throw new Error("No cars found");
  } catch (error: any) {
    error.name = "GetCarsFailed";
    return next(error);
  }
};
