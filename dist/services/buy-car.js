"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyCar = void 0;
const sse_1 = require("./sse");
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const buyCar = async (req, res, currentUser) => {
    var _a;
    const carId = Number((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2]);
    const soldCar = (await (0, controlers_1.getItemByProperty)("cars", "id", carId));
    if (soldCar.length === 0) {
        const statusCode = 404;
        const message = "Car not found";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
    if (currentUser.balance < soldCar[0].price) {
        const statusCode = 400;
        const message = "Insufficient balance";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
    else {
        if (currentUser) {
            const updatedUser = await (0, controlers_1.editItem)("users", "id", currentUser.id, {
                balance: currentUser.balance - soldCar[0].price,
            });
            if (updatedUser && updatedUser.length > 0) {
                const deletedCars = await (0, controlers_1.deleteItem)("cars", carId);
                const newEvent = {
                    carId: soldCar[0].id,
                    buyerId: currentUser.id,
                    model: soldCar[0].model,
                    event: "sell",
                };
                const statusCode = 200;
                const message = "Car purchased successfully";
                sse_1.buyEventEmiter.emit("buyCar", newEvent);
                (0, response_1.response)({ res, statusCode, message, data: undefined });
            }
        }
    }
};
exports.buyCar = buyCar;
