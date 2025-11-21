"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarsList = void 0;
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const getCarsList = async (res) => {
    const cars = (await (0, controlers_1.getItems)("cars"));
    if (cars.length === 0) {
        const statusCode = 404;
        const message = "No cars found";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
    else {
        const statusCode = 200;
        const message = JSON.stringify(cars);
        const data = cars;
        (0, response_1.response)({ res, statusCode, message, data });
    }
};
exports.getCarsList = getCarsList;
