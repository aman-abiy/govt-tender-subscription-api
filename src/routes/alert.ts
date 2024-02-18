import express from 'express';
import isAuth from '../middleware/is_auth';
import { alertEmailHandler, setAlertCategories, toggleAlertStatus } from '../services/alert';

const router = express.Router();

router.put('/toggleAlertStatus', isAuth, toggleAlertStatus)

router.put('/setCategories', isAuth, setAlertCategories)

// CRON JOB
router.post('/sendAlertEmails', isAuth, alertEmailHandler)

export default router;  