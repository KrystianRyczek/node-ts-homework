"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const auth_1 = require("../util/auth");
const controlers_1 = require("../db/controlers");
const response_1 = require("../util/response");
const updateUser = (req, res, currentUser) => {
    let rowBody = "";
    req.on("data", (chunk) => {
        rowBody += chunk;
    });
    req.on("end", async () => {
        const body = JSON.parse(rowBody);
        if (!body.password || !body.username) {
            const statusCode = 400;
            const message = "User name and password are required";
            (0, response_1.response)({ res, statusCode, message, data: undefined });
        }
        else {
            if (currentUser.id) {
                const editedUser = await (0, controlers_1.editItem)("users", "id", currentUser.id, {
                    username: body.username,
                    password: (0, auth_1.hashPassword)(body.password),
                });
                if (editedUser && editedUser.length > 0) {
                    const statusCode = 200;
                    const message = "User updated successfully";
                    (0, response_1.response)({ res, statusCode, message, data: undefined });
                }
                else {
                    const statusCode = 500;
                    const message = "Failed to update user";
                    (0, response_1.response)({ res, statusCode, message, data: undefined });
                }
            }
        }
    });
};
exports.updateUser = updateUser;
