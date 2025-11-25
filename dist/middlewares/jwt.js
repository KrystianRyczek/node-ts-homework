"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../util/auth");
async function authMiddleware(req, res, next) {
    const token = (0, auth_1.parseCookies)(req).token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
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
