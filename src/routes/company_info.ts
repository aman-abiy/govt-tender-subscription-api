import express from 'express';
import isAuth from '../middleware/is_auth';
import { addCompanyInfo, getCompanyInfo } from '../services/company_info';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.get('/', getCompanyInfo)

router.post('/add', isAuth, aboveAndIncAdminRole, addCompanyInfo)

export default router;