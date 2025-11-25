"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewUser = void 0;
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../util/auth");
const controlers_1 = require("../db/controlers");
const signUpSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required(),
    password: joi_1.default.string().min(3).max(30).required(),
});
const addNewUser = async (req, res, next) => {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    try {
        const dbRespons = await (0, controlers_1.getItemByProperty)("users", "username", req.body.username);
        if (dbRespons && dbRespons.length > 0) {
            const user = dbRespons[0];
            if (user) {
                throw new Error("User name is taken!");
            }
        }
    }
    catch (error) {
        console.log(error);
        error.name = "OcupatedUserName";
        return next(error);
    }
    try {
        const password = (0, auth_1.hashPassword)(req.body.password);
        const newUser = { ...req.body, password };
        await (0, controlers_1.addNewItem)("users", newUser);
        res.status(201).json("User created successfully");
    }
    catch (error) {
        console.log(error);
        error.name = "AddNewUserFailed";
        next(error);
    }
};
exports.addNewUser = addNewUser;
