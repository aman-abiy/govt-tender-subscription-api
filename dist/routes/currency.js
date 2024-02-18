"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const currency_1 = require("../services/currency");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, currency_1.addCurrency);
router.get('/', is_auth_1.default, currency_1.getCurrency);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, currency_1.editCurrency);
router.put('/toggleActiveStatus', role_permission_1.aboveAndIncAdminRole, is_auth_1.default, currency_1.toggleActiveStatus);
router.delete('/delete', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, currency_1.toggleDelete);
exports.default = router;
