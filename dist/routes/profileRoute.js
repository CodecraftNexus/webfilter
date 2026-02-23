"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const profileController_1 = require("../Controllers/profileController");
const router = (0, express_1.Router)();
router.get('/profile', auth_1.requireAuth, profileController_1.getProfile);
router.put('/profile', auth_1.requireAuth, profileController_1.UpdateProfile);
exports.default = router;
