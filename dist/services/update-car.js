"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCar = void 0;
const controlers_1 = require("../db/controlers");
const updateCar = async (req, res, next) => {
    console.log("Update car service");
    const carId = req.params.id;
    const currentUser = res.locals.user;
    try {
        if (!req.body.model || !req.body.price) {
            throw new Error("Car model and price are required");
        }
    }
    catch (error) {
        error.name = "NoBodyData";
        return next(error);
    }
    try {
        const carToUpdate = (await (0, controlers_1.getItemByProperty)("cars", "id", +carId));
        if (carToUpdate && carToUpdate.length > 0) {
            if (currentUser.role === "admin" ||
                currentUser.id === +carToUpdate[0].ownerid) {
                const editedCar = await (0, controlers_1.editItem)("cars", "id", +carId, {
                    model: req.body.model,
                    price: req.body.price,
                });
                if (editedCar && editedCar.length > 0) {
                    res.status(200).json("Car updated successfully");
                    return;
                }
                throw new Error("Car update failed");
            }
            throw new Error("Access denied");
        }
        throw new Error("Car not found");
    }
    catch (error) {
        console.log(error);
        error.name = "UpdateCarFailed";
        return next(error);
    }
};
exports.updateCar = updateCar;
