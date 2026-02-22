"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOrigins = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const ENV = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(5000),
    FORCE_SYNC: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    CORS_ORIGINS: zod_1.z.string().default("*"),
    BASE_URL: zod_1.z.string().optional(),
    DATABASE_URL: zod_1.z.string(),
    DB_SSL: zod_1.z.string(),
    TIMEZONE: zod_1.z.string().default("+05:30"),
    JWT_SECRET: zod_1.z.string().min(32),
    ACCESS_TOKEN_EXPIRES_IN: zod_1.z.string().default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default("7d"),
    BCRYPT_ROUNDS: zod_1.z.coerce.number().min(8).max(14).default(12),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
});
exports.env = ENV.parse(process.env);
exports.corsOrigins = exports.env.CORS_ORIGINS.split(",").map((s) => s.trim());
