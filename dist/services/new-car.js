"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewCar = void 0;
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const addNewCar = (req, res, currentUser) => {
    let rawBody = "";
    req.on("data", (chunk) => {
        rawBody += chunk;
    });
    req.on("end", async () => {
        const body = JSON.parse(rawBody);
        if (!body.model && !body.price) {
            const statusCode = 400;
            const message = "Invalid car data";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            const newCar = await (0, controlers_1.addNewItem)("cars", {
                model: body.model,
                price: body.price,
                ownerid: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) ? currentUser.id : "",
            });
            if (newCar && newCar.length > 0) {
                const statusCode = 201;
                const message = "Car added successfully";
                (0, response_1.response)({ res, statusCode, message, data: undefined });
            }
            else {
                const statusCode = 500;
                const message = "Failed to add car";
                (0, response_1.response)({ res, statusCode, message, data: undefined });
            }
        }
    });
};
exports.addNewCar = addNewCar;
