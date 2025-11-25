"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("postgres"));
const { POSTGRES_HOST: host } = process.env;
const { POSTGRES_PORT: port } = process.env;
const { POSTGRES_DB: database } = process.env;
const { POSTGRES_USER: user } = process.env;
const { POSTGRES_PASSWORD: password } = process.env;
console.log("Connecting to Postgres with:", {
    host,
    port,
    database,
    user,
    password: password ? "****" : undefined,
});
const sql = (0, postgres_1.default)({
    user,
    password,
    host,
    port: port ? parseInt(port) : 5432,
    database,
});
exports.default = sql;
