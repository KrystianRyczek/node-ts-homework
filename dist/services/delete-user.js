"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const deleteUser = async (req, res, currentUser) => {
    var _a;
    const users = process.env.USERS_DB_NAME || "users";
    const userId = Number((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2]);
    if (currentUser.role !== "admin" && currentUser.id !== userId) {
        const statusCode = 403;
        const message = "Forbidden: You don't have permission to delete this user";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
    else {
        const deletedUsers = await (0, controlers_1.deleteItem)(users, userId);
        if (deletedUsers && deletedUsers.length > 0) {
            const statusCode = 200;
            const message = "User deleted successfully";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            const statusCode = 409;
            const message = "User not found";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
    }
};
exports.deleteUser = deleteUser;
