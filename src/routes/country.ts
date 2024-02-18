import express from 'express';
import isAuth from '../middleware/is_auth';
import { addCountry, getCountry, toggleDelete, toggleActiveStatus, editCountry } from '../services/country';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addCountry)

router.get('/', isAuth, getCountry)

router.put('/edit', isAuth, aboveAndIncAdminRole, editCountry)

router.put('/toggleActiveStatus', aboveAndIncAdminRole, isAuth, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  