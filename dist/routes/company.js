"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const company_1 = require("../services/company");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, company_1.addCompany);
router.get('/', is_auth_1.default, company_1.getCompany);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, company_1.editCompany);
router.put('/toggleActiveStatus', role_permission_1.aboveAndIncAdminRole, is_auth_1.default, company_1.toggleActiveStatus);
router.delete('/delete', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, company_1.toggleDelete);
exports.default = router;
