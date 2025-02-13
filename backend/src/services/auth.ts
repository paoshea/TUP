import bcrypt from 'bcrypt';
import { PrismaService } from './PrismaService';
import { ApiError } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';

export class AuthService extends PrismaService {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async register(email: string, password: string, fullName?: string) {
    try {
      const hashedPassword = await this.hashPassword(password);

      const user = await this.profile.create({
        data: {
          email,
          password: hashedPassword,
          fullName
        }
      });

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApiError(400, 'EMAIL_EXISTS', 'Email already exists');
        }
      }
      this.handleError(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.profile.findUnique({
        where: { email }
      });

      if (!user) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const isValid = await this.comparePassword(password, user.password);
      if (!isValid) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      await this.profile.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await this.profile.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
      }

      const isValid = await this.comparePassword(currentPassword, user.password);
      if (!isValid) {
        throw new ApiError(401, 'INVALID_PASSWORD', 'Current password is incorrect');
      }

      const hashedPassword = await this.hashPassword(newPassword);

      await this.profile.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProfile(userId: string, data: { fullName?: string }) {
    try {
      const user = await this.profile.update({
        where: { id: userId },
        data
      });

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
