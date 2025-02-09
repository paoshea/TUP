"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = exports.conflict = exports.forbidden = exports.unauthorized = exports.badRequest = exports.notFound = exports.createError = exports.sendError = exports.sendSuccess = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, code, message, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
const sendSuccess = (res, data, status = 200) => {
    const response = {
        success: true,
        data,
    };
    return res.status(status).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, error, status = 500) => {
    const response = {
        success: false,
        error: {
            code: error instanceof ApiError ? error.code : 'INTERNAL_SERVER_ERROR',
            message: error.message || 'An unexpected error occurred',
            details: error instanceof ApiError ? error.details : undefined,
        },
    };
    return res.status(error instanceof ApiError ? error.status : status).json(response);
};
exports.sendError = sendError;
const createError = (status, code, message, details) => {
    return new ApiError(status, code, message, details);
};
exports.createError = createError;
// Common error creators
const notFound = (resource, id) => {
    const message = id
        ? `${resource} with ID ${id} not found`
        : `${resource} not found`;
    return (0, exports.createError)(404, 'NOT_FOUND', message);
};
exports.notFound = notFound;
const badRequest = (message, details) => {
    return (0, exports.createError)(400, 'BAD_REQUEST', message, details);
};
exports.badRequest = badRequest;
const unauthorized = (message = 'Unauthorized') => {
    return (0, exports.createError)(401, 'UNAUTHORIZED', message);
};
exports.unauthorized = unauthorized;
const forbidden = (message = 'Forbidden') => {
    return (0, exports.createError)(403, 'FORBIDDEN', message);
};
exports.forbidden = forbidden;
const conflict = (message, details) => {
    return (0, exports.createError)(409, 'CONFLICT', message, details);
};
exports.conflict = conflict;
const validationError = (details) => {
    return (0, exports.createError)(400, 'VALIDATION_ERROR', 'Validation failed', details);
};
exports.validationError = validationError;
