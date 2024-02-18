import express from 'express';
import isAuth from '../middleware/is_auth';
import { getEmailResult, openEmail } from '../services/email_result';

const router = express.Router();

router.get('/', isAuth, getEmailResult)

router.get('/openEmail', openEmail)

export default router;  