"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../services/auth");
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const validator_1 = require("../subscribers/validator");
const router = express_1.default.Router();
router.post('/signup', [
    (0, express_validator_1.check)('fname').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('lname').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('email').not().isEmpty().isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('mobile.countryCode').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.phoneNumber').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.isValid').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.countryCallingCode').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.nationalNumber').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.formatInternational').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.formatNational').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.uri').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mobile.e164').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('password').not().isEmpty().isLength({ min: 6 }).trim().escape()
], validator_1.validatorFallback, auth_1.signup);
router.post('/login', [
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
    (0, express_validator_1.check)('mobile.e164').not().isEmpty().trim().escape().optional({ nullable: true }),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).trim().escape().optional({ nullable: true })
], validator_1.validatorFallback, auth_1.login);
router.post('/logout', is_auth_1.default, auth_1.logout);
router.post('/requestEmailVerification', auth_1.requestEmailVerification);
router.put('/verifyEmail', auth_1.verifyEmail);
router.post('/requestPasswordReset', auth_1.requestPasswordReset);
router.put('/resetPassword', [
    (0, express_validator_1.check)('newPassword').not().isEmpty().isLength({ min: 6 }).trim().escape(),
    (0, express_validator_1.check)('passwordResetToken').not().isEmpty().trim().escape()
], validator_1.validatorFallback, auth_1.resetPassword);
exports.default = router;
