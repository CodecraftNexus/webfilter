"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebFilter = exports.OAuthAccount = exports.RefreshToken = exports.ProfileImage = exports.Language = exports.Gender = exports.Users = void 0;
const Gender_1 = require("./Gender");
Object.defineProperty(exports, "Gender", { enumerable: true, get: function () { return Gender_1.Gender; } });
const hooks_1 = require("../hooks");
const relationships_1 = require("../relationships");
const Language_1 = require("./Language");
Object.defineProperty(exports, "Language", { enumerable: true, get: function () { return Language_1.Language; } });
const OAuthAccount_1 = require("./OAuthAccount");
Object.defineProperty(exports, "OAuthAccount", { enumerable: true, get: function () { return OAuthAccount_1.OAuthAccount; } });
const ProfileImage_1 = require("./ProfileImage");
Object.defineProperty(exports, "ProfileImage", { enumerable: true, get: function () { return ProfileImage_1.ProfileImage; } });
const RefreshToken_1 = require("./RefreshToken");
Object.defineProperty(exports, "RefreshToken", { enumerable: true, get: function () { return RefreshToken_1.RefreshToken; } });
const Users_1 = require("./Users");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return Users_1.Users; } });
const webfilter_1 = require("./webfilter");
Object.defineProperty(exports, "WebFilter", { enumerable: true, get: function () { return webfilter_1.WebFilter; } });
const models = {
    Users: Users_1.Users,
    Gender: Gender_1.Gender,
    Language: Language_1.Language,
    ProfileImage: ProfileImage_1.ProfileImage,
    RefreshToken: RefreshToken_1.RefreshToken,
    OAuthAccount: OAuthAccount_1.OAuthAccount,
    WebFilter: webfilter_1.WebFilter
};
(0, hooks_1.initHooks)(models);
(0, relationships_1.initRelationship)(models);
