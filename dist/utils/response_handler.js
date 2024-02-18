"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const responseHandler = ({ res, status, statusCode, sessionToken, link, data, msg, metaData }) => {
    return res.status(statusCode).json({
        metaData,
        status,
        sessionToken,
        link,
        data,
        msg
    });
};
exports.responseHandler = responseHandler;
