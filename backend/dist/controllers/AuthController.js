"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.changePassword = exports.verifyToken = exports.signIn = exports.signUp = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
exports.signUp = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, fullName } = req.body;
    const user = await services_1.authService.signUp(email, password, fullName);
    res.status(201).json({ success: true, data: user });
});
exports.signIn = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await services_1.authService.signIn(email, password);
    res.json({ success: true, data: { user, token } });
});
exports.verifyToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        throw new apiResponse_1.ApiError(401, 'UNAUTHORIZED', 'No token provided');
    }
    const user = await services_1.authService.verifyToken(token);
    res.json({ success: true, data: { user } });
});
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    await services_1.authService.changePassword(userId, currentPassword, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
});
exports.requestPasswordReset = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    await services_1.authService.requestPasswordReset(email);
    res.json({
        success: true,
        message: 'If an account exists with this email, a reset link will be sent',
    });
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token, newPassword } = req.body;
    await services_1.authService.resetPassword(token, newPassword);
    res.json({ success: true, message: 'Password reset successfully' });
});
