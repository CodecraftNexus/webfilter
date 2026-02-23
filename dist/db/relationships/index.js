"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRelationship = initRelationship;
const User_1 = require("./User");
function initRelationship(models) {
    (0, User_1.initUserRelationship)(models);
}
