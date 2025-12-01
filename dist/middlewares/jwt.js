"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../util/auth");
async function authMiddleware(req, res, next) {
    const token = (0, auth_1.parseCookies)(req).token;
    try {
        if (!token) {
            throw new Error("No token provided");
        }
        const user = await (0, auth_1.getUserFromToken)(token);
        if (!user) {
            throw new Error("User not found");
        }
        if (user) {
            res.locals.user = user;
            return next();
        }
        throw new Error("Invalid token");
    }
    catch (err) {
        err.name = "Unauthorized";
        return next(err);
    }
}
exports.default = authMiddleware;
