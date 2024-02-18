import express from 'express';
import isAuth from '../middleware/is_auth';
import { getCurrentMonthSalesCount, getLast10DaysSalesCount, getLast10DaysUserCount, getUserCountByService, getUserCountBySubscriptionStatus } from '../services/stats';

const router = express.Router();

router.get('/userCountBySubscriptionStatus', isAuth, getUserCountBySubscriptionStatus)

router.get('/userCountByService', isAuth, getUserCountByService)

router.get('/last10DaysUserCount', isAuth, getLast10DaysUserCount)

router.get('/last10DaysSalesCount', isAuth, getLast10DaysSalesCount)

router.get('/currentMonthSales', isAuth, getCurrentMonthSalesCount)

export default router;  