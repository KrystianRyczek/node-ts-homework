"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyCar = void 0;
const sse_1 = require("./sse");
const controlers_1 = require("../db/controlers");
const buyCar = async (req, res, next) => {
    try {
        const carId = Number(req.params.id);
        const currentUser = res.locals.user;
        const soldCar = await (0, controlers_1.getCarById)(carId);
        if (soldCar && currentUser.balance >= soldCar.price) {
            const updatedUser = await (0, controlers_1.editUser)(currentUser.id, {
                balance: currentUser.balance - soldCar.price,
            });
            if (updatedUser) {
                const deletedCar = await (0, controlers_1.deleteCarById)(carId);
                if (deletedCar) {
                    const newEvent = {
                        carId: soldCar.id,
                        buyerId: currentUser.id,
                        model: soldCar.model,
                        event: "sell",
                    };
                    sse_1.buyEventEmiter.emit("buyCar", newEvent);
                    res.status(200).json("Car purchased successfully");
                    return;
                }
                throw new Error("Failed to purchase car");
            }
        }
        throw new Error("Car not available any more or insufficient balance");
    }
    catch (error) {
        error.name = "BuyCarFailed";
        return next(error);
    }
};
exports.buyCar = buyCar;
