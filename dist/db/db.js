"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionsUpdate = exports.getCollection = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getCollection = (res, collectionName) => {
    try {
        const absPath = path_1.default.resolve(__dirname, `../../db/${collectionName}.json`);
        const dbData = JSON.parse(fs_1.default.readFileSync(absPath, "utf8"));
        return dbData;
    }
    catch (e) {
        console.error("Error adding new user:", e);
        res.statusCode = 500;
        res.write(JSON.stringify({ error: "Internal Server Error" }));
        res.end();
        return [];
    }
};
exports.getCollection = getCollection;
const collectionsUpdate = (res, collectionName, updatedData) => {
    const absPath = path_1.default.resolve(__dirname, `../../db/${collectionName}.json`);
    try {
        fs_1.default.writeFileSync(absPath, JSON.stringify(updatedData, null, 2), "utf8");
    }
    catch (e) {
        console.error("Error updating collections:", e);
        res.statusCode = 500;
        res.write(JSON.stringify({ error: "Internal Server Error" }));
        res.end();
    }
};
exports.collectionsUpdate = collectionsUpdate;
