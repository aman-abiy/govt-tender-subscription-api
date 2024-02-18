import express from 'express';
import isAuth from '../middleware/is_auth';
import { addTenderSources, getTenderSource, editTenderSource, toggleActiveStatus, toggleDelete } from '../services/tender_sources';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addTenderSources)

router.get('/', isAuth, getTenderSource)

router.put('/edit', isAuth, aboveAndIncAdminRole, editTenderSource)

router.put('/toggleActiveStatus', isAuth, aboveAndIncAdminRole, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  