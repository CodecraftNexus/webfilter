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
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_1 = require("./docs/openapi");
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const webFilterRoute_1 = __importDefault(require("./routes/webFilterRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const sequelize_1 = require("./db/sequelize");
const asyncHandler_1 = require("./utils/asyncHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
if (env_1.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
        errors: ["Rate limit exceeded"],
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
try {
    app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openApiSpec, {
        swaggerOptions: {
            persistAuthorization: true,
            withCredentials: true,
            requestInterceptor: (req) => {
                req.credentials = "include";
                return req;
            },
        },
    }));
    console.log(`📋 Swagger UI Ready → ${env_1.env.BASE_URL}/api/docs`);
}
catch (err) {
    console.warn("swagger-ui-express not installed → npm i swagger-ui-express");
}
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
app.use("/api/auth", AuthRoute_1.default);
app.use("/api/webfilter", webFilterRoute_1.default);
app.use("/api", profileRoute_1.default);
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});
app.use((req, res, next) => {
    const error = new asyncHandler_1.AppError(`Route ${req.originalUrl} not found on this server`, 404);
    next(error);
});
app.use((err, req, res, next) => {
    var _a;
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    console.error("❌ Error caught:", {
        message: err.message,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        stack: env_1.env.NODE_ENV === "development" ? err.stack : undefined,
    });
    let error = Object.assign({}, err);
    error.message = err.message;
    if (err.name === "SequelizeValidationError") {
        const errors = err.errors.map((e) => ({
            field: e.path,
            message: e.message,
        }));
        error = new asyncHandler_1.AppError("Validation Error", 400, errors);
    }
    if (err.name === "SequelizeUniqueConstraintError") {
        const field = ((_a = err.errors[0]) === null || _a === void 0 ? void 0 : _a.path) || "field";
        error = new asyncHandler_1.AppError(`${field} already exists`, 400);
    }
    if (err.name === "SequelizeForeignKeyConstraintError") {
        error = new asyncHandler_1.AppError("Invalid reference to related data", 400);
    }
    if (err.name === "SequelizeDatabaseError") {
        error = new asyncHandler_1.AppError("Database operation failed", 500);
    }
    if (err.name === "JsonWebTokenError") {
        error = new asyncHandler_1.AppError("Invalid token. Please log in again", 401);
    }
    if (err.name === "TokenExpiredError") {
        error = new asyncHandler_1.AppError("Token expired. Please log in again", 401);
    }
    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            error = new asyncHandler_1.AppError("File size too large", 400);
        }
        else {
            error = new asyncHandler_1.AppError("File upload error", 400);
        }
    }
    if (err instanceof SyntaxError && "body" in err) {
        error = new asyncHandler_1.AppError("Invalid JSON format", 400);
    }
    if (env_1.env.NODE_ENV === "development") {
        res.status(error.statusCode || 500).json({
            success: false,
            error: {
                message: error.message,
                statusCode: error.statusCode || 500,
                errors: error.errors,
                stack: err.stack,
                path: req.path,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
        });
    }
    else {
        if (error.isOperational) {
            res.status(error.statusCode).json({
                success: false,
                error: {
                    message: error.message,
                    statusCode: error.statusCode,
                    errors: error.errors,
                },
            });
        }
        else {
            console.error("💥 Programming Error:", err);
            res.status(500).json({
                success: false,
                error: {
                    message: "Something went wrong. Please try again later.",
                    statusCode: 500,
                },
            });
        }
    }
});
function StartServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize_1.sequelize.authenticate();
            console.log("✅ Database connection established successfully.");
            if (env_1.env.NODE_ENV === "production") {
                console.log("⚠️ Production mode: Please run migrations manually using 'npm run migrate'");
            }
            else {
                console.log("🔄️ Development mode: Syncing database models...");
                if (env_1.env.FORCE_SYNC === true) {
                    console.log("💡 FORCE_SYNC is enabled: All tables will be dropped and recreated. Data loss may occur!");
                }
                else {
                    console.log("💡 Tip: Set FORCE_SYNC=true in .env to recreate tables if needed");
                }
                yield sequelize_1.sequelize.sync({
                    force: env_1.env.FORCE_SYNC === true,
                    alter: false,
                    logging: false,
                });
                console.log("✅ Database models synchronized.");
            }
            const server = app.listen(env_1.env.PORT, () => {
                console.log(`👍 Server running on port ${env_1.env.PORT}`);
                console.log(`🌐 Server URL ${env_1.env.BASE_URL}`);
                console.log("Server Working healthy ✅");
            });
            return server;
        }
        catch (error) {
            console.error("❌ Unable to start server:", error);
            process.exit(1);
        }
    });
}
process.on("unhandledRejection", (reason, promise) => {
    console.error("💥 Unhandled Rejection at:", promise);
    console.error("💥 Reason:", reason);
    console.log("🛑 Shutting down due to unhandled rejection...");
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    console.log("🛑 Shutting down due to uncaught exception...");
    process.exit(1);
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🛑 Shutting down server (SIGINT)...");
    try {
        yield sequelize_1.sequelize.close();
        console.log("✅ Database connection closed.");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
}));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🛑 Received SIGTERM, shutting down gracefully...");
    try {
        yield sequelize_1.sequelize.close();
        console.log("✅ Database connection closed.");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
}));
StartServer().catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
});
exports.default = app;
