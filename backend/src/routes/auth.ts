import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate } from '../middleware';
import { validateRequest } from '../utils/validation';
import { z } from 'zod';

const router = Router();

// Validation schemas
const signUpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    fullName: z.string().optional(),
  }),
});

const signInSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string(),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  }),
});

// Public routes
router.post('/signup', validateRequest(signUpSchema), authController.signUp);
router.post('/signin', validateRequest(signInSchema), authController.signIn);
router.post('/verify', authController.verifyToken);
router.post('/password-reset/request', authController.requestPasswordReset);
router.post('/password-reset', validateRequest(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.use(authenticate);
router.post(
  '/change-password',
  validateRequest(changePasswordSchema),
  authController.changePassword
);

export default router;