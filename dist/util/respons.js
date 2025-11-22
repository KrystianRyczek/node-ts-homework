"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respons = void 0;
const respons = ({ res, message, statusCode, }) => {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify({ message }));
    res.end();
    return;
};
exports.respons = respons;
