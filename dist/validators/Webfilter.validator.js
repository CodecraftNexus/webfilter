"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWebFilterSchema = exports.createWebFilterSchema = void 0;
const zod_1 = require("zod");
exports.createWebFilterSchema = zod_1.z.object({
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
        .max(255, "Application name must not exceed 255 characters"),
    list_type: zod_1.z.enum(["white", "black"], {
        message: "list_type must be 'white' or 'black'",
    }),
    reason: zod_1.z.string().trim().max(1000).optional().nullable(),
    type: zod_1.z
        .string({ message: "Type is required" })
        .trim()
        .nonempty("Type is required")
        .max(100, "Type must not exceed 100 characters"),
});
exports.updateWebFilterSchema = zod_1.z.object({
    datetime: zod_1.z
        .string()
        .refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid datetime format (ISO 8601 expected)",
    })
        .optional(),
    application: zod_1.z
        .string()
        .trim()
        .nonempty("Application cannot be empty")
        .max(255)
        .optional(),
    list_type: zod_1.z
        .enum(["white", "black"], {
        message: "list_type must be 'white' or 'black'",
    })
        .optional(),
    reason: zod_1.z.string().trim().max(1000).optional().nullable(),
    type: zod_1.z.string().trim().nonempty("Type cannot be empty").max(100).optional(),
});
