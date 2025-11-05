"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyCar = void 0;
const db_1 = require("../db/db");
const sse_1 = require("./sse");
const buyCar = (req, res, currentUser) => {
    var _a;
    const users = process.env.USERS_DB_NAME || "users";
    const cars = process.env.CARS_DB_NAME || "cars";
    const carId = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2];
    const carsDb = (0, db_1.getCollection)(res, cars);
    const carIndex = carsDb.findIndex((car) => car.id === carId);
    if (carIndex === -1) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ error: "Car not found" }));
        res.end();
        return;
    }
    else {
        const userDb = (0, db_1.getCollection)(res, users);
        const userIndex = userDb.findIndex((user) => user.id === currentUser.id);
        if (userIndex === -1) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ error: "User not found" }));
            res.end();
            return;
        }
        else {
            const availableCars = carsDb.filter((car) => car.id !== carId);
            (0, db_1.collectionsUpdate)(res, cars, availableCars);
            const updatedUser = [...userDb];
            updatedUser[userIndex].balance -= carsDb[carIndex].price;
            (0, db_1.collectionsUpdate)(res, users, updatedUser);
            const newEvent = {
                carId: carsDb[carIndex].id,
                ownerId: currentUser.id,
                model: carsDb[carIndex].model,
                event: "sell",
            };
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ message: "Car purchased successfully" }));
            res.end();
            sse_1.buyEventEmiter.emit("buyCar", newEvent);
            return;
        }
    }
};
exports.buyCar = buyCar;
