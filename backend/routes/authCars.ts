import express from "express";
import { getCarsList } from "../services/get-cars";
import { addNewCar } from "../services/new-car";
import { buyCar } from "../services/buy-car";
import { updateCar } from "../services/update-car";
import { deleteCar } from "../services/delete-car";

const router = express.Router();

router.get("/cars", getCarsList);
router.post("/cars", addNewCar);
router.put("/cars/:id", updateCar);
router.delete("/cars/:id", deleteCar);
router.post("/cars/:id/buy", buyCar);

export default router;
