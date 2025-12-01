"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarsList = void 0;
const controlers_1 = require("../db/controlers");
const getCarsList = async (req, res, next) => {
    try {
        const cars = await (0, controlers_1.getCars)();
        if (cars && cars.length > 0) {
            return res.status(200).json(cars);
        }
        throw new Error("No cars found");
    }
    catch (error) {
        error.name = "GetCarsFailed";
        return next(error);
    }
};
exports.getCarsList = getCarsList;
