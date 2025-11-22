"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../util/auth");
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const loginUser = (req, res) => {
    let rowBody = "";
    req.on("data", (chunk) => {
        rowBody += chunk;
    });
    req.on("end", async () => {
        const body = JSON.parse(rowBody);
        if (!body.username || !body.password) {
            const statusCode = 400;
            const message = "Username and password are required";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        const user = (await (0, controlers_1.getItemByProperty)("users", "username", body.username));
        if (user.length === 0) {
            const statusCode = 401;
            const message = "User credentials are invalid";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            const passwordMatch = bcrypt_1.default.compareSync(body.password, user[0].password);
            if (!passwordMatch) {
                const statusCode = 401;
                const message = "User credentials are invalid";
                (0, response_1.response)({ res, statusCode, message, data: undefined });
            }
            else {
                const token = (0, auth_1.generateToken)(`${user[0].id}`);
                (0, auth_1.setAuthCookie)(res, token);
                const statusCode = 200;
                const message = "Login successful";
                (0, response_1.response)({ res, statusCode, message, data: undefined });
            }
        }
    });
};
exports.loginUser = loginUser;
