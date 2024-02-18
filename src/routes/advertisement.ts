import express from 'express';
import multer from 'multer'
import isAuth from '../middleware/is_auth';
import { addAdvertisement, getAdvertisement, toggleDelete, toggleActiveStatus, editAdvertisement } from '../services/advertisement';
import { aboveAndIncAdminRole } from '../middleware/role_permission';

const router = express.Router();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'documents/advertisments')
    },
    filename: function(req, file, cb) {        
        const now = Date.now()
        let oldName :String = file.originalname.replace(/\s/g,'_')
        cb(null, `${now}_${oldName}`)
        req.fileTimeStamp = now
    },
})

const fileFilter = (req: any, file: { mimetype: string; }, cb: (arg0: any, arg1: boolean) => void) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        console.log('PAASSED')
        cb(null, true);
    } else {
        cb(null, false)
    }
}

router.post('/add', isAuth, aboveAndIncAdminRole, multer({ storage: storage, fileFilter: fileFilter }).single('bannerImage'), addAdvertisement)

router.get('/', isAuth, getAdvertisement)

router.put('/edit', isAuth, aboveAndIncAdminRole, editAdvertisement)

router.put('/toggleActiveStatus', aboveAndIncAdminRole, isAuth, toggleActiveStatus)

router.delete('/delete', isAuth, aboveAndIncAdminRole, toggleDelete)

export default router;  