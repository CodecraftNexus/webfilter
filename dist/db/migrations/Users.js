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
exports.runUserMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createGenderTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating Gender Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('gender')) {
        console.log('⚠️  Gender table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('gender', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true
        }
    });
    console.log('✅ Gender table created successfully!');
});
const createLanguageTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating Language Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('language')) {
        console.log('⚠️  Language table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('language', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
    });
    console.log('✅ Language table created successfully!');
});
const createUsersTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating users Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('users')) {
        console.log('⚠️  Users table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('users', {
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
            references: {
                model: 'gender',
                key: 'id'
            },
        },
        language_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'language',
                key: 'id'
            },
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
    });
    yield queryInterface.addIndex('users', ['email']);
    yield queryInterface.addIndex('users', ['username']);
    yield queryInterface.addIndex('users', ['gender_id']);
    yield queryInterface.addIndex('users', ['birth_location_id']);
    yield queryInterface.addIndex('users', ['language_id']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ Users table created successfully!');
});
const createProfieImageTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating profile_image Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('profile_image')) {
        console.log('⚠️  profile Image table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('profile_image', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        image_path: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
    });
    console.log('✅ profile image table created successfully!');
});
const createRefreshTokensTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating refresh_tokens Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('refresh_tokens')) {
        console.log('⚠️  Refresh tokens table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('refresh_tokens', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        token_hash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        expires_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        revoked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP')
        }
    });
    yield queryInterface.addIndex('refresh_tokens', ['user_id']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_refresh_tokens_updated_at ON refresh_tokens;
      CREATE TRIGGER update_refresh_tokens_updated_at
      BEFORE UPDATE ON refresh_tokens
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ Refresh tokens table created successfully!');
});
const createOAuthAccountsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating oauth_accounts table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('oauth_accounts')) {
        console.log('⚠️  OAuth accounts table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('oauth_accounts', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
        },
        provider: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false
        },
        provider_id: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
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
    });
    yield queryInterface.addIndex('oauth_accounts', ['provider', 'provider_id'], { unique: true });
    yield queryInterface.addIndex('oauth_accounts', ['user_id']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_oauth_accounts_updated_at ON oauth_accounts;
      CREATE TRIGGER update_oauth_accounts_updated_at
      BEFORE UPDATE ON oauth_accounts
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ OAuth accounts table created successfully!');
});
const seedDefaultData = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding User default data...');
    try {
        const [genderResults] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM gender');
        if (genderResults[0].count === '0') {
            yield queryInterface.bulkInsert('gender', [
                { type: 'Prefer not to say' },
                { type: 'Male' },
                { type: 'Female' },
                { type: 'Other' }
            ]);
            console.log('✅ Default genders seeded successfully');
        }
        else {
            console.log('⚠️  Gender data already exists, skipping seed...');
        }
        const [LanguageResults] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM language');
        if (LanguageResults[0].count === '0') {
            yield queryInterface.bulkInsert('language', [
                { name: 'si' },
                { name: 'en' },
                { name: 'ta' },
            ]);
            console.log('✅ Default language seeded successfully');
        }
        else {
            console.log('⚠️  Language data already exists, skipping seed...');
        }
        console.log('✅ All User default data seeded successfully!');
    }
    catch (error) {
        console.error('⚠️  Error seeding data:', error);
    }
});
const runUserMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createGenderTable(queryInterface);
        yield createLanguageTable(queryInterface);
        yield createUsersTable(queryInterface);
        yield createRefreshTokensTable(queryInterface);
        yield createOAuthAccountsTable(queryInterface);
        yield createProfieImageTable(queryInterface);
        yield seedDefaultData(queryInterface);
        console.log('🎉 User migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ User migration failed:', error);
        throw error;
    }
});
exports.runUserMigrations = runUserMigrations;
