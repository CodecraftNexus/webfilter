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
const migrations_1 = require("../migrations");
const sequelize_1 = require("../sequelize");
const migrate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🚀 Starting database migration...');
        yield (0, migrations_1.runMigrations)();
        console.log('✅ Migration completed successfully!');
        yield sequelize_1.sequelize.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        yield sequelize_1.sequelize.close();
        process.exit(1);
    }
});
migrate();
