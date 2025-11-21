"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = void 0;
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const deleteCar = async (req, res, currentUser) => {
    var _a;
    const cars = process.env.CARS_DB_NAME || "cars";
    const carId = Number((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2]);
    const carToDelete = (await (0, controlers_1.getItemByProperty)(cars, "id", carId));
    if (carToDelete.length === 0) {
        const statusCode = 404;
        const message = "Car not found";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
    if (currentUser.role !== "admin" &&
        currentUser.id !== carToDelete[0].ownerid) {
        const statusCode = 403;
        const message = "Forbidden: You don't have permission to delete this car";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
    else {
        const deletedCars = await (0, controlers_1.deleteItem)(cars, carId);
        if (deletedCars && deletedCars.length > 0) {
            const statusCode = 200;
            const message = "Car deleted successfully";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            const statusCode = 409;
            const message = "Car not found";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
    }
};
exports.deleteCar = deleteCar;
