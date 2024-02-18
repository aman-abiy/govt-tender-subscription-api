import crypto from 'crypto'

export const generateToken = () : string => {
    const token = crypto.createHash('sha256').update(crypto.randomBytes(20).toString('hex')).digest('hex');
    return token;
}