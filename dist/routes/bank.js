"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const bank_1 = require("../services/bank");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, bank_1.addBankAccount);
router.get('/', is_auth_1.default, bank_1.getBankAccount);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, bank_1.editBankAccount);
router.put('/toggleActiveStatus', role_permission_1.aboveAndIncAdminRole, is_auth_1.default, bank_1.toggleActiveStatus);
router.delete('/delete', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, bank_1.toggleDelete);
exports.default = router;
