"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_cars_1 = require("../services/get-cars");
const new_car_1 = require("../services/new-car");
const buy_car_1 = require("../services/buy-car");
const update_car_1 = require("../services/update-car");
const delete_car_1 = require("../services/delete-car");
const router = express_1.default.Router();
router.get("/cars", get_cars_1.getCarsList);
router.post("/cars", new_car_1.addNewCar);
router.put("/cars/:id", update_car_1.updateCar);
router.delete("/cars/:id", delete_car_1.deleteCar);
router.post("/cars/:id/buy", buy_car_1.buyCar);
exports.default = router;
