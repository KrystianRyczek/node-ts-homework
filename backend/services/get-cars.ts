import type { ServerResponse } from "node:http";
import { Car } from "../types";
import { getItems } from "../db/controlers";
import { response } from "../util/response";

export const getCarsList = async (res: ServerResponse) => {
  const cars = (await getItems("cars")) as Car[];
  if (cars.length === 0) {
    const statusCode = 404;
    const message = "No cars found";
    response({ res, statusCode, message, data: undefined });
  } else {
    const statusCode = 200;
    const message = JSON.stringify(cars);
    const data = cars;
    response({ res, statusCode, message, data });
  }
};
