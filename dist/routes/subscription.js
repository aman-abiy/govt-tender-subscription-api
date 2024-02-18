"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_1 = require("../services/subscription");
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.get('/', is_auth_1.default, subscription_1.getSubscription);
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, subscription_1.addSubscription);
router.post('/addPending', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, subscription_1.addPendingSubscription);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, subscription_1.editSubscription);
router.delete('/delete', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, subscription_1.deleteSubscription);
router.put('/handleExpiredAndPendingSubscriptions', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, subscription_1.handleExpiredAndPendingSubscriptions);
exports.default = router;
