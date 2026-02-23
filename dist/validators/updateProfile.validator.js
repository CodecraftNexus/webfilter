"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    gender: zod_1.z.enum(["Male", "Female", "Other", ""]).optional(),
    profileImage: zod_1.z.string().optional(),
    language: zod_1.z.string().optional(),
});
