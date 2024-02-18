import express from 'express';
import { addSubscription, addPendingSubscription, getSubscription, editSubscription, handleExpiredAndPendingSubscriptions, deleteSubscription } from '../services/subscription';
import isAuth from '../middleware/is_auth';
import { aboveAndIncSalesRole } from '../middleware/role_permission';

const router = express.Router();

router.get('/', isAuth, getSubscription)

router.post('/add', isAuth, aboveAndIncSalesRole, addSubscription)

router.post('/addPending', isAuth, aboveAndIncSalesRole, addPendingSubscription)

router.put('/edit', isAuth, aboveAndIncSalesRole, editSubscription)

router.delete('/delete', isAuth, aboveAndIncSalesRole, deleteSubscription)

router.put('/handleExpiredAndPendingSubscriptions', isAuth, aboveAndIncSalesRole, handleExpiredAndPendingSubscriptions)

export default router;  