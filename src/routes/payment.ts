import express from 'express';
import isAuth from '../middleware/is_auth';
import { getPayment } from '../services/payment';

const router = express.Router();

router.get('/', isAuth, getPayment)

export default router;  