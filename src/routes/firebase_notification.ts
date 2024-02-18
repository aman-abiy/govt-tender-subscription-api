import express from 'express';
import isAuth from '../middleware/is_auth';
import { sendDailyNotificationToUsers } from '../services/firebase_notification';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/sendDailyNotification', isAuth, aboveAndIncAdminRole, sendDailyNotificationToUsers)

export default router;  