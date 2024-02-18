import dotenv from 'dotenv'
import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from 'crypto'

// dotenv.config({ path: `${__dirname}/config/keys.config.env` });

export const encryptVal = (val: String) => {
    const cipher = createCipheriv('aes256', process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_INITIALIZATION_VECTOR);

    return (cipher.update(val.toString(), 'utf-8', 'hex') + cipher.final('hex'))
}

export const decryptVal = (val: String) => {
    const decipher = createDecipheriv('aes256', process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_INITIALIZATION_VECTOR);

    return (decipher.update(val.toString(), 'hex', 'utf-8') + decipher.final('utf8'))
}