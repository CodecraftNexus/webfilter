"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = void 0;
const env_1 = require("../config/env");
const parseDuratin_1 = __importDefault(require("./parseDuratin"));
const isProd = env_1.env.NODE_ENV != "production";
const setAuthCookies = (res, accessToken, refreshTokenPlain) => {
    const accessTtlSec = (0, parseDuratin_1.default)(env_1.env.ACCESS_TOKEN_EXPIRES_IN);
    const refreshTtlSec = (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN);
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: accessTtlSec,
    });
    res.cookie("refresh_token", refreshTokenPlain, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/api/auth/refresh",
        maxAge: refreshTtlSec,
    });
    if (!isProd) {
        res.setHeader("X-Access-Token", accessToken);
        res.setHeader("X-Refresh-Token", refreshTokenPlain);
    }
};
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => {
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
    if (!isProd) {
        res.removeHeader("X-Access-Token");
        res.removeHeader("X-Refresh-Token");
    }
};
exports.clearAuthCookies = clearAuthCookies;
