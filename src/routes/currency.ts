import express from 'express';
import isAuth from '../middleware/is_auth';
import { addCurrency, getCurrency, toggleDelete, toggleActiveStatus, editCurrency } from '../services/currency';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addCurrency)

router.get('/', isAuth, getCurrency)

router.put('/edit', isAuth, aboveAndIncAdminRole, editCurrency)

router.put('/toggleActiveStatus', aboveAndIncAdminRole, isAuth, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  