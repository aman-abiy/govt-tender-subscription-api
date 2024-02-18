"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const bookmarked_tender_1 = require("../services/bookmarked_tender");
const router = express_1.default.Router();
router.get('/', is_auth_1.default, bookmarked_tender_1.getBookmarkedTender);
router.post('/', is_auth_1.default, bookmarked_tender_1.toggleBookmarkedTender);
exports.default = router;
