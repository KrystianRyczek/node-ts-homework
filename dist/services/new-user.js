"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewUser = void 0;
const auth_1 = require("../util/auth");
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const addNewUser = (req, res) => {
    let rowBody = "";
    req.on("data", (chunk) => {
        rowBody += chunk;
    });
    req.on("end", async () => {
        const body = JSON.parse(rowBody);
        if (!body.username || !body.password) {
            const statusCode = 400;
            const message = "User name and password are required";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        const user = await (0, controlers_1.getItemByProperty)("users", "username", body.username);
        if (user && user.length > 0) {
            const statusCode = 409;
            const message = "User already exists";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            const newUser = await (0, controlers_1.addNewItem)("users", {
                username: body.username,
                password: (0, auth_1.hashPassword)(body.password),
            });
            if (newUser && newUser.length > 0) {
                const statusCode = 201;
                const message = "User registered successfully";
                (0, response_1.response)({ res, statusCode, message, data: undefined });
                return;
            }
            else {
                const statusCode = 500;
                const message = "Failed to register user";
                (0, response_1.response)({ res, statusCode, message, data: undefined });
                return;
            }
        }
    });
};
exports.addNewUser = addNewUser;
