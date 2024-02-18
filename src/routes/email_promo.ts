import express from 'express';
import isAuth from '../middleware/is_auth';
import { sendEmail } from '../services/email_promo';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.get('/send', sendEmail)

export default router;  