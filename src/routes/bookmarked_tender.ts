import express from 'express';
import isAuth from '../middleware/is_auth';
import { getBookmarkedTender, toggleBookmarkedTender } from '../services/bookmarked_tender';

const router = express.Router();

router.get('/', isAuth, getBookmarkedTender)

router.post('/', isAuth, toggleBookmarkedTender)

export default router;  