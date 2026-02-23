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
exports.Users = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class Users extends sequelize_1.Model {
}
exports.Users = Users;
Users.init({
    id: {
        type: sequelize_1.DataTypes.STRING(100),
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(254),
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    gender_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    language_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    hash_password: {
        type: sequelize_1.DataTypes.STRING(250),
        allowNull: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    reference: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    nikname: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
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
    tableName: "users",
    modelName: "Users",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["gender_id"] }, { fields: ["language_id"] }],
});
Users.beforeCreate((user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = options.transaction;
    const lastUser = yield Users.findOne({
        order: [['id', 'DESC']],
        lock: transaction ? transaction.LOCK.UPDATE : false,
        transaction
    });
    const lastNum = lastUser ? parseInt(lastUser.id.split('-')[1]) : 0;
    user.id = `USR-${String(lastNum + 1).padStart(6, '0')}`;
}));
