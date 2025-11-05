"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const db_1 = require("../db/db");
const getCurrentUser = (req, res, currentUser) => {
    const users = process.env.USERS_DB_NAME || "users";
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    if (currentUser.role === "admin") {
        const userDb = (0, db_1.getCollection)(res, users);
        res.write(JSON.stringify(userDb));
    }
    else {
        res.write(JSON.stringify(currentUser));
    }
    res.end();
};
exports.getCurrentUser = getCurrentUser;
