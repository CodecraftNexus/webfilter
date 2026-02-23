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
exports.deleteWebUsage = exports.updateWebUsage = exports.createWebUsage = exports.getWebUsageById = exports.getWebUsages = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const asyncHandler_1 = require("../utils/asyncHandler");
const usage_validator_1 = require("../validators/usage.validator");
exports.getWebUsages = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { weblink, from, to, page = "1", limit = "20" } = req.query;
    const where = { user_id: userId };
    if (weblink)
        where.weblink = { [sequelize_1.Op.like]: `%${weblink}%` };
    if (from || to) {
        where.datetime = {};
        if (from)
            where.datetime[sequelize_1.Op.gte] = new Date(from);
        if (to)
            where.datetime[sequelize_1.Op.lte] = new Date(to);
    }
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const { count, rows } = yield db_1.db.WebUsage.findAndCountAll({
        where,
        order: [["datetime", "DESC"]],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
    });
    return res.json({
        success: true,
        data: rows,
        pagination: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    });
}));
exports.getWebUsageById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const record = yield db_1.db.WebUsage.findOne({ where: { id: req.params.id, user_id: userId } });
    if (!record)
        return res.status(404).json({ success: false, message: "Web usage record not found" });
    return res.json({ success: true, data: record });
}));
exports.createWebUsage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const parsed = usage_validator_1.createWebUsageSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]));
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const { datetime, weblink, duration } = parsed.data;
    const record = yield db_1.db.WebUsage.create({
        user_id: userId,
        datetime: new Date(datetime),
        weblink,
        duration: duration !== null && duration !== void 0 ? duration : null,
    });
    return res.status(201).json({ success: true, message: "Web usage record created successfully", data: record });
}));
exports.updateWebUsage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const record = yield db_1.db.WebUsage.findOne({ where: { id: req.params.id, user_id: userId } });
    if (!record)
        return res.status(404).json({ success: false, message: "Web usage record not found" });
    const parsed = usage_validator_1.updateWebUsageSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]));
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }
    const updates = {};
    const { datetime, weblink, duration } = parsed.data;
    if (datetime !== undefined)
        updates.datetime = new Date(datetime);
    if (weblink !== undefined)
        updates.weblink = weblink;
    if (duration !== undefined)
        updates.duration = duration;
    if (Object.keys(updates).length === 0)
        return res.json({ success: true, message: "No changes detected", data: record });
    yield record.update(updates);
    return res.json({ success: true, message: "Web usage record updated successfully", data: record });
}));
exports.deleteWebUsage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const record = yield db_1.db.WebUsage.findOne({ where: { id: req.params.id, user_id: userId } });
    if (!record)
        return res.status(404).json({ success: false, message: "Web usage record not found" });
    yield record.destroy();
    return res.json({ success: true, message: "Web usage record deleted successfully" });
}));
