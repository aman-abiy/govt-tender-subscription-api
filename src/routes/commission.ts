import express from 'express';
import isAuth from '../middleware/is_auth';
import { getCommissionsList } from '../services/commission';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.get('/', isAuth, aboveAndIncAdminRole, getCommissionsList)

export default router;  