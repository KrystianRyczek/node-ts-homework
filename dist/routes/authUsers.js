"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const current_user_1 = require("../services/current-user");
const update_user_1 = require("../services/update-user");
const delete_user_1 = require("../services/delete-user");
const router = express_1.default.Router();
router.get("/users", current_user_1.getCurrentUser);
router.put("/users/:id", update_user_1.updateUser);
router.delete("/users/:id", delete_user_1.deleteUser);
exports.default = router;
