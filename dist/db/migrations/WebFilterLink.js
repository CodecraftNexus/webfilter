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
exports.runWebFilterLinkMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createWebFilterLinksTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📝 Creating web_filter_links Table...");
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes("web_filter_links")) {
        console.log("⚠️  web_filter_links table already exists, skipping...");
        return;
    }
    yield queryInterface.createTable("web_filter_links", {
        id: {
            type: sequelize_1.DataTypes.STRING(100),
            primaryKey: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: { model: "users", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        datetime: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        link: {
            type: sequelize_1.DataTypes.STRING(2048),
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
    });
    yield queryInterface.addIndex("web_filter_links", ["user_id"]);
    yield queryInterface.addIndex("web_filter_links", ["list_type"]);
    yield queryInterface.addIndex("web_filter_links", ["datetime"]);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === "postgres") {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_web_filter_links_updated_at ON web_filter_links;
      CREATE TRIGGER update_web_filter_links_updated_at
      BEFORE UPDATE ON web_filter_links
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log("✅ web_filter_links table created successfully!");
});
const runWebFilterLinkMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createWebFilterLinksTable(queryInterface);
        console.log("🎉 WebFilterLink migrations completed successfully!");
    }
    catch (error) {
        console.error("❌ WebFilterLink migration failed:", error);
        throw error;
    }
});
exports.runWebFilterLinkMigrations = runWebFilterLinkMigrations;
