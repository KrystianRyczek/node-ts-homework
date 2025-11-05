"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = void 0;
const db_1 = require("../db/db");
const deleteCar = (req, res, currentUser) => {
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
        const updatedCars = carsDb.filter((car) => car.id !== carId);
        (0, db_1.collectionsUpdate)(res, cars, updatedCars);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ message: "Car deleted successfully" }));
        res.end();
        return;
    }
};
exports.deleteCar = deleteCar;
