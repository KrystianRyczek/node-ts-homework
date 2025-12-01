"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = __importDefault(require("fs"));
const response_1 = require("../util/response");
const express_1 = __importDefault(require("express"));
const htmlFile = (res) => {
    console.log("Serving HTML file");
    const pathToHtml = node_path_1.default.resolve(__dirname, "../../frontend/index.html");
    express_1.default.static(pathToHtml);
};
const cssFile = (res) => {
    try {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/css");
        const cssFile = fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, "../../frontend/style.css"));
        res.write(cssFile);
        res.end();
    }
    catch (e) {
        const statusCode = 500;
        const message = "Internal server error!";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
};
const jsFile = (res) => {
    try {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/javascript");
        const jsFile = fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, "../../frontend/main.js"));
        res.write(jsFile);
        res.end();
    }
    catch (e) {
        const statusCode = 500;
        const message = "Internal server error!";
        (0, response_1.response)({ res, statusCode, message, data: undefined });
    }
};
exports.default = { htmlFile, cssFile, jsFile };
