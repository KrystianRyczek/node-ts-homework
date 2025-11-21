import type { IncomingMessage, ServerResponse } from "node:http";
import type { Car, User, Body } from "../types";
import { editItem, getItemByProperty } from "../db/controlers";
import { response } from "../util/response";

export const updateCar = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  let rowBody: string = "";
  req.on("data", (chunk) => {
    rowBody += chunk;
  });
  req.on("end", async () => {
    const body: Body = JSON.parse(rowBody);
    if (!body.model || !body.price) {
      const statusCode = 400;
      const message = "Model and price are required";
      response({ res, statusCode, message, data: undefined });
    } else {
      const carId: number | undefined = Number(req.url?.split("/")[2]);
      const cartoEdit = (await getItemByProperty("cars", "id", carId)) as Car[];
      if (cartoEdit.length === 0) {
        const statusCode = 404;
        const message = "Car not found";
        response({ res, statusCode, message, data: undefined });
      } else {
        if (
          currentUser.role !== "admin" &&
          currentUser.id !== cartoEdit[0].ownerid
        ) {
          const statusCode = 403;
          const message = "Access denied";
          response({ res, statusCode, message, data: undefined });
        } else {
          const editedCar = await editItem("cars", "id", carId, {
            model: body.model,
            price: Number(body.price),
          });
          if (editedCar && editedCar.length > 0) {
            const statusCode = 200;
            const message = "Car updated successfully";
            response({ res, statusCode, message, data: undefined });
          } else {
            const statusCode = 500;
            const message = "Failed to update car";
            response({ res, statusCode, message, data: undefined });
            return;
          }
        }
      }
    }
  });
  return;
};
