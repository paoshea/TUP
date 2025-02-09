"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const models_1 = require("../models");
const apiResponse_1 = require("../utils/apiResponse");
const config_1 = require("../config");
const BaseService_1 = require("./BaseService");
class AuthService extends BaseService_1.BaseService {
    constructor() {
        super(models_1.Profile);
        this.jwtSecret = config_1.config.jwt.secret;
        this.defaultExpiresIn = config_1.config.jwt.expiresIn || '7d';
    }
    /**
     * Sign up a new user
     */
    async signUp(email, password, fullName) {
        // Check if user already exists
        const existingUser = await this.findOne({ email });
        if (existingUser) {
            throw new apiResponse_1.ApiError(409, 'USER_EXISTS', 'A user with this email already exists');
        }
        // Hash password
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 10);
        // Create user
        const user = await this.create({
            email,
            password: hashedPassword,
            fullName,
            isActive: true,
        });
        // Remove password from response
        const userObject = user.toObject();
        delete userObject.password;
        return userObject;
    }
    /**
     * Sign in a user
     */
    async signIn(email, password) {
        // Find user
        const user = await this.findOne({ email });
        if (!user) {
            throw new apiResponse_1.ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }
        // Check password
        const isValidPassword = await (0, bcryptjs_1.compare)(password, user.password);
        if (!isValidPassword) {
            throw new apiResponse_1.ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }
        // Update last login
        await this.update(user._id, { lastLogin: new Date() });
        // Generate token
        const token = this.generateToken(user);
        // Remove password from response
        const userObject = user.toObject();
        delete userObject.password;
        return { user: userObject, token };
    }
    /**
     * Verify a JWT token
     */
    async verifyToken(token) {
        try {
            // Verify token
            const decoded = (0, jsonwebtoken_1.verify)(token, this.jwtSecret);
            // Find user
            const user = await this.findById(decoded.userId);
            if (!user) {
                throw new apiResponse_1.ApiError(401, 'INVALID_TOKEN', 'User not found');
            }
            if (!user.isActive) {
                throw new apiResponse_1.ApiError(401, 'ACCOUNT_INACTIVE', 'Account is inactive');
            }
            // Remove password from response
            const userObject = user.toObject();
            delete userObject.password;
            return userObject;
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name === 'JsonWebTokenError') {
                    throw new apiResponse_1.ApiError(401, 'INVALID_TOKEN', 'Invalid token');
                }
                if (error.name === 'TokenExpiredError') {
                    throw new apiResponse_1.ApiError(401, 'TOKEN_EXPIRED', 'Token has expired');
                }
            }
            throw error;
        }
    }
    /**
     * Change user password
     */
    async changePassword(userId, currentPassword, newPassword) {
        // Find user
        const user = await this.findById(userId);
        if (!user) {
            throw new apiResponse_1.ApiError(404, 'USER_NOT_FOUND', 'User not found');
        }
        // Verify current password
        const isValidPassword = await (0, bcryptjs_1.compare)(currentPassword, user.password);
        if (!isValidPassword) {
            throw new apiResponse_1.ApiError(401, 'INVALID_PASSWORD', 'Current password is incorrect');
        }
        // Hash new password
        const hashedPassword = await (0, bcryptjs_1.hash)(newPassword, 10);
        // Update password
        await this.update(userId, { password: hashedPassword });
    }
    /**
     * Request password reset
     */
    async requestPasswordReset(email) {
        // Find user
        const user = await this.findOne({ email });
        if (!user) {
            // Don't reveal whether a user exists
            return;
        }
        // Generate reset token with short expiration
        const token = this.generateToken(user, '1h');
        // TODO: Send reset email
        console.log('Reset token:', token);
    }
    /**
     * Reset password using token
     */
    async resetPassword(token, newPassword) {
        // Verify token
        const decoded = (0, jsonwebtoken_1.verify)(token, this.jwtSecret);
        // Find user
        const user = await this.findById(decoded.userId);
        if (!user) {
            throw new apiResponse_1.ApiError(404, 'USER_NOT_FOUND', 'User not found');
        }
        // Hash new password
        const hashedPassword = await (0, bcryptjs_1.hash)(newPassword, 10);
        // Update password
        await this.update(user._id, { password: hashedPassword });
    }
    /**
     * Generate a JWT token
     */
    generateToken(user, expiresIn) {
        const payload = {
            userId: user._id.toString(),
            email: user.email,
        };
        const options = {
            expiresIn: expiresIn || this.defaultExpiresIn,
        };
        return (0, jsonwebtoken_1.sign)(payload, this.jwtSecret, options);
    }
}
exports.AuthService = AuthService;
// Export singleton instance
exports.authService = new AuthService();
