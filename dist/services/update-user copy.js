"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const auth_1 = require("../util/auth");
const db_1 = require("../db/db");
const updateUser = (req, res, currentUser) => {
    let rowBody = "";
    req.on("data", (chunk) => {
        rowBody += chunk;
    });
    req.on("end", () => {
        const body = JSON.parse(rowBody);
        if (!body.password || !body.username) {
            res.statusCode = 400;
            res.write(JSON.stringify({ error: "User name and password are required" }));
            res.end();
            return;
        }
        body.password = (0, auth_1.hashPassword)(body.password);
        const userDb = (0, db_1.getCollection)(res, "../db/users.json");
        const userIndex = userDb.findIndex((user) => user.id === currentUser.id);
        if (userIndex !== -1) {
            const updatedUser = { ...userDb[userIndex], ...body };
            const updatedUserDb = [...userDb];
            updatedUserDb[userIndex] = updatedUser;
            (0, db_1.collectionsUpdate)(res, "../db/users.json", updatedUserDb);
            res.statusCode = 200;
            res.write(JSON.stringify({
                message: "User updated successfully",
                user: updatedUser,
            }));
            res.end();
        }
        else {
            res.statusCode = 409;
            res.write(JSON.stringify({ error: "User not found" }));
            res.end();
        }
    });
};
exports.updateUser = updateUser;
