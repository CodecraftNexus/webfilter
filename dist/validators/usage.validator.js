"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppUsageSchema = exports.createAppUsageSchema = exports.updateWebUsageSchema = exports.createWebUsageSchema = void 0;
const zod_1 = require("zod");
exports.createWebUsageSchema = zod_1.z.object({
    datetime: zod_1.z
        .string({ message: "Datetime is required" })
        .nonempty("Datetime is required")
        .refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid datetime format (ISO 8601 expected)",
    }),
    weblink: zod_1.z
        .string({ message: "Weblink is required" })
        .trim()
        .nonempty("Weblink is required")
        .max(2048, "Weblink must not exceed 2048 characters"),
    duration: zod_1.z
        .number()
        .int("Duration must be an integer")
        .min(0, "Duration must be 0 or more seconds")
        .optional()
        .nullable(),
});
exports.updateWebUsageSchema = zod_1.z.object({
    datetime: zod_1.z
        .string()
        .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid datetime format" })
        .optional(),
    weblink: zod_1.z.string().trim().nonempty("Weblink cannot be empty").max(2048).optional(),
    duration: zod_1.z.number().int().min(0).optional().nullable(),
});
exports.createAppUsageSchema = zod_1.z.object({
    datetime: zod_1.z
        .string({ message: "Datetime is required" })
        .nonempty("Datetime is required")
        .refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid datetime format (ISO 8601 expected)",
    }),
    application: zod_1.z
        .string({ message: "Application is required" })
        .trim()
        .nonempty("Application is required")
        .max(255, "Application must not exceed 255 characters"),
    duration: zod_1.z
        .number()
        .int("Duration must be an integer")
        .min(0, "Duration must be 0 or more seconds")
        .optional()
        .nullable(),
});
exports.updateAppUsageSchema = zod_1.z.object({
    datetime: zod_1.z
        .string()
        .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid datetime format" })
        .optional(),
    application: zod_1.z.string().trim().nonempty("Application cannot be empty").max(255).optional(),
    duration: zod_1.z.number().int().min(0).optional().nullable(),
});
