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
exports.logout = exports.refreshToken = exports.Login = exports.Register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const env_1 = require("../config/env");
const parseDuratin_1 = __importDefault(require("../utils/parseDuratin"));
const cookie_helper_1 = require("../utils/cookie.helper");
const asyncHandler_1 = require("../utils/asyncHandler");
const isDev = env_1.env.NODE_ENV !== "production";
exports.Register = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, username } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username === null || username === void 0 ? void 0 : username.toLowerCase().trim();
    const existing = yield db_1.db.Users.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { email: normalizedEmail }, { username: normalizedUsername },
            ],
        },
    });
    if (existing) {
        return res.status(409).json({ success: false, message: "User already exists with this email or username" });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, env_1.env.BCRYPT_ROUNDS);
    const newUser = yield db_1.db.Users.create({
        name: fullName.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        hash_password: hashedPassword,
        gender_id: "1",
        language_id: "1"
    });
    const [gender] = yield Promise.all([
        db_1.db.Gender.findByPk(newUser.gender_id),
    ]);
    return res.status(201).json({
        success: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            gender: gender === null || gender === void 0 ? void 0 : gender.type,
        },
    });
}));
exports.Login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const user = yield db_1.db.Users.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user || !user.hash_password || !(yield bcryptjs_1.default.compare(password, user.hash_password))) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshPlain = crypto_1.default.randomBytes(64).toString("hex");
    const refreshHash = crypto_1.default.createHash("sha256").update(refreshPlain).digest("hex");
    const expiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
    yield db_1.db.RefreshToken.create({
        user_id: user.id,
        token_hash: refreshHash,
        expires_at: expiresAt,
        revoked: false,
    });
    if (!isDev) {
        (0, cookie_helper_1.setAuthCookies)(res, accessToken, refreshPlain);
    }
    ;
    const payload = {
        success: true,
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
    if (isDev) {
        payload.access_token = accessToken;
        payload.refresh_token = refreshPlain;
    }
    return res.json(payload);
}));
exports.refreshToken = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const incomingRefreshToken = isDev ? req.body.refreshToken : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
    if (!incomingRefreshToken) {
        return res.status(401).json({ success: false, message: "No refresh token provided" });
    }
    const tokenHash = crypto_1.default.createHash("sha256").update(incomingRefreshToken).digest("hex");
    const existing = yield db_1.db.RefreshToken.findOne({
        where: {
            token_hash: tokenHash,
            revoked: false,
            expires_at: { [sequelize_1.Op.gt]: new Date() },
        },
    });
    if (!existing) {
        return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }
    yield db_1.db.RefreshToken.destroy({ where: { id: existing.id } });
    const newPlain = crypto_1.default.randomBytes(64).toString("hex");
    const newHash = crypto_1.default.createHash("sha256").update(newPlain).digest("hex");
    const newExpiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
    yield db_1.db.RefreshToken.create({
        user_id: existing.user_id,
        token_hash: newHash,
        expires_at: newExpiresAt,
        revoked: false,
    });
    const newAccessToken = jsonwebtoken_1.default.sign({ userId: existing.user_id }, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    if (!isDev) {
        (0, cookie_helper_1.setAuthCookies)(res, newAccessToken, newPlain);
    }
    const payload = {
        success: true,
        message: "Token refreshed successfully",
    };
    if (isDev) {
        payload.access_token = newAccessToken;
        payload.refresh_token = newPlain;
    }
    return res.json(payload);
}));
exports.logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = isDev ? req.body.refreshToken : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
    if (!token) {
        if (!isDev) {
            (0, cookie_helper_1.clearAuthCookies)(res);
        }
        return res.json({ success: true, message: "Already logged out" });
    }
    const hash = crypto_1.default.createHash("sha256").update(token).digest("hex");
    yield db_1.db.RefreshToken.destroy({ where: { token_hash: hash } });
    if (!isDev) {
        (0, cookie_helper_1.clearAuthCookies)(res);
    }
    return res.json({ success: true, message: "Logged out successfully" });
}));
