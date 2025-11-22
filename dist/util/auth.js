"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.getUserFromToken = getUserFromToken;
exports.setAuthCookie = setAuthCookie;
exports.parseCookies = parseCookies;
exports.hashPassword = hashPassword;
exports.clearAuthCookie = clearAuthCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config({ path: "../.env" });
const controlers_1 = require("../db/controlers");
function generateToken(id) {
    const payload = { id };
    const secret = process.env.SECRET;
    if (!secret) {
        throw new Error("SECRET environment variable is not defined");
    }
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    return token;
}
async function getUserFromToken(token) {
    const secret = process.env.SECRET;
    if (!secret) {
        throw new Error("SECRET environment variable is not defined");
    }
    const { id, ...rest } = jsonwebtoken_1.default.verify(token, secret);
    const user = await (0, controlers_1.getItemByProperty)("users", "id", id);
    if (user) {
        return user[0];
    }
    return null;
}
function setAuthCookie(res, token) {
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; secure; Max-Age=600`);
}
function parseCookies(req) {
    const cookieHeader = req.headers.cookie;
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(";").forEach((cookie) => {
            const [name, value] = cookie.trim().split("=");
            cookies[name] = decodeURIComponent(value);
        });
    }
    return cookies;
}
function hashPassword(password) {
    const saltRounds = process.env.SALT_ROUNDS;
    if (!saltRounds) {
        throw new Error("SALT_ROUNDS environment variable is not defined");
    }
    else {
        return bcrypt_1.default.hashSync(password, parseInt(saltRounds));
    }
}
function clearAuthCookie(res) {
    res.setHeader("Set-Cookie", `token=; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
}
