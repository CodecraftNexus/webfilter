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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfile = exports.getProfile = void 0;
const db_1 = require("../db");
const asyncHandler_1 = require("../utils/asyncHandler");
const updateProfile_validator_1 = require("../validators/updateProfile.validator");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
exports.getProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const UserId = req.user.userId;
    let profiles = [];
    let mainUser = null;
    const Users = db_1.db.Users;
    if (req.profile && req.profile.profileId) {
        profiles = yield Users.findAll({
            where: { reference: req.profile.profileId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        const result = yield Users.findOne({
            where: { id: req.profile.profileId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        if (!result) {
            return res.status(404).json({ success: false, message: "Main user not found" });
        }
        mainUser = {
            id: (result === null || result === void 0 ? void 0 : result.id) || null,
            name: (result === null || result === void 0 ? void 0 : result.name) || null,
            nikname: (result === null || result === void 0 ? void 0 : result.nikname) || null,
            profileImg: ((_b = (_a = result === null || result === void 0 ? void 0 : result.ProfileImages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.imagePath) || null,
        };
    }
    else {
        profiles = yield Users.findAll({
            where: { reference: UserId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        const result = yield Users.findOne({
            where: { id: UserId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        if (!result) {
            return res.status(404).json({ success: false, message: "Main user not found" });
        }
        mainUser = {
            id: (result === null || result === void 0 ? void 0 : result.id) || null,
            name: (result === null || result === void 0 ? void 0 : result.name) || null,
        };
    }
    const user = yield Users.findByPk(UserId, {
        include: [
            {
                model: db_1.db.Gender,
                attributes: ['id', 'type'],
            },
            {
                model: db_1.db.ProfileImage,
                as: "profileImage",
                attributes: ['image_path']
            },
            {
                model: db_1.db.Language,
                attributes: ['id', 'name'],
            }
        ]
    });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const userWithRelations = user;
    const payload = {
        id: userWithRelations.id || null,
        name: userWithRelations.name || null,
        email: userWithRelations.email || null,
        username: userWithRelations.username || null,
        language: ((_c = userWithRelations.Language) === null || _c === void 0 ? void 0 : _c.name) || null,
    };
    return res.json(payload);
}));
exports.UpdateProfile = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const parsed = updateProfile_validator_1.updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message]));
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }
    const { gender: genderType, profileImage, language, } = parsed.data;
    const t = yield db_1.db.sequelize.transaction();
    try {
        const updates = {};
        if (genderType !== undefined && genderType !== "") {
            if (["Male", "Female", "Other"].includes(genderType)) {
                const [gender] = yield db_1.db.Gender.findOrCreate({
                    where: { type: genderType },
                    defaults: { type: genderType },
                    transaction: t
                });
                updates.gender_id = gender.id;
            }
        }
        if (language !== undefined && language !== "") {
            let formattedLanguage;
            if (language == "si") {
                formattedLanguage = "1";
            }
            else if (language == "en") {
                formattedLanguage = "2";
            }
            else {
                formattedLanguage = "3";
            }
            updates.language_id = formattedLanguage;
        }
        if (profileImage && profileImage.startsWith('data:image/')) {
            try {
                const uploadResult = yield cloudinary_1.default.uploader.upload(profileImage);
                const imageUrl = uploadResult.secure_url;
                yield db_1.db.ProfileImage.destroy({ where: { user_id: userId }, transaction: t });
                yield db_1.db.ProfileImage.create({
                    user_id: userId,
                    image_path: imageUrl,
                }, { transaction: t });
            }
            catch (error) {
                console.log(error);
                yield t.rollback();
                return res.status(500).json({
                    success: false,
                    message: "Profile image upload failed",
                });
            }
        }
        if (Object.keys(updates).length === 0 && !profileImage) {
            yield t.rollback();
            return res.json({
                success: true,
                message: "No changes detected",
            });
        }
        const user = yield db_1.db.Users.findByPk(userId, {
            include: [
                { model: db_1.db.Gender }
            ],
            transaction: t
        });
        if (!user) {
            yield t.rollback();
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        yield user.update(updates, { transaction: t });
        yield t.commit();
        return (0, exports.getProfile)(req, res, next);
    }
    catch (error) {
        yield t.rollback();
        throw error;
    }
}));
