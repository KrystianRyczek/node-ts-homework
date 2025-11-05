"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getCarsList;
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("./auth");
function getCarsList(req, res) {
    const cookies = (0, auth_1.parseCookies)(req);
    const user = cookies.token
        ? (0, auth_1.getUserFromToken)(cookies.token)
        : null;
    if (!user) {
        res.statusCode = 401;
        res.write(JSON.stringify({ error: "Unauthorized" }));
        res.end();
        return;
    }
    else {
        try {
            const carsDb = JSON.parse(fs_1.default.readFileSync("../db/cars.json", "utf8"));
            res.statusCode = 200;
            res.write(JSON.stringify(carsDb));
            res.end();
        }
        catch (err) {
            res.statusCode = 500;
            res.write(JSON.stringify({ error: "Internal Server Error" }));
            res.end();
        }
    }
}
