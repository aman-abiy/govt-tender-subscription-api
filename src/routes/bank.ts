import express from 'express';
import isAuth from '../middleware/is_auth';
import { addBankAccount, getBankAccount, toggleDelete, toggleActiveStatus, editBankAccount } from '../services/bank';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addBankAccount)

router.get('/', isAuth, getBankAccount)

router.put('/edit', isAuth, aboveAndIncAdminRole, editBankAccount)

router.put('/toggleActiveStatus', aboveAndIncAdminRole, isAuth, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  