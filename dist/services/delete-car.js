"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = void 0;
const controlers_1 = require("../db/controlers");
const deleteCar = async (req, res, next) => {
    const user = res.locals.user;
    const carId = Number(req.params.id);
    try {
        const carToDelete = await (0, controlers_1.getCarById)(carId);
        if (carToDelete) {
            if (user.role !== "admin" && user.id !== carToDelete.ownerId) {
                const deletedCars = await (0, controlers_1.deleteCarById)(carId);
                if (deletedCars) {
                    res.status(200).json("Car deleted successfully");
                    return;
                }
                throw new Error("Failed to delete car");
            }
            throw new Error("Forbidden: You don't have permission to delete this car");
        }
    }
    catch (error) {
        error.name = "DeleteCarFailed";
        return next(error);
    }
};
exports.deleteCar = deleteCar;
