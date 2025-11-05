"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("./auth");
const loginUser = (req, res) => {
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
            try {
                const userDb = JSON.parse(fs_1.default.readFileSync("../db/users.json", "utf8"));
                const user = userDb.find((user) => user.username === body.username);
                const passwordMatch = user
                    ? bcrypt_1.default.compareSync(body.password, user.password)
                    : false;
                if (user && passwordMatch) {
                    const token = (0, auth_1.generateToken)(user.id);
                    (0, auth_1.setAuthCookie)(res, token);
                    res.statusCode = 200;
                    res.write(JSON.stringify({ message: "Login successful", user }));
                    res.end();
                }
                else {
                    res.statusCode = 401;
                    res.write(JSON.stringify({ error: "Invalid username or password" }));
                    res.end();
                }
            }
            catch (error) {
                res.statusCode = 500;
                res.write(JSON.stringify({ error: "Internal Server Error" }));
                res.end();
            }
        }
    });
};
exports.loginUser = loginUser;
