"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewCar = void 0;
const controlers_1 = require("../db/controlers");
const addNewCar = async (req, res, next) => {
    const currentUser = res.locals.user;
    try {
        if (!req.body.model || !req.body.price) {
            throw new Error("Car model and price are required");
        }
    }
    catch (error) {
        console.log(error);
        error.name = "BodyData";
        return next(error);
    }
    try {
        const newCar = await (0, controlers_1.createNewCar)({
            model: req.body.model,
            price: req.body.price,
            ownerId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
        });
        if (newCar) {
            res.status(201).json("Car added successfully");
            return;
        }
        throw new Error("Failed to add car");
    }
    catch (error) {
        console.log(error);
        error.name = "AddNewCarFailed";
        return next(error);
    }
};
exports.addNewCar = addNewCar;
