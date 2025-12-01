import sql from "./db";
import { hashPassword } from "../util/auth";
import { Car, User } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createNewUser = async (newUser: {
  [key: string]: string | number;
}) => {
  const user = await prisma.user.create({
    data: {
      username: newUser.username as string,
      password: newUser.password as string,
    },
  });
  if (user) {
    return user;
  }
  return null;
};

export const getUserByName = async (value: string | number) => {
  const item = await prisma.user.findFirst({
    where: {
      username: {
        equals: value as string,
        mode: "insensitive",
      },
    },
  });
  if (item) {
    return item;
  }
  return null;
};

export const getUserById = async (
  tableName: string,
  property: string,
  value: string | number
) => {
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

export const getUsers = async () => {
  const users = await prisma.user.findMany({});
  if (users) {
    return users;
  }
  return null;
};

export const editUser = async (userId: number, updatedItem: Partial<User>) => {
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

export const deleteUserbyId = async (userID: number) => {
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

export const getCarById = async (carID: number) => {
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

export const getCars = async () => {
  const cars = await prisma.cars.findMany({});
  if (cars) {
    return cars;
  }
  return null;
};
export const createNewCar = async (newCar: {
  [key: string]: string | number;
}) => {
  const createdCar = await prisma.cars.create({
    data: {
      model: newCar.model as string,
      price: newCar.price as number,
      ownerId: newCar.ownerId as number,
    },
  });
  if (createdCar) {
    return createdCar;
  }
  return null;
};

export const editCar = async (carId: number, car: Partial<Car>) => {
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

export const deleteCarById = async (carId: number) => {
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
