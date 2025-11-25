"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const auth_1 = require("../util/auth");
const controlers_1 = require("../db/controlers");
const updateUser = async (req, res, next) => {
    const currentUser = res.locals.user;
    try {
        if (!req.body.password || !req.body.username) {
            throw new Error("User name and password are required");
        }
    }
    catch (error) {
        console.log(error);
        error.name = "NoBodyData";
        return next(error);
    }
    try {
        if (currentUser.role === "admin" || currentUser.id === +req.params.id) {
            const editedUser = await (0, controlers_1.editItem)("users", "id", +req.params.id, {
                username: req.body.username,
                password: (0, auth_1.hashPassword)(req.body.password),
            });
            if (editedUser && editedUser.length > 0) {
                res.status(200).json("User updated successfully");
                return;
            }
            throw new Error("Failed to update user");
        }
        throw new Error("Access denied");
    }
    catch (error) {
        console.log(error);
        error.name = "UpdateUserFailed";
        return next(error);
    }
};
exports.updateUser = updateUser;
