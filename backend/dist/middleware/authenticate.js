"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const models_1 = require("../models");
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return res.status(401).json({
                error: 'Authentication Required',
                message: 'No valid authentication token provided',
            });
        }
        const token = authHeader.replace('Bearer ', '');
        // Verify token
        const decoded = (0, jsonwebtoken_1.verify)(token, config_1.config.jwt.secret);
        // Check if user exists
        const user = await models_1.Profile.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                error: 'Authentication Failed',
                message: 'User not found',
            });
        }
        // Add user to request object
        req.user = {
            id: user._id.toString(),
            email: user.email,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Invalid Token',
                message: 'Authentication token is invalid',
            });
        }
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token Expired',
                message: 'Authentication token has expired',
            });
        }
        next(error);
    }
};
exports.authenticate = authenticate;
