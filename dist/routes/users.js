"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_user_1 = require("../services/login-user");
const new_user_1 = require("../services/new-user");
const router = express_1.default.Router();
router.post("/register", new_user_1.addNewUser);
router.post("/login", login_user_1.loginUser);
exports.default = router;
