"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const db_1 = require("../db/db");
const deleteUser = (req, res) => {
    var _a;
    const users = process.env.USERS_DB_NAME || "users";
    const userId = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split("/")[2];
    const userDb = (0, db_1.getCollection)(res, users);
    const userIndex = userDb.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        const updatedUserDb = userDb.filter((user) => user.id !== userId);
        (0, db_1.collectionsUpdate)(res, users, updatedUserDb);
        res.statusCode = 200;
        res.write(JSON.stringify({
            message: "User deleted successfully",
        }));
        res.end();
    }
    else {
        res.statusCode = 409;
        res.write(JSON.stringify({ error: "User not found" }));
        res.end();
    }
};
exports.deleteUser = deleteUser;
