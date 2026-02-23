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
exports.runMigrations = void 0;
const sequelize_1 = require("../sequelize");
const Users_1 = require("./Users");
const WebFilter_1 = require("./WebFilter");
const WebFilterLink_1 = require("./WebFilterLink");
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        const queryInterface = sequelize_1.sequelize.getQueryInterface();
        const dialect = sequelize_1.sequelize.getDialect();
        if (dialect === 'postgres') {
            yield queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
        }
        yield (0, Users_1.runUserMigrations)();
        yield (0, WebFilter_1.runWebFilterMigrations)();
        yield (0, WebFilterLink_1.runWebFilterLinkMigrations)();
        console.log('🎉 All migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
});
exports.runMigrations = runMigrations;
