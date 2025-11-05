"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addNewCar;
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("./auth");
const uuid_1 = require("uuid");
function addNewCar(req, res) {
    const cookies = (0, auth_1.parseCookies)(req);
    const currentUser = cookies.token ? (0, auth_1.getUserFromToken)(cookies.token) : null;
    if (!currentUser) {
        res.statusCode = 401;
        res.write(JSON.stringify({ error: "Unauthorized" }));
        res.end();
        return;
    }
    else {
        const userId = currentUser.id;
        let rawBody = "";
        req.on("data", (chunk) => {
            rawBody += chunk;
        });
        req.on("end", () => {
            const body = JSON.parse(rawBody);
            if (body.model && body.price) {
                const carsDb = JSON.parse(fs_1.default.readFileSync("../db/cars.json", "utf8"));
                carsDb.push({ id: (0, uuid_1.v4)(), ...body, ownerId: userId });
                fs_1.default.writeFileSync("../db/cars.json", JSON.stringify(carsDb, null, 2));
                res.statusCode = 201;
                res.write(JSON.stringify({ message: "Car added successfully" }));
            }
            else {
                res.statusCode = 400;
                res.write(JSON.stringify({ error: "Invalid car data" }));
            }
            res.end();
        });
    }
}
