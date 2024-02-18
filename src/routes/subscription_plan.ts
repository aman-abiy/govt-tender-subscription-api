import express from 'express';
import isAuth from '../middleware/is_auth';
import { addSubscriptionPlan, getSubscriptionPlan, editSubscriptionPlan, toggleActiveStatus } from '../services/subscription_plan';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

router.post('/add', isAuth, aboveAndIncAdminRole, addSubscriptionPlan)

router.get('/', isAuth, getSubscriptionPlan)

router.put('/edit', isAuth, aboveAndIncAdminRole, editSubscriptionPlan)

router.put('/toggleActiveStatus', isAuth, aboveAndIncAdminRole, toggleActiveStatus)

// router.delete('/delete', isAuth, toggleDelete)

export default router;  