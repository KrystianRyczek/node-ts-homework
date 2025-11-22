"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const controlers_1 = require("./db/controlers");
dotenv_1.default.config({ path: "../.env" });
const port = process.env.PORT || "3000";
if (!port) {
    throw new Error("PORT environment variable is not defined");
}
const serverPort = parseInt(port);
const server = (0, http_1.createServer)(async (req, res) => {
    (0, routes_1.default)(req, res);
});
server.listen(serverPort, async () => {
    console.log(`Server running on http://localhost:${serverPort}`);
    try {
        await (0, controlers_1.createUsersTable)();
        await (0, controlers_1.createCarsTable)();
        // await addNewItem("users", {
        //   username: "admin",
        //   password: "admin123",
        //   role: "admin",
        //   balance: 1000,
        // });
        // await getItemByProperty("users", "username", "admin");
        // await deleteItem("users", 2);
        // await editItem("users", "id", 1, {
        //   username: "admin1",
        //   password: "newpassword1",
        //   role: "admin",
        // });
    }
    catch (e) {
        console.log("Error during table creation:", e);
    }
});
