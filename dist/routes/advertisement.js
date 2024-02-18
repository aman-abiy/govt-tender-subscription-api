"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const is_auth_1 = __importDefault(require("../middleware/is_auth"));
const advertisement_1 = require("../services/advertisement");
const role_permission_1 = require("../middleware/role_permission");
const router = express_1.default.Router();
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'documents/advertisments');
    },
    filename: function (req, file, cb) {
        const now = Date.now();
        let oldName = file.originalname.replace(/\s/g, '_');
        cb(null, `${now}_${oldName}`);
        req.fileTimeStamp = now;
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        console.log('PAASSED');
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
router.post('/add', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, (0, multer_1.default)({ storage: storage, fileFilter: fileFilter }).single('bannerImage'), advertisement_1.addAdvertisement);
router.get('/', is_auth_1.default, advertisement_1.getAdvertisement);
router.put('/edit', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, advertisement_1.editAdvertisement);
router.put('/toggleActiveStatus', role_permission_1.aboveAndIncAdminRole, is_auth_1.default, advertisement_1.toggleActiveStatus);
router.delete('/delete', is_auth_1.default, role_permission_1.aboveAndIncAdminRole, advertisement_1.toggleDelete);
exports.default = router;
