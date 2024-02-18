import express from 'express';
import isAuth from '../middleware/is_auth';
import { importAllCategories, getCategory } from '../services/category';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/import', isAuth, aboveAndIncAdminRole, importAllCategories)

router.get('/', isAuth, getCategory)

export default router;  