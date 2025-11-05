"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewUser = void 0;
const uuid_1 = require("uuid");
const auth_1 = require("../util/auth");
const db_1 = require("../db/db");
const addNewUser = (req, res) => {
    const users = process.env.USERS_DB_NAME || "users";
    let rowBody = "";
    req.on("data", (chunk) => {
        rowBody += chunk;
    });
    req.on("end", () => {
        const body = JSON.parse(rowBody);
        const userDb = (0, db_1.getCollection)(res, users);
        const userIndex = userDb === null || userDb === void 0 ? void 0 : userDb.findIndex((user) => user.username === body.username);
        if (userIndex !== -1) {
            res.statusCode = 409;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ error: "User already exists" }));
            res.end();
            return;
        }
        else {
            body.password = (0, auth_1.hashPassword)(body.password);
            const updatedUserDb = [
                ...userDb,
                {
                    id: (0, uuid_1.v4)(),
                    username: body.username,
                    password: body.password,
                    role: "user",
                    balance: 10000,
                    refreshToken: [],
                },
            ];
            (0, db_1.collectionsUpdate)(res, users, updatedUserDb);
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ message: "User registered successfully" }));
            res.end();
        }
    });
};
exports.addNewUser = addNewUser;
