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
exports.runUsageMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createWebUsageTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const tables = yield queryInterface.showAllTables();
    if (tables.includes("web_usage")) {
        console.log("⚠️  web_usage table already exists, skipping...");
        return;
    }
    yield queryInterface.createTable("web_usage", {
        id: { type: sequelize_1.DataTypes.STRING(100), primaryKey: true },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        datetime: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        weblink: { type: sequelize_1.DataTypes.STRING(2048), allowNull: false },
        duration: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "Duration in seconds" },
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
    });
    yield queryInterface.addIndex("web_usage", ["user_id"]);
    yield queryInterface.addIndex("web_usage", ["datetime"]);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === "postgres") {
        yield queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS update_web_usage_updated_at ON web_usage;
            CREATE TRIGGER update_web_usage_updated_at
            BEFORE UPDATE ON web_usage
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
        `);
    }
    console.log("✅ web_usage table created!");
});
const createAppUsageTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const tables = yield queryInterface.showAllTables();
    if (tables.includes("app_usage")) {
        console.log("⚠️  app_usage table already exists, skipping...");
        return;
    }
    yield queryInterface.createTable("app_usage", {
        id: { type: sequelize_1.DataTypes.STRING(100), primaryKey: true },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        datetime: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        application: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
        duration: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "Duration in seconds" },
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
    });
    yield queryInterface.addIndex("app_usage", ["user_id"]);
    yield queryInterface.addIndex("app_usage", ["datetime"]);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === "postgres") {
        yield queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS update_app_usage_updated_at ON app_usage;
            CREATE TRIGGER update_app_usage_updated_at
            BEFORE UPDATE ON app_usage
            FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
        `);
    }
    console.log("✅ app_usage table created!");
});
const runUsageMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createWebUsageTable(queryInterface);
        yield createAppUsageTable(queryInterface);
        console.log("🎉 Usage migrations completed successfully!");
    }
    catch (error) {
        console.error("❌ Usage migration failed:", error);
        throw error;
    }
});
exports.runUsageMigrations = runUsageMigrations;
