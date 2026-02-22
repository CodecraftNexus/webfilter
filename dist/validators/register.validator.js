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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z
        .string({ message: "Name is required" })
        .trim()
        .nonempty("Name is required")
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must not exceed 50 characters"),
    username: zod_1.z
        .string({ message: "Username is required" })
        .trim()
        .nonempty("Username is required")
        .min(3, { message: "Username must be at least 3 characters" })
        .max(20, { message: "Username must be 20 characters or less" })
        .regex(/^[a-zA-Z0-9_-]+$/, {
        message: "Only letters, numbers, underscore and hyphen are allowed",
    }),
    email: zod_1.z
        .string({ message: "Email is required" })
        .trim()
        .nonempty("Email is required")
        .email("Please provide a valid email address")
        .toLowerCase(),
    password: zod_1.z
        .string({ message: "Password is required" })
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain at least one letter and one number"),
});
const validateRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = exports.registerSchema.parse(req.body);
        req.body = result;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errors = {};
            error.issues.forEach((issue) => {
                const field = issue.path.join(".");
                if (!errors[field]) {
                    errors[field] = issue.message;
                }
            });
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        return res.status(400).json({
            success: false,
            error: "Validation failed",
        });
    }
});
exports.validateRegister = validateRegister;
