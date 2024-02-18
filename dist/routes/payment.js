"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const payment_1 = require("../services/payment");
const router = express_1.default.Router();
router.get('/', is_auth_1.default, payment_1.getPayment);
exports.default = router;
