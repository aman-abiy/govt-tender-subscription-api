import express from 'express';
import { check } from 'express-validator'
import { signup, login, logout, requestEmailVerification, verifyEmail, requestPasswordReset, resetPassword } from '../services/auth';
import isAuth from '../middleware/is_auth';
import { validatorFallback } from '../subscribers/validator'

const router = express.Router();

router.post('/signup', [
    check('fname').not().isEmpty().trim().escape(),
    check('lname').not().isEmpty().trim().escape(),
    check('email').not().isEmpty().isEmail().trim().escape().normalizeEmail(),
    check('mobile.countryCode').not().isEmpty().trim().escape(),
    check('mobile.phoneNumber').not().isEmpty().trim().escape(),
    check('mobile.isValid').not().isEmpty().trim().escape(),
    check('mobile.countryCallingCode').not().isEmpty().trim().escape(),
    check('mobile.nationalNumber').not().isEmpty().trim().escape(),
    check('mobile.formatInternational').not().isEmpty().trim().escape(),
    check('mobile.formatNational').not().isEmpty().trim().escape(),
    check('mobile.uri').not().isEmpty().trim().escape(),
    check('mobile.e164').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().isLength({ min: 6 }).trim().escape()
], validatorFallback, signup)

router.post('/login', [
    check('fname').trim().escape().optional({ nullable: true }),
    check('lname').trim().escape().optional({ nullable: true }),
    check('email').isEmail().trim().escape().normalizeEmail().optional({ nullable: true }),
    check('mobile.countryCode').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.phoneNumber').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.isValid').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.countryCallingCode').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.nationalNumber').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.formatInternational').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.formatNational').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.uri').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('mobile.e164').not().isEmpty().trim().escape().optional({ nullable: true }),
    check('password').isLength({ min: 6 }).trim().escape().optional({ nullable: true })
], validatorFallback, login)

router.post('/logout', isAuth, logout)

router.post('/requestEmailVerification', requestEmailVerification)

router.put('/verifyEmail', verifyEmail)

router.post('/requestPasswordReset', requestPasswordReset)

router.put('/resetPassword', [
    check('newPassword').not().isEmpty().isLength({ min: 6 }).trim().escape(),
    check('passwordResetToken').not().isEmpty().trim().escape()
], validatorFallback, resetPassword)

export default router;  