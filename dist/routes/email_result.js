"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const email_result_1 = require("../services/email_result");
const router = express_1.default.Router();
router.get('/', is_auth_1.default, email_result_1.getEmailResult);
router.get('/openEmail', email_result_1.openEmail);
exports.default = router;
