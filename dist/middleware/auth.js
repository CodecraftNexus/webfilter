"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const asyncHandler_1 = require("../utils/asyncHandler");
const isDev = env_1.env.NODE_ENV !== "production";
exports.requireAuth = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const auth = isDev
        ? req.headers.authorization
        : ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token) ? `Bearer ${req.cookies.access_token}` : undefined;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({
            success: false,
            message: "Missing or invalid Authorization header"
        });
    }
    const token = auth.slice(7);
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
    let userId;
    let profileId;
    if (payload.ProfileId) {
        userId = payload.userId;
        profileId = payload.ProfileId;
    }
    else {
        userId = (_b = payload.userId) !== null && _b !== void 0 ? _b : payload.sub;
    }
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Invalid token payload"
        });
    }
    req.user = { userId };
    req.profile = { profileId };
    return next();
}));
