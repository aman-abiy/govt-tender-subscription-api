"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const alert_1 = require("../services/alert");
const router = express_1.default.Router();
router.put('/toggleAlertStatus', is_auth_1.default, alert_1.toggleAlertStatus);
router.put('/setCategories', is_auth_1.default, alert_1.setAlertCategories);
// CRON JOB
router.post('/sendAlertEmails', is_auth_1.default, alert_1.alertEmailHandler);
exports.default = router;
