"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const port = process.env.PORT || "3000";
if (!port) {
    throw new Error("PORT environment variable is not defined");
}
const serverPort = parseInt(port);
const server = (0, http_1.createServer)(async (req, res) => {
    (0, routes_1.default)(req, res);
});
server.listen(serverPort, () => {
    console.log(`Server running on http://localhost:${serverPort}`);
});
