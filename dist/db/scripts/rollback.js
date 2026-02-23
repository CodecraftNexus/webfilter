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
const sequelize_1 = require("../sequelize");
const rollback = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 Starting database rollback...');
        const queryInterface = sequelize_1.sequelize.getQueryInterface();
        const tables = [
            'refresh_tokens',
            'oauth_accounts',
            'users',
            'gender',
            'birth_location',
            'language',
        ];
        for (const table of tables) {
            try {
                console.log(`🗑️  Dropping ${table} table...`);
                yield queryInterface.dropTable(table);
                console.log(`✅ ${table} dropped successfully`);
            }
            catch (error) {
                if (error.message.includes("doesn't exist")) {
                    console.log(`⚠️  Table ${table} doesn't exist, skipping...`);
                }
                else {
                    throw error;
                }
            }
        }
        console.log('✅ Rollback completed successfully!');
        yield sequelize_1.sequelize.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Rollback failed:', error);
        yield sequelize_1.sequelize.close();
        process.exit(1);
    }
});
rollback();
