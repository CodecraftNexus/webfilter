"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserRelationship = initUserRelationship;
function initUserRelationship(models) {
    const { Users, Gender, Language, ProfileImage, RefreshToken, OAuthAccount, WebFilter } = models;
    if (!Users)
        return;
    if (Gender) {
        Gender.hasMany(Users, { foreignKey: "gender_id" });
        Users.belongsTo(Gender, { foreignKey: "gender_id" });
    }
    if (Language) {
        Language.hasMany(Users, { foreignKey: "language_id" });
        Users.belongsTo(Language, { foreignKey: "language_id" });
    }
    if (ProfileImage) {
        Users.hasOne(ProfileImage, {
            foreignKey: "user_id",
            as: "profileImage",
        });
        ProfileImage.belongsTo(Users, {
            foreignKey: "user_id",
            as: "user",
        });
    }
    if (RefreshToken) {
        Users.hasMany(RefreshToken, { foreignKey: "user_id" });
        RefreshToken.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (OAuthAccount) {
        Users.hasMany(OAuthAccount, { foreignKey: "user_id" });
        OAuthAccount.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (WebFilter) {
        Users.hasMany(WebFilter, { foreignKey: "user_id" });
        WebFilter.belongsTo(Users, { foreignKey: "user_id" });
    }
}
