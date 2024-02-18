"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const account_1 = require("../services/account");
const validator_1 = require("../subscribers/validator");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, [
    (0, express_validator_1.check)('fname').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('lname').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('email').isEmail().not().isEmpty().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('mobile.countryCode').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.phoneNumber').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.isValid').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.countryCallingCode').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.nationalNumber').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.formatInternational').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.formatNational').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.uri').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.e164').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).not().isEmpty().trim().escape()
], validator_1.validatorFallback, account_1.createAccount);
router.get('/', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, account_1.getAccount);
router.get('/authAccount', is_auth_1.default, account_1.getAuthAccount);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, [
    (0, express_validator_1.check)('fname').trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('lname').trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('email').isEmail().trim().escape().normalizeEmail().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.countryCode').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.phoneNumber').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.isValid').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.countryCallingCode').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.nationalNumber').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.formatInternational').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.formatNational').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.uri').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.e164').not().isEmpty().trim().escape().optional({ nullable: true }), (0, express_validator_1.check)('password').isLength({ min: 6 }).trim().escape().optional({ nullable: true })
], validator_1.validatorFallback, account_1.editAccount);
router.put('/edit-own', [
    (0, express_validator_1.check)('fname').trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('lname').trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('email').isEmail().trim().escape().normalizeEmail().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.countryCode').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.phoneNumber').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.isValid').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.countryCallingCode').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.nationalNumber').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.formatInternational').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.formatNational').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.uri').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('mobile.e164').not().isEmpty().trim().escape().optional({ nullable: true }), (0, express_validator_1.check)('password').isLength({ min: 6 }).trim().escape().optional({ nullable: true })
], is_auth_1.default, account_1.editOwnAccount);
router.put('/toggleActiveStatus', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, account_1.toggleActiveStatus);
router.delete('/delete', is_auth_1.default, role_permission_1.aboveAndIncSalesRole, account_1.toggleDelete);
exports.default = router;
