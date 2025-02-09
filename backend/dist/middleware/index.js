"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnership = exports.requireRole = exports.authenticate = exports.requestLogger = exports.errorHandler = void 0;
var errorHandler_1 = require("./errorHandler");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return errorHandler_1.errorHandler; } });
var requestLogger_1 = require("./requestLogger");
Object.defineProperty(exports, "requestLogger", { enumerable: true, get: function () { return requestLogger_1.requestLogger; } });
var authenticate_1 = require("./authenticate");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return authenticate_1.authenticate; } });
// Role-based access control middleware factory
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication Required',
                message: 'You must be logged in to access this resource',
            });
        }
        // TODO: Implement role checking once roles are added to the user model
        // For now, just pass through
        next();
    };
};
exports.requireRole = requireRole;
// Ownership check middleware factory
const requireOwnership = (paramName) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication Required',
                message: 'You must be logged in to access this resource',
            });
        }
        const resourceId = req.params[paramName];
        if (!resourceId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: `Resource ID parameter '${paramName}' is required`,
            });
        }
        // TODO: Implement ownership checking based on the resource type
        // For now, just pass through
        next();
    };
};
exports.requireOwnership = requireOwnership;
