"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const company_info_1 = require("../services/company_info");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.get('/', company_info_1.getCompanyInfo);
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, company_info_1.addCompanyInfo);
exports.default = router;
