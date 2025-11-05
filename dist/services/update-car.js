"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCar = void 0;
const db_1 = require("../db/db");
const updateCar = (req, res, currentUser) => {
    var _a;
    const cars = process.env.CARS_DB_NAME || "cars";
    const carId = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2];
    const carsDb = (0, db_1.getCollection)(res, cars);
    const carIndex = carsDb.findIndex((car) => car.id === carId && car.ownerId === currentUser.id);
    if (carIndex === -1 && currentUser.role !== "admin") {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ error: "Access denied" }));
        res.end();
        return;
    }
    else {
        let rowBody = "";
        req.on("data", (chunk) => {
            rowBody += chunk;
        });
        req.on("end", () => {
            const body = JSON.parse(rowBody);
            if (!body.model || !body.price) {
                res.statusCode = 400;
                res.write(JSON.stringify({ error: "Model and price are required" }));
                res.end();
                return;
            }
            else {
                const carIndex = carsDb.findIndex((car) => car.id === carId);
                const updatedCar = { ...carsDb[carIndex], ...body };
                const updatedCarsDb = [...carsDb];
                updatedCarsDb[carIndex] = updatedCar;
                (0, db_1.collectionsUpdate)(res, cars, updatedCarsDb);
                res.statusCode = 200;
                res.write(JSON.stringify({
                    message: "Car updated successfully",
                }));
                res.end();
            }
        });
        return;
    }
};
exports.updateCar = updateCar;
