"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarsList = void 0;
const db_1 = require("../db/db");
const getCarsList = (res) => {
    const cars = process.env.CARS_DB_NAME || "cars";
    const carsDb = (0, db_1.getCollection)(res, cars);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(carsDb));
    res.end();
};
exports.getCarsList = getCarsList;
