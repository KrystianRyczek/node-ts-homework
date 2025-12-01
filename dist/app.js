"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const authUsers_1 = __importDefault(require("./routes/authUsers"));
const authCars_1 = __importDefault(require("./routes/authCars"));
const sse_1 = __importDefault(require("./routes/sse"));
// import JWTStrategy from './config/jwt.js';
const jwt_js_1 = __importDefault(require("./middlewares/jwt.js"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/", express_1.default.static("../frontend"));
exports.app.use("/sse", sse_1.default);
exports.app.use("/api", users_1.default);
exports.app.use("/api", jwt_js_1.default, authUsers_1.default);
exports.app.use("/api", jwt_js_1.default, authCars_1.default);
exports.app.use((req, res) => {
    console.log("404 Not Found:", req.path);
    res.status(404).json({ message: `Not found - ${req.path}` });
});
exports.app.use((err, req, res, next) => {
    console.log("app error name", err.name);
    if (err.name === "ValidationError" || err.name === "BodyData") {
        return res.status(400).json({ serverErrorMessage: err.message });
    }
    if (err.name === "GetCarsFailed" || err.name === "GetUsersFailed") {
        return res.status(404).json({ serverErrorMessage: err.message });
    }
    if (err.name === "IncorrectCredentials" || err.name === "Unauthorized") {
        return res.status(401).json({ serverErrorMessage: err.message });
    }
    if (err.name === "BuyCarFailed" ||
        err.name === "AddNewCarFailed" ||
        err.name === "DeleteCarFailed" ||
        err.name === "AddNewUserFailed" ||
        err.name === "UpdateUserFailed" ||
        err.name === "DeleteUserFailed") {
        return res.status(403).json({ serverErrorMessage: err.message });
    }
    if (err.name === "OcupatedUserName") {
        return res.status(409).json({ serverErrorMessage: err.message });
    }
    res.status(500).json({ serverErrorMessage: err.message });
});
