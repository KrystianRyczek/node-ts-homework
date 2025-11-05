"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsFile = exports.cssFile = exports.htmlFile = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = __importDefault(require("fs"));
const htmlFile = (res) => {
    try {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        const htmlFile = fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, "../../frontend/index.html"));
        res.write(htmlFile);
        res.end();
    }
    catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.write("<h1>Internal Server Error</h1>");
        res.end();
    }
};
exports.htmlFile = htmlFile;
const cssFile = (res) => {
    try {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/css");
        const cssFile = fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, "../../frontend/style.css"));
        res.write(cssFile);
        res.end();
    }
    catch (e) {
        res.statusCode = 500;
        res.write("Internal server error!");
        res.end();
    }
};
exports.cssFile = cssFile;
const jsFile = (res) => {
    try {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/javascript");
        const jsFile = fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, "../../frontend/main.js"));
        res.write(jsFile);
        res.end();
    }
    catch (e) {
        res.statusCode = 500;
        res.write("Internal server error!");
        res.end();
    }
};
exports.jsFile = jsFile;
