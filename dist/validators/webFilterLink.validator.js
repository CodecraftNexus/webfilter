"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWebFilterLinkSchema = exports.createWebFilterLinkSchema = void 0;
const zod_1 = require("zod");
exports.createWebFilterLinkSchema = zod_1.z.object({
    datetime: zod_1.z
        .string({ message: "Datetime is required" })
        .nonempty("Datetime is required")
        .refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid datetime format (ISO 8601 expected)",
    }),
    link: zod_1.z
        .string({ message: "Link is required" })
        .trim()
        .nonempty("Link is required")
        .max(2048, "Link must not exceed 2048 characters"),
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
exports.updateWebFilterLinkSchema = zod_1.z.object({
    datetime: zod_1.z
        .string()
        .refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid datetime format (ISO 8601 expected)",
    })
        .optional(),
    link: zod_1.z
        .string()
        .trim()
        .nonempty("Link cannot be empty")
        .max(2048)
        .optional(),
    list_type: zod_1.z
        .enum(["white", "black"], {
        message: "list_type must be 'white' or 'black'",
    })
        .optional(),
    reason: zod_1.z.string().trim().max(1000).optional().nullable(),
    type: zod_1.z.string().trim().nonempty("Type cannot be empty").max(100).optional(),
});
