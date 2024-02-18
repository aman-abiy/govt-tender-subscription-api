import express from 'express';
import isAuth from '../middleware/is_auth';
import { addPaymentMethod, getPaymentMethod, toggleDelete, toggleActiveStatus, editPaymentMethod } from '../services/payment_method';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addPaymentMethod)

router.get('/', isAuth, getPaymentMethod)

router.put('/edit', isAuth, aboveAndIncAdminRole, editPaymentMethod)

router.put('/toggleActiveStatus', isAuth, aboveAndIncAdminRole, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  