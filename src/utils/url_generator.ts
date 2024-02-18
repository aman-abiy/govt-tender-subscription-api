import { EMAIL_VERIFICATION_ROUTE, PASSWORD_RESET_ROUTE } from '../config/statics.config';

export const generateVerificationLink = (token: string) : URL => {
    return new URL(`${EMAIL_VERIFICATION_ROUTE}/${token}`)
}

export const generatePasswordResetLink = (token: string) : URL => {
    return new URL(`${PASSWORD_RESET_ROUTE}/${token}`)
}