"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCar = void 0;
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const updateCar = (req, res, currentUser) => {
    let rowBody = "";
    req.on("data", (chunk) => {
        rowBody += chunk;
    });
    req.on("end", async () => {
        var _a;
        const body = JSON.parse(rowBody);
        if (!body.model || !body.price) {
            const statusCode = 400;
            const message = "Model and price are required";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            const carId = Number((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2]);
            const cartoEdit = (await (0, controlers_1.getItemByProperty)("cars", "id", carId));
            if (cartoEdit.length === 0) {
                const statusCode = 404;
                const message = "Car not found";
                (0, response_1.response)({ res, statusCode, message, data: undefined });
            }
            else {
                if (currentUser.role !== "admin" &&
                    currentUser.id !== cartoEdit[0].ownerid) {
                    const statusCode = 403;
                    const message = "Access denied";
                    (0, response_1.response)({ res, statusCode, message, data: undefined });
                }
                else {
                    const editedCar = await (0, controlers_1.editItem)("cars", "id", carId, {
                        model: body.model,
                        price: Number(body.price),
                    });
                    if (editedCar && editedCar.length > 0) {
                        const statusCode = 200;
                        const message = "Car updated successfully";
                        (0, response_1.response)({ res, statusCode, message, data: undefined });
                    }
                    else {
                        const statusCode = 500;
                        const message = "Failed to update car";
                        (0, response_1.response)({ res, statusCode, message, data: undefined });
                        return;
                    }
                }
            }
        }
    });
    return;
};
exports.updateCar = updateCar;
