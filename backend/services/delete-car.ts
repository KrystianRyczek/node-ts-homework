import type { IncomingMessage, ServerResponse } from "node:http";
import type { Car, User } from "../types";
import { deleteItem, getItemByProperty } from "../db/controlers";
import { response } from "../util/response";

export const deleteCar = async (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const cars = process.env.CARS_DB_NAME || "cars";
  const carId: number | undefined = Number(req.url?.split("/")[2]);
  const carToDelete = (await getItemByProperty(cars, "id", carId)) as Car[];
  if (carToDelete.length === 0) {
    const statusCode = 404;
    const message = "Car not found";
    response({ res, statusCode, message, data: undefined });
  }
  if (
    currentUser.role !== "admin" &&
    currentUser.id !== carToDelete[0].ownerid
  ) {
    const statusCode = 403;
    const message = "Forbidden: You don't have permission to delete this car";
    response({ res, statusCode, message, data: undefined });
  } else {
    const deletedCars = await deleteItem(cars, carId as number);
    if (deletedCars && deletedCars.length > 0) {
      const statusCode = 200;
      const message = "Car deleted successfully";
      response({ res, statusCode, message, data: undefined });
    } else {
      const statusCode = 409;
      const message = "Car not found";
      response({ res, statusCode, message, data: undefined });
    }
  }
};
