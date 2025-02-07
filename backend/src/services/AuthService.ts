import { compare, hash } from 'bcryptjs';
import { sign, verify, SignOptions, JwtPayload } from 'jsonwebtoken';
import { Profile } from '../models';
import { ApiError } from '../utils/apiResponse';
import { config } from '../config';
import { BaseService } from './BaseService';
import type { IProfile } from '../models/Profile';

interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

type ProfileDocument = IProfile & {
  toObject(): Record<string, any>;
};

type ProfileResponse = Omit<ProfileDocument, 'password'>;

export class AuthService extends BaseService<IProfile> {
  private readonly jwtSecret: string;
  private readonly defaultExpiresIn: string;

  constructor() {
    super(Profile);
    this.jwtSecret = config.jwt.secret;
    this.defaultExpiresIn = config.jwt.expiresIn || '7d';
  }

  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, fullName?: string): Promise<ProfileResponse> {
    // Check if user already exists
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'USER_EXISTS', 'A user with this email already exists');
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await this.create({
      email,
      password: hashedPassword,
      fullName,
      isActive: true,
    } as Partial<IProfile>);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    return userObject as ProfileResponse;
  }

  /**
   * Sign in a user
   */
  async signIn(email: string, password: string): Promise<{ user: ProfileResponse; token: string }> {
    // Find user
    const user = await this.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Check password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Update last login
    await this.update(user._id, { lastLogin: new Date() });

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    return { user: userObject as ProfileResponse, token };
  }

  /**
   * Verify a JWT token
   */
  async verifyToken(token: string): Promise<ProfileResponse> {
    try {
      // Verify token
      const decoded = verify(token, this.jwtSecret) as TokenPayload;

      // Find user
      const user = await this.findById(decoded.userId);
      if (!user) {
        throw new ApiError(401, 'INVALID_TOKEN', 'User not found');
      }

      if (!user.isActive) {
        throw new ApiError(401, 'ACCOUNT_INACTIVE', 'Account is inactive');
      }

      // Remove password from response
      const userObject = user.toObject();
      delete userObject.password;
      return userObject as ProfileResponse;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'JsonWebTokenError') {
          throw new ApiError(401, 'INVALID_TOKEN', 'Invalid token');
        }
        if (error.name === 'TokenExpiredError') {
          throw new ApiError(401, 'TOKEN_EXPIRED', 'Token has expired');
        }
      }
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Find user
    const user = await this.findById(userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, 'INVALID_PASSWORD', 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    await this.update(userId, { password: hashedPassword });
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
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
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Verify token
    const decoded = verify(token, this.jwtSecret) as TokenPayload;
    
    // Find user
    const user = await this.findById(decoded.userId);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password
    await this.update(user._id, { password: hashedPassword });
  }

  /**
   * Generate a JWT token
   */
  private generateToken(user: IProfile, expiresIn?: string): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const options = {
      expiresIn: expiresIn || this.defaultExpiresIn,
    } as SignOptions;

    return sign(payload, this.jwtSecret, options);
  }
}

// Export singleton instance
export const authService = new AuthService();