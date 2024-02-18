import express from 'express';
import isAuth from '../middleware/is_auth';
import { backupAccounts, backupCountries, backupLanguages, backupRegions, backupSubscriptions, backupTenderSources, backupTenders, backupPayments, backupPaymentMethods } from '../services/backup';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/account', isAuth, aboveAndIncAdminRole, backupAccounts)

router.post('/country', isAuth, aboveAndIncAdminRole, backupCountries)

router.post('/language', isAuth, aboveAndIncAdminRole, backupLanguages)

router.post('/region', isAuth, aboveAndIncAdminRole, backupRegions)

router.post('/subscription', isAuth, aboveAndIncAdminRole, backupSubscriptions)

router.post('/subscriptionPlan', isAuth, aboveAndIncAdminRole, backupSubscriptions)

router.post('/payment', isAuth, aboveAndIncAdminRole, backupPayments)

router.post('/paymentMethod', isAuth, aboveAndIncAdminRole, backupPaymentMethods)

router.post('/tenderSource', isAuth, aboveAndIncAdminRole, backupTenderSources)

router.post('/tender', isAuth, aboveAndIncAdminRole, backupTenders)

export default router;  