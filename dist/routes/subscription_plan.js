"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const subscription_plan_1 = require("../services/subscription_plan");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, subscription_plan_1.addSubscriptionPlan);
router.get('/', is_auth_1.default, subscription_plan_1.getSubscriptionPlan);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, subscription_plan_1.editSubscriptionPlan);
router.put('/toggleActiveStatus', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, subscription_plan_1.toggleActiveStatus);
// router.delete('/delete', isAuth, toggleDelete)
exports.default = router;
