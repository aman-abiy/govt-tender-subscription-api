import express from 'express';
import isAuth from '../middleware/is_auth';
import { addRegion, getRegion, editRegion, toggleActiveStatus, toggleDelete } from '../services/region';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addRegion)

router.get('/', isAuth, getRegion)

router.put('/edit', isAuth, aboveAndIncAdminRole, editRegion)

router.put('/toggleActiveStatus', isAuth, aboveAndIncAdminRole, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  