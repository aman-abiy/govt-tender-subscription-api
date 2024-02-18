"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const firebase_notification_1 = require("../services/firebase_notification");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/sendDailyNotification', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, firebase_notification_1.sendDailyNotificationToUsers);
exports.default = router;
