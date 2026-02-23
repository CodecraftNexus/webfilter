"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class Gender extends sequelize_2.Model {
}
exports.Gender = Gender;
Gender.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_2.DataTypes.STRING(20),
        allowNull: true,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Gender",
    tableName: "gender",
    timestamps: false,
});
