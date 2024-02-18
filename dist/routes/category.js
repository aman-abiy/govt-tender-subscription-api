"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const category_1 = require("../services/category");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/import', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, category_1.importAllCategories);
router.get('/', is_auth_1.default, category_1.getCategory);
exports.default = router;
