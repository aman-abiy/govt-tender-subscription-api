import express from 'express';
import { check } from 'express-validator'
import isAuth from '../middleware/is_auth';
import { createAccount, editAccount, editOwnAccount, getAccount, getAuthAccount, toggleActiveStatus, toggleDelete } from '../services/account';
import { validatorFallback } from '../subscribers/validator'
import { aboveAndIncSalesRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncSalesRole, [
    check('fname').not().isEmpty().trim().escape(),
    check('lname').not().isEmpty().trim().escape(),
    check('email').isEmail().not().isEmpty().trim().escape().normalizeEmail(),
    check('mobile.countryCode').not().isEmpty().trim().escape(),
    check('mobile.phoneNumber').not().isEmpty().trim().escape(),
    check('mobile.isValid').not().isEmpty().trim().escape(),
    check('mobile.countryCallingCode').not().isEmpty().trim().escape(),
    check('mobile.nationalNumber').not().isEmpty().trim().escape(),
    check('mobile.formatInternational').not().isEmpty().trim().escape(),
    check('mobile.formatNational').not().isEmpty().trim().escape(),
    check('mobile.uri').not().isEmpty().trim().escape(),
    check('mobile.e164').not().isEmpty().trim().escape(),
    check('password').isLength({ min: 6 }).not().isEmpty().trim().escape()
], validatorFallback, createAccount)

router.get('/', isAuth, aboveAndIncSalesRole, getAccount)

router.get('/authAccount', isAuth, getAuthAccount)

router.put('/edit', isAuth, aboveAndIncSalesRole, [
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
    check('mobile.e164').not().isEmpty().trim().escape().optional({ nullable: true }),    check('password').isLength({ min: 6 }).trim().escape().optional({ nullable: true })
], validatorFallback, editAccount)

router.put('/edit-own', [
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
    check('mobile.e164').not().isEmpty().trim().escape().optional({ nullable: true }),    check('password').isLength({ min: 6 }).trim().escape().optional({ nullable: true })
], isAuth, editOwnAccount)

router.put('/toggleActiveStatus', isAuth, aboveAndIncSalesRole, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncSalesRole, toggleDelete)

export default router;  