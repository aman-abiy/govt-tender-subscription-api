import express from 'express';
import isAuth from '../middleware/is_auth';
import { logAdImpression, getAdImpressions } from '../services/ad_impressions';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/', isAuth, logAdImpression)

router.get('/', isAuth, aboveAndIncAdminRole, getAdImpressions)

export default router;