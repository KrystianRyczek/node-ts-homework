"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseHandler = exports.buyEventEmiter = void 0;
const stream_1 = require("stream");
exports.buyEventEmiter = new stream_1.EventEmitter();
const sseHandler = (req, res, next) => {
    res.setHeader("Content-Type", " text/event-stream");
    res.setHeader("Cache-control", " no-cache");
    res.setHeader("Connection", " keep-alive");
    res.write("SSE initialized\n\n");
    exports.buyEventEmiter.on("buyCar", (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    });
    res.on("close", () => {
        console.log("SSE connection closed");
        res.end();
    });
};
exports.sseHandler = sseHandler;
