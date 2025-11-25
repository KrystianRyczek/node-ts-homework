import express from "express";
import { getCurrentUser } from "../services/current-user";
import { updateUser } from "../services/update-user";
import { deleteUser } from "../services/delete-user";

const router = express.Router();

router.get("/users", getCurrentUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
