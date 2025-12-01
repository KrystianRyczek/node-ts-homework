import express from "express";
import { loginUser } from "../services/login-user";
import { addNewUser } from "../services/new-user";

const router = express.Router();

router.post("/register", addNewUser);
router.post("/login", loginUser);

export default router;
