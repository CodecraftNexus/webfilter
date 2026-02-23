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
exports.WebFilter = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class WebFilter extends sequelize_1.Model {
}
exports.WebFilter = WebFilter;
WebFilter.init({
    id: {
        type: sequelize_1.DataTypes.STRING(100),
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    datetime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    application: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    list_type: {
        type: sequelize_1.DataTypes.ENUM("white", "black"),
        allowNull: false,
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal("CURRENT_TIMESTAMP"),
    },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: "web_filters",
    modelName: "WebFilter",
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ["user_id"] },
        { fields: ["list_type"] },
        { fields: ["datetime"] },
    ],
});
WebFilter.beforeCreate((record, options) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = options.transaction;
    const last = yield WebFilter.findOne({
        order: [["id", "DESC"]],
        lock: transaction ? transaction.LOCK.UPDATE : false,
        transaction,
    });
    const lastNum = last ? parseInt(last.id.split("-")[1] || "0") : 0;
    record.id = `WF-${String(lastNum + 1).padStart(6, "0")}`;
}));
