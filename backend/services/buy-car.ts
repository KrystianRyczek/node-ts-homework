import type { IncomingMessage, ServerResponse } from "node:http";
import type { Car, EventLog, User } from "../types";
import { buyEventEmiter } from "./sse";
import { deleteItem, editItem, getItemByProperty } from "../db/controlers";
import { response } from "../util/response";

export const buyCar = async (
  req: IncomingMessage,
  res: ServerResponse,
  currentUser: User
) => {
  const carId: number | undefined = Number(req.url?.split("/")[2]);
  const soldCar = (await getItemByProperty("cars", "id", carId)) as Car[];
  if (soldCar.length === 0) {
    const statusCode = 404;
    const message = "Car not found";
    response({ res, statusCode, message, data: undefined });
  }
  if (currentUser.balance < soldCar[0].price) {
    const statusCode = 400;
    const message = "Insufficient balance";
    response({ res, statusCode, message, data: undefined });
  } else {
    if (currentUser) {
      const updatedUser = await editItem(
        "users",
        "id",
        currentUser.id as number,
        {
          balance: currentUser.balance - soldCar[0].price,
        }
      );
      if (updatedUser && updatedUser.length > 0) {
        const deletedCars = await deleteItem("cars", carId);

        const newEvent: EventLog = {
          carId: soldCar[0].id,
          buyerId: currentUser.id,
          model: soldCar[0].model,
          event: "sell",
        };
        const statusCode = 200;
        const message = "Car purchased successfully";
        buyEventEmiter.emit("buyCar", newEvent);
        response({ res, statusCode, message, data: undefined });
      }
    }
  }
};
