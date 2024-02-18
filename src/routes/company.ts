import express from 'express';
import isAuth from '../middleware/is_auth';
import { addCompany, getCompany, toggleDelete, toggleActiveStatus, editCompany } from '../services/company';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addCompany)

router.get('/', isAuth, getCompany)

router.put('/edit', isAuth, aboveAndIncAdminRole, editCompany)

router.put('/toggleActiveStatus', aboveAndIncAdminRole, isAuth, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  