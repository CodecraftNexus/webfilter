"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class RefreshToken extends sequelize_1.Model {
}
exports.RefreshToken = RefreshToken;
RefreshToken.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    token_hash: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    expires_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    revoked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    timestamps: true,
    paranoid: false,
    underscored: true,
    indexes: [{ fields: ["user_id"] }, { fields: ["token_hash"] }],
});
