import { ResponseHandler } from './types/type_constants';

export const responseHandler = ({ res, status, statusCode, sessionToken, link, data, msg, metaData } : ResponseHandler) => {
    return res.status(statusCode).json({
        metaData,
        status,
        sessionToken,
        link,
        data,
        msg
    })
}