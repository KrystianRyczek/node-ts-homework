import express from "express";
import { sseHandler } from "../services/sse";

const router = express.Router();

router.get("", sseHandler);
export default router;
