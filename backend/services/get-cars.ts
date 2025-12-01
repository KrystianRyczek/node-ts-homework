import type { Request, Response, NextFunction } from "express";
import { getCars } from "../db/controlers";

export const getCarsList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cars = await getCars();
    console.log(cars);
    if (cars && cars.length > 0) {
      res.status(200).json(cars);
      return;
    }
    throw new Error("No cars found");
  } catch (error: any) {
    error.name = "GetCarsFailed";
    return next(error);
  }
};
