"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyCar = void 0;
const sse_1 = require("./sse");
const controlers_1 = require("../db/controlers");
const buyCar = async (req, res, next) => {
    try {
        const carId = Number(req.params.id);
        const currentUser = res.locals.user;
        const soldCar = (await (0, controlers_1.getItemByProperty)("cars", "id", carId));
        if (soldCar.length > 0 && currentUser.balance >= soldCar[0].price) {
            const updatedUser = await (0, controlers_1.editItem)("users", "id", currentUser.id, {
                balance: currentUser.balance - soldCar[0].price,
            });
            if (updatedUser && updatedUser.length > 0) {
                const deletedCars = await (0, controlers_1.deleteItem)("cars", carId);
                if (deletedCars && deletedCars.length > 0) {
                    const newEvent = {
                        carId: soldCar[0].id,
                        buyerId: currentUser.id,
                        model: soldCar[0].model,
                        event: "sell",
                    };
                    sse_1.buyEventEmiter.emit("buyCar", newEvent);
                    res.status(200).json("Car purchased successfully");
                    return;
                }
                throw new Error("Failed to purchase car");
            }
        }
        throw new Error("Car not available or insufficient balance");
    }
    catch (error) {
        console.log(error);
        error.name = "BuyCarFailed";
        return next(error);
    }
};
exports.buyCar = buyCar;
