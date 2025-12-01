import type { Request, Response, NextFunction } from "express";
import { EventLog } from "../types";
import { EventEmitter } from "stream";

export const buyEventEmiter = new EventEmitter();

export const sseHandler = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", " text/event-stream");
  res.setHeader("Cache-control", " no-cache");
  res.setHeader("Connection", " keep-alive");
  res.write("SSE initialized\n\n");

  buyEventEmiter.on("buyCar", (event: EventLog) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  res.on("close", () => {
    console.log("SSE connection closed");
    res.end();
  });
};
