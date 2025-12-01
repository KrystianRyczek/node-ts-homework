"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const controlers_1 = require("../db/controlers");
// import { response } from "../util/response";
const deleteUser = async (req, res, next) => {
    const userid = Number(req.params.id);
    const user = res.locals.user;
    try {
        if (user.role !== "admin" && user.id !== userid) {
            const deletedUsers = await (0, controlers_1.deleteUserbyId)(userid);
            if (deletedUsers) {
                res.status(200).json("User deleted successfully");
                return;
            }
            throw new Error("Failed to delete user");
        }
        throw new Error("Forbidden: You don't have permission to delete this user");
    }
    catch (error) {
        error.name = "DeleteUserFailed";
        return next(error);
    }
};
exports.deleteUser = deleteUser;
