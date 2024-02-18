"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const payment_method_1 = require("../services/payment_method");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, payment_method_1.addPaymentMethod);
router.get('/', is_auth_1.default, payment_method_1.getPaymentMethod);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, payment_method_1.editPaymentMethod);
router.put('/toggleActiveStatus', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, payment_method_1.toggleActiveStatus);
router.delete('/delete', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, payment_method_1.toggleDelete);
exports.default = router;
