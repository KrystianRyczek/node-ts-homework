"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewCar = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db/db");
const addNewCar = (req, res, currentUser) => {
    const cars = process.env.CARS_DB_NAME || "cars";
    let rawBody = "";
    req.on("data", (chunk) => {
        rawBody += chunk;
    });
    req.on("end", () => {
        const body = JSON.parse(rawBody);
        if (!body.model && !body.price) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ error: "Invalid car data" }));
            res.end();
            return;
        }
        else {
            const carsDb = (0, db_1.getCollection)(res, cars);
            carsDb.push({ id: (0, uuid_1.v4)(), ...body, ownerId: currentUser.id });
            (0, db_1.collectionsUpdate)(res, cars, carsDb);
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ message: "Car added successfully" }));
            res.end();
            return;
        }
    });
};
exports.addNewCar = addNewCar;
