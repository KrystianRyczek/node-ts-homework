"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCarById = exports.editCar = exports.createNewCar = exports.getCars = exports.getCarById = exports.deleteUserbyId = exports.editUser = exports.getUsers = exports.getUserById = exports.getUserByName = exports.createNewUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNewUser = async (newUser) => {
    const user = await prisma.user.create({
        data: {
            username: newUser.username,
            password: newUser.password,
        },
    });
    if (user) {
        return user;
    }
    return null;
};
exports.createNewUser = createNewUser;
const getUserByName = async (value) => {
    const item = await prisma.user.findFirst({
        where: {
            username: {
                equals: value,
                mode: "insensitive",
            },
        },
    });
    if (item) {
        return item;
    }
    return null;
};
exports.getUserByName = getUserByName;
const getUserById = async (tableName, property, value) => {
    const item = await prisma.user.findFirst({
        where: {
            id: Number(value),
        },
    });
    if (item) {
        return item;
    }
    return null;
};
exports.getUserById = getUserById;
const getUsers = async () => {
    const users = await prisma.user.findMany({});
    if (users) {
        return users;
    }
    return null;
};
exports.getUsers = getUsers;
const editUser = async (userId, updatedItem) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: updatedItem,
    });
    if (updatedUser) {
        return updatedUser;
    }
    return null;
};
exports.editUser = editUser;
const deleteUserbyId = async (userID) => {
    const deletedUser = await prisma.user.delete({
        where: {
            id: Number(userID),
        },
    });
    if (deletedUser) {
        return deletedUser;
    }
    return null;
};
exports.deleteUserbyId = deleteUserbyId;
const getCarById = async (carID) => {
    console.log("Fetching user by ID:", carID);
    const car = await prisma.cars.findFirst({
        where: {
            id: Number(carID),
        },
    });
    if (car) {
        return car;
    }
    return null;
};
exports.getCarById = getCarById;
const getCars = async () => {
    const cars = await prisma.cars.findMany({});
    if (cars) {
        return cars;
    }
    return null;
};
exports.getCars = getCars;
const createNewCar = async (newCar) => {
    const createdCar = await prisma.cars.create({
        data: {
            model: newCar.model,
            price: newCar.price,
            ownerId: newCar.ownerId,
        },
    });
    if (createdCar) {
        return createdCar;
    }
    return null;
};
exports.createNewCar = createNewCar;
const editCar = async (carId, car) => {
    const updatedCar = await prisma.cars.update({
        where: {
            id: carId,
        },
        data: car,
    });
    if (updatedCar) {
        return updatedCar;
    }
    return null;
};
exports.editCar = editCar;
const deleteCarById = async (carId) => {
    const deletedCar = await prisma.cars.delete({
        where: {
            id: Number(carId),
        },
    });
    if (deletedCar) {
        return deletedCar;
    }
    return null;
};
exports.deleteCarById = deleteCarById;
