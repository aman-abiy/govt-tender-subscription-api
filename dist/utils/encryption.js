"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptVal = exports.encryptVal = void 0;
const crypto_1 = require("crypto");
// dotenv.config({ path: `${__dirname}/config/keys.config.env` });
const encryptVal = (val) => {
    const cipher = (0, crypto_1.createCipheriv)('aes256', process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_INITIALIZATION_VECTOR);
    return (cipher.update(val.toString(), 'utf-8', 'hex') + cipher.final('hex'));
};
exports.encryptVal = encryptVal;
const decryptVal = (val) => {
    const decipher = (0, crypto_1.createDecipheriv)('aes256', process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_INITIALIZATION_VECTOR);
    return (decipher.update(val.toString(), 'hex', 'utf-8') + decipher.final('utf8'));
};
exports.decryptVal = decryptVal;
