"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.editItem = exports.getItems = exports.getItemByProperty = exports.addNewItem = exports.createCarsTable = exports.createUsersTable = void 0;
const db_1 = __importDefault(require("./db"));
const auth_1 = require("../util/auth");
const createUsersTable = async () => {
    console.log("Creating USERS table not exists.");
    console.log("Creating USERS table...");
    await (0, db_1.default) `CREATE TABLE IF NOT EXISTS USERS( id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, role VARCHAR(10) DEFAULT 'user', balance FLOAT DEFAULT 10000);`;
    const dbRespons = await (0, db_1.default) `SELECT * FROM USERS;`;
    if (dbRespons.length === 0) {
        await (0, db_1.default) `INSERT INTO USERS (username, password, role) VALUES ('admin', ${(0, auth_1.hashPassword)(process.env.ADMIN_PASSWORD || "admin123")}, 'admin');`;
    }
};
exports.createUsersTable = createUsersTable;
const createCarsTable = async () => {
    console.log("CARS table not exists.");
    console.log("Creating CARS table...");
    await (0, db_1.default) `CREATE TABLE IF NOT EXISTS CARS( id SERIAL PRIMARY KEY, model VARCHAR(100) NOT NULL, price FLOAT NOT NULL, ownerId VARCHAR(100) );`;
};
exports.createCarsTable = createCarsTable;
const addNewItem = async (tableName, item) => {
    const propertysArr = Object.keys(item);
    const addedItem = await (0, db_1.default) `INSERT INTO ${(0, db_1.default)(tableName)} ${(0, db_1.default)(item, propertysArr)} RETURNING *;`;
    if (addedItem.length === 0) {
        return addedItem;
    }
    else {
        return null;
    }
};
exports.addNewItem = addNewItem;
const getItemByProperty = async (tableName, property, value) => {
    const item = await (0, db_1.default) `SELECT * FROM ${(0, db_1.default)(tableName)} WHERE ${(0, db_1.default)(property)} = ${value} ;`;
    if (item.length > 0) {
        return item;
    }
    return null;
};
exports.getItemByProperty = getItemByProperty;
const getItems = async (tableName) => {
    const items = await (0, db_1.default) `SELECT * FROM ${(0, db_1.default)(tableName)} RETURNING *;`;
    if (items.length > 0) {
        return items;
    }
    return null;
};
exports.getItems = getItems;
const editItem = async (tableName, propertyName, propertyValue, updatedItem) => {
    const updatedItems = await (0, db_1.default) `UPDATE ${(0, db_1.default)(tableName)} SET ${(0, db_1.default)(updatedItem)} WHERE ${(0, db_1.default)(propertyName)} = ${propertyValue} RETURNING *;`;
    if (updatedItems.length > 0) {
        return updatedItems;
    }
    return null;
};
exports.editItem = editItem;
const deleteItem = async (tableName, itemId) => {
    const deletedItems = await (0, db_1.default) `DELETE FROM ${(0, db_1.default)(tableName)} WHERE id = ${itemId} RETURNING *;`;
    if (deletedItems.length > 0) {
        return deletedItems;
    }
    return null;
};
exports.deleteItem = deleteItem;
