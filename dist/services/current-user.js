"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const getCurrentUser = async (req, res, currentUser) => {
    if (currentUser.role !== "admin") {
        const statusCode = 200;
        const message = JSON.stringify(currentUser);
        const data = currentUser;
        (0, response_1.response)({ res, statusCode, message, data });
    }
    else {
        const users = await (0, controlers_1.getItems)("users");
        if (users && users.length > 0) {
            const statusCode = 200;
            const message = JSON.stringify(users);
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            const statusCode = 404;
            const message = "No users found";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
    }
};
exports.getCurrentUser = getCurrentUser;
