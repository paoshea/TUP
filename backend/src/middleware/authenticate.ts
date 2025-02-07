import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config';
import { Profile } from '../models';

interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'No valid authentication token provided',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = verify(token, config.jwt.secret) as JwtPayload;

    // Check if user exists
    const user = await Profile.findById(decoded.userId);
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
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'Authentication token is invalid',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Authentication token has expired',
      });
    }

    next(error);
  }
};