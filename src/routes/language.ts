import express from 'express';
import isAuth from '../middleware/is_auth';
import { addLanguage, getLanguage, editLanguage, toggleActiveStatus, toggleDelete } from '../services/language';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addLanguage)

router.get('/', isAuth, getLanguage)

router.put('/edit', isAuth, aboveAndIncAdminRole, editLanguage)

router.put('/toggleActiveStatus', isAuth, aboveAndIncAdminRole, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  