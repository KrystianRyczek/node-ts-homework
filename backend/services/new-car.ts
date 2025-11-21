import type { IncomingMessage, ServerResponse } from "node:http";
import type { User } from "../types";
import { addNewItem } from "../db/controlers";
import { response } from "../util/response";

export const addNewCar = (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  let rawBody: string = "";
  req.on("data", (chunk) => {
    rawBody += chunk;
  });
  req.on("end", async () => {
    const body = JSON.parse(rawBody);
    if (!body.model && !body.price) {
      const statusCode = 400;
      const message = "Invalid car data";
      response({ res, statusCode, message, data: undefined });
    } else {
      const newCar = await addNewItem("cars", {
        model: body.model,
        price: body.price,
        ownerid: currentUser?.id ? currentUser.id : "",
      });
      if (newCar && newCar.length > 0) {
        const statusCode = 201;
        const message = "Car added successfully";
        response({ res, statusCode, message, data: undefined });
      } else {
        const statusCode = 500;
        const message = "Failed to add car";
        response({ res, statusCode, message, data: undefined });
      }
    }
  });
};
