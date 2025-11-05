"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../util/auth");
const db_1 = require("../db/db");
const loginUser = (req, res) => {
    const users = process.env.USERS_DB_NAME || "users";
    let rowBody = "";
    req.on("data", (chunk) => {
        rowBody += chunk;
    });
    req.on("end", () => {
        const body = JSON.parse(rowBody);
        if (!body.username || !body.password) {
            res.statusCode = 400;
            res.write(JSON.stringify({ error: "Username and password are required" }));
            res.end();
            return;
        }
        else {
            const userDb = (0, db_1.getCollection)(res, users);
            const user = userDb.find((user) => user.username === body.username);
            const passwordMatch = user
                ? bcrypt_1.default.compareSync(body.password, user.password)
                : false;
            if (user && passwordMatch) {
                const token = (0, auth_1.generateToken)(user.id);
                (0, auth_1.setAuthCookie)(res, token);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify({ message: "Login successful" }));
                res.end();
            }
            else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify({ error: "Invalid username or password" }));
                res.end();
            }
        }
    });
};
exports.loginUser = loginUser;
