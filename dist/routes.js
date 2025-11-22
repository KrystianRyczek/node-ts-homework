"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const auth_1 = require("./util/auth");
const fetchStatic_1 = require("./services/fetchStatic");
const new_user_1 = require("./services/new-user");
const login_user_1 = require("./services/login-user");
const current_user_1 = require("./services/current-user");
const update_user_1 = require("./services/update-user");
const get_cars_1 = require("./services/get-cars");
const new_car_1 = require("./services/new-car");
const buy_car_1 = require("./services/buy-car");
const sse_1 = require("./services/sse");
const delete_user_1 = require("./services/delete-user");
const delete_car_1 = require("./services/delete-car");
const update_car_1 = require("./services/update-car");
async function routes(req, res) {
    var _a, _b, _c, _d;
    console.log(`Received ${req.method} request for ${req.url}`);
    if (req.method === "GET" && req.url === "/") {
        return (0, fetchStatic_1.htmlFile)(res);
    }
    else if (req.method === "GET" && req.url === "/style.css") {
        return (0, fetchStatic_1.cssFile)(res);
    }
    else if (req.method === "GET" && req.url === "/main.js") {
        return (0, fetchStatic_1.jsFile)(res);
    }
    else if (req.method === "POST" && req.url === "/register") {
        return (0, new_user_1.addNewUser)(req, res);
    }
    else if (req.method === "POST" && req.url === "/login") {
        return (0, login_user_1.loginUser)(req, res);
    }
    const cookies = (0, auth_1.parseCookies)(req);
    const currentUser = cookies.token
        ? await (0, auth_1.getUserFromToken)(cookies.token)
        : null;
    if (!currentUser) {
        res.statusCode = 401;
        res.write(JSON.stringify({ error: "Unauthorized" }));
        res.end();
        return;
    }
    else {
        if (req.method === "GET" && req.url === "/users") {
            return (0, current_user_1.getCurrentUser)(req, res, currentUser);
        }
        else if (req.method === "PUT" && req.url === `/users/${currentUser.id}`) {
            return (0, update_user_1.updateUser)(req, res, currentUser);
        }
        else if (req.method === "DELETE" &&
            (req.url === `/users/${currentUser.id}` || currentUser.role === "admin")) {
            return (0, delete_user_1.deleteUser)(req, res, currentUser);
        }
        else if (req.method === "GET" && req.url === "/cars") {
            return (0, get_cars_1.getCarsList)(res);
        }
        else if (req.method === "POST" && req.url === "/cars") {
            return (0, new_car_1.addNewCar)(req, res, currentUser);
        }
        else if (req.method === "DELETE" && ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith("/cars"))) {
            return (0, delete_car_1.deleteCar)(req, res, currentUser);
        }
        else if (req.method === "PUT" && ((_b = req.url) === null || _b === void 0 ? void 0 : _b.startsWith("/cars"))) {
            return (0, update_car_1.updateCar)(req, res, currentUser);
        }
        else if (req.method === "POST" &&
            ((_c = req.url) === null || _c === void 0 ? void 0 : _c.startsWith("/cars")) &&
            ((_d = req.url) === null || _d === void 0 ? void 0 : _d.endsWith("/buy"))) {
            return (0, buy_car_1.buyCar)(req, res, currentUser);
        }
        else if (req.method === "GET" && req.url === "/sse") {
            return (0, sse_1.sseHandler)(req, res);
        }
        else {
            res.statusCode = 404;
            res.write(JSON.stringify({ error: "Not Found" }));
            res.end();
            return;
        }
    }
}
