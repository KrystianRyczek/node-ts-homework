"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const response = ({ res, message, statusCode, data, }) => {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    data
        ? res.write(JSON.stringify({ message, data }))
        : res.write(JSON.stringify({ message }));
    res.end();
    return;
};
exports.response = response;
