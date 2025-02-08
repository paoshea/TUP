import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiResponse';

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  const user = await authService.signUp(email, password, fullName);
  res.status(201).json({ success: true, data: user });
});

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await authService.signIn(email, password);
  res.json({ success: true, data: { user, token } });
});

export const verifyToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'No token provided');
  }

  const user = await authService.verifyToken(token);
  res.json({ success: true, data: { user } });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user!.id;

  await authService.changePassword(userId, currentPassword, newPassword);
  res.json({ success: true, message: 'Password updated successfully' });
});

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  await authService.requestPasswordReset(email);
  res.json({
    success: true,
    message: 'If an account exists with this email, a reset link will be sent',
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  await authService.resetPassword(token, newPassword);
  res.json({ success: true, message: 'Password reset successfully' });
});