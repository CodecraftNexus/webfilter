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
exports.deleteWebFilterLink = exports.updateWebFilterLink = exports.createWebFilterLink = exports.getWebFilterLinkById = exports.getWebFilterLinks = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const asyncHandler_1 = require("../utils/asyncHandler");
const webFilterLink_validator_1 = require("../validators/webFilterLink.validator");
exports.getWebFilterLinks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { list_type, type, link, from, to, page = "1", limit = "20", } = req.query;
    const where = { user_id: userId };
    if (list_type && ["white", "black"].includes(list_type)) {
        where.list_type = list_type;
    }
    if (type) {
        where.type = { [sequelize_1.Op.like]: `%${type}%` };
    }
    if (link) {
        where.link = { [sequelize_1.Op.like]: `%${link}%` };
    }
    if (from || to) {
        where.datetime = {};
        if (from)
            where.datetime[sequelize_1.Op.gte] = new Date(from);
        if (to)
            where.datetime[sequelize_1.Op.lte] = new Date(to);
    }
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;
    const { count, rows } = yield db_1.db.WebFilterLink.findAndCountAll({
        where,
        order: [["datetime", "DESC"]],
        limit: limitNum,
        offset,
    });
    return res.json({
        success: true,
        data: rows,
        pagination: {
            total: count,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(count / limitNum),
        },
    });
}));
exports.getWebFilterLinkById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { id } = req.params;
    const record = yield db_1.db.WebFilterLink.findOne({
        where: { id, user_id: userId },
    });
    if (!record) {
        return res.status(404).json({
            success: false,
            message: "Web filter link record not found",
        });
    }
    return res.json({ success: true, data: record });
}));
exports.createWebFilterLink = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const parsed = webFilterLink_validator_1.createWebFilterLinkSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]));
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }
    const { datetime, link, list_type, reason, type } = parsed.data;
    const record = yield db_1.db.WebFilterLink.create({
        user_id: userId,
        datetime: new Date(datetime),
        link,
        list_type,
        reason: reason !== null && reason !== void 0 ? reason : null,
        type,
    });
    return res.status(201).json({
        success: true,
        message: "Web filter link record created successfully",
        data: record,
    });
}));
exports.updateWebFilterLink = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { id } = req.params;
    const record = yield db_1.db.WebFilterLink.findOne({
        where: { id, user_id: userId },
    });
    if (!record) {
        return res.status(404).json({
            success: false,
            message: "Web filter link record not found",
        });
    }
    const parsed = webFilterLink_validator_1.updateWebFilterLinkSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]));
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }
    const updates = {};
    const { datetime, link, list_type, reason, type } = parsed.data;
    if (datetime !== undefined)
        updates.datetime = new Date(datetime);
    if (link !== undefined)
        updates.link = link;
    if (list_type !== undefined)
        updates.list_type = list_type;
    if (reason !== undefined)
        updates.reason = reason;
    if (type !== undefined)
        updates.type = type;
    if (Object.keys(updates).length === 0) {
        return res.json({ success: true, message: "No changes detected", data: record });
    }
    yield record.update(updates);
    return res.json({
        success: true,
        message: "Web filter link record updated successfully",
        data: record,
    });
}));
exports.deleteWebFilterLink = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { id } = req.params;
    const record = yield db_1.db.WebFilterLink.findOne({
        where: { id, user_id: userId },
    });
    if (!record) {
        return res.status(404).json({
            success: false,
            message: "Web filter link record not found",
        });
    }
    yield record.destroy();
    return res.json({
        success: true,
        message: "Web filter link record deleted successfully",
    });
}));
