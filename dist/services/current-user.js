"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = void 0;
const controlers_1 = require("../db/controlers");
const getCurrentUser = async (req, res, next) => {
    const user = res.locals.user;
    if (user.role !== "admin") {
        res.status(200).json(user);
        return;
    }
    try {
        const users = await (0, controlers_1.getUsers)();
        if (users && users.length > 0) {
            res.status(200).json(users);
            return;
        }
        throw new Error("No users found");
    }
    catch (error) {
        console.log(error);
        error.name = "GetUsersFailed";
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
