import express from 'express';
import { scrappeTenders, getTender, toggleActiveStatus, toggleDelete, toggleIsFeatured, viewTender, toggleIsPublished } from '../services/tender';
import { getBookmarkedTender, toggleBookmarkedTender, checkBookmarked } from '../services/bookmarked_tender';
import isAuth from '../middleware/is_auth';
import { allStaffRoles } from '../middleware/role_permission';

const router = express.Router();

router.get('/scrappe', scrappeTenders)

router.get('/', isAuth, getTender)

router.get('/bookmark', isAuth, getBookmarkedTender)

router.post('/bookmark', isAuth, toggleBookmarkedTender)

router.get('/checkBookmark', isAuth, checkBookmarked)

router.put('/toggleActiveStatus', isAuth, allStaffRoles, toggleActiveStatus)

router.put('/togglePublished', isAuth, allStaffRoles, toggleIsPublished)

router.put('/toggleFeatured', isAuth, allStaffRoles, toggleIsFeatured)

router.put('/view', isAuth, viewTender)

router.delete('/delete', isAuth, allStaffRoles, toggleDelete)

export default router;  