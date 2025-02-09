"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const validation_1 = require("../utils/validation");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Validation schemas
const signUpSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
        fullName: zod_1.z.string().optional(),
    }),
});
const signInSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string(),
    }),
});
const changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string(),
        newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters long'),
    }),
});
const resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string(),
        newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters long'),
    }),
});
// Public routes
router.post('/signup', (0, validation_1.validateRequest)(signUpSchema), controllers_1.authController.signUp);
router.post('/signin', (0, validation_1.validateRequest)(signInSchema), controllers_1.authController.signIn);
router.post('/verify', controllers_1.authController.verifyToken);
router.post('/password-reset/request', controllers_1.authController.requestPasswordReset);
router.post('/password-reset', (0, validation_1.validateRequest)(resetPasswordSchema), controllers_1.authController.resetPassword);
// Protected routes
router.use(middleware_1.authenticate);
router.post('/change-password', (0, validation_1.validateRequest)(changePasswordSchema), controllers_1.authController.changePassword);
exports.default = router;
