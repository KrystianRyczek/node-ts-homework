"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const app_1 = require("./app");
require("dotenv").config();
const { PORT: port } = process.env;
const startServer = async () => {
    try {
        app_1.app.listen(port, () => {
            console.log("Server running. Use our API on port:", port);
        });
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
};
startServer();
