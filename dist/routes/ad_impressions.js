"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const ad_impressions_1 = require("../services/ad_impressions");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/', is_auth_1.default, ad_impressions_1.logAdImpression);
router.get('/', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, ad_impressions_1.getAdImpressions);
exports.default = router;
