"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../util/auth");
const controlers_1 = require("../db/controlers");
const loginUser = async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        const error = new Error("Username and password are required");
        error.name = "BodyData";
        return next(error);
    }
    try {
        const dbResponse = await (0, controlers_1.getItemByProperty)("users", "username", req.body.username);
        if (dbResponse && dbResponse.length > 0) {
            const user = dbResponse;
            const passwordMatch = bcrypt_1.default.compareSync(req.body.password, user[0].password);
            if (passwordMatch) {
                const token = (0, auth_1.generateToken)(`${user[0].id}`);
                (0, auth_1.setAuthCookie)(res, token);
                res.status(200).json("Login successful");
                return;
            }
        }
        throw new Error("User credentials are invalid");
    }
    catch (error) {
        error.name = "IncorrectCredentials";
        return next(error);
    }
};
exports.loginUser = loginUser;
