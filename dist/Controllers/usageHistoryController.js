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
exports.getUsageHistory = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const asyncHandler_1 = require("../utils/asyncHandler");
const getDateRange = (period) => {
    const now = new Date();
    const to = new Date(now);
    let from = new Date(now);
    switch (period) {
        case "daily":
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            break;
        case "weekly":
            const day = now.getDay();
            from.setDate(now.getDate() - day);
            from.setHours(0, 0, 0, 0);
            to.setDate(from.getDate() + 6);
            to.setHours(23, 59, 59, 999);
            break;
        case "monthly":
            from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            to.setMonth(to.getMonth() + 1, 0);
            to.setHours(23, 59, 59, 999);
            break;
        case "yearly":
            from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            to.setMonth(11, 31);
            to.setHours(23, 59, 59, 999);
            break;
    }
    return { from, to };
};
const formatDuration = (seconds) => {
    if (!seconds)
        return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts = [];
    if (h > 0)
        parts.push(`${h}h`);
    if (m > 0)
        parts.push(`${m}m`);
    if (s > 0 || parts.length === 0)
        parts.push(`${s}s`);
    return parts.join(" ");
};
exports.getUsageHistory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.user.userId;
    const { period = "daily", from, to } = req.query;
    const validPeriods = ["daily", "weekly", "monthly", "yearly"];
    if (!validPeriods.includes(period)) {
        return res.status(400).json({
            success: false,
            message: "Invalid period. Must be: daily, weekly, monthly, or yearly",
        });
    }
    let dateFrom;
    let dateTo;
    if (from || to) {
        dateFrom = from ? new Date(from) : new Date(0);
        dateTo = to ? new Date(to) : new Date();
    }
    else {
        const range = getDateRange(period);
        dateFrom = range.from;
        dateTo = range.to;
    }
    const dateWhere = { [sequelize_1.Op.between]: [dateFrom, dateTo] };
    const webUsageRows = yield db_1.db.WebUsage.findAll({
        where: { user_id: userId, datetime: dateWhere },
        order: [["datetime", "DESC"]],
    });
    const appUsageRows = yield db_1.db.AppUsage.findAll({
        where: { user_id: userId, datetime: dateWhere },
        order: [["datetime", "DESC"]],
    });
    const webGrouped = {};
    for (const row of webUsageRows) {
        const r = row.toJSON();
        const key = r.weblink;
        if (!webGrouped[key]) {
            webGrouped[key] = { weblink: key, total_duration: 0, visit_count: 0, records: [] };
        }
        webGrouped[key].visit_count++;
        webGrouped[key].total_duration += (_a = r.duration) !== null && _a !== void 0 ? _a : 0;
        webGrouped[key].records.push(r);
    }
    const appGrouped = {};
    for (const row of appUsageRows) {
        const r = row.toJSON();
        const key = r.application;
        if (!appGrouped[key]) {
            appGrouped[key] = { application: key, total_duration: 0, open_count: 0, records: [] };
        }
        appGrouped[key].open_count++;
        appGrouped[key].total_duration += (_b = r.duration) !== null && _b !== void 0 ? _b : 0;
        appGrouped[key].records.push(r);
    }
    const webSummary = Object.values(webGrouped)
        .sort((a, b) => b.total_duration - a.total_duration)
        .map((g) => (Object.assign(Object.assign({}, g), { total_duration_formatted: formatDuration(g.total_duration) })));
    const appSummary = Object.values(appGrouped)
        .sort((a, b) => b.total_duration - a.total_duration)
        .map((g) => (Object.assign(Object.assign({}, g), { total_duration_formatted: formatDuration(g.total_duration) })));
    const totalWebDuration = webUsageRows.reduce((sum, r) => { var _a; return sum + ((_a = r.duration) !== null && _a !== void 0 ? _a : 0); }, 0);
    const totalAppDuration = appUsageRows.reduce((sum, r) => { var _a; return sum + ((_a = r.duration) !== null && _a !== void 0 ? _a : 0); }, 0);
    return res.json({
        success: true,
        period,
        date_range: {
            from: dateFrom.toISOString(),
            to: dateTo.toISOString(),
        },
        summary: {
            total_web_duration: totalWebDuration,
            total_web_duration_formatted: formatDuration(totalWebDuration),
            total_web_visits: webUsageRows.length,
            total_app_duration: totalAppDuration,
            total_app_duration_formatted: formatDuration(totalAppDuration),
            total_app_opens: appUsageRows.length,
        },
        data: {
            web: webSummary,
            applications: appSummary,
        },
    });
}));
