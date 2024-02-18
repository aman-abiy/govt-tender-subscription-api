"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const stats_1 = require("../services/stats");
const router = express_1.default.Router();
router.get('/userCountBySubscriptionStatus', is_auth_1.default, stats_1.getUserCountBySubscriptionStatus);
router.get('/userCountByService', is_auth_1.default, stats_1.getUserCountByService);
router.get('/last10DaysUserCount', is_auth_1.default, stats_1.getLast10DaysUserCount);
router.get('/last10DaysSalesCount', is_auth_1.default, stats_1.getLast10DaysSalesCount);
router.get('/currentMonthSales', is_auth_1.default, stats_1.getCurrentMonthSalesCount);
exports.default = router;
