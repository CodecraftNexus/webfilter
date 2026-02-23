"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class Language extends sequelize_2.Model {
}
exports.Language = Language;
Language.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_2.DataTypes.STRING(20),
        allowNull: true,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Language",
    tableName: "language",
    timestamps: false,
});
