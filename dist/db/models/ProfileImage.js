"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileImage = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class ProfileImage extends sequelize_1.Model {
}
exports.ProfileImage = ProfileImage;
ProfileImage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    image_path: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "ProfileImage",
    tableName: "profile_image",
    timestamps: false,
    underscored: true
});
