import { clientPromise, ObjectId } from './mongodb';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { WithId, Document } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface UserDocument extends Document {
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User | null;
  token: string | null;
  error?: string;
}

export const auth = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const client = await clientPromise;
      const db = client.db();

      // Check if user exists
      const existingUser = await db.collection<UserDocument>('users').findOne({ email });
      if (existingUser) {
        return { user: null, token: null, error: 'User already exists' };
      }

      // Hash password
      const hashedPassword = await hash(password, 12);

      // Create user
      const result = await db.collection<UserDocument>('users').insertOne({
        email,
        password: hashedPassword,
        createdAt: new Date(),
      } as UserDocument);

      const newUser: User = {
        _id: result.insertedId.toString(),
        email,
        createdAt: new Date(),
      };

      // Generate token
      const token = sign(
        { userId: newUser._id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { user: newUser, token };
    } catch (error) {
      return { user: null, token: null, error: 'Failed to create user' };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const client = await clientPromise;
      const db = client.db();

      // Find user
      const user = await db.collection<UserDocument>('users').findOne({ email });
      if (!user) {
        return { user: null, token: null, error: 'User not found' };
      }

      // Verify password
      const isValid = await compare(password, user.password);
      if (!isValid) {
        return { user: null, token: null, error: 'Invalid password' };
      }

      // Generate token
      const token = sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const userData: User = {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      };

      return { user: userData, token };
    } catch (error) {
      return { user: null, token: null, error: 'Failed to authenticate' };
    }
  },

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = verify(token, JWT_SECRET) as { userId: string; email: string };
      const client = await clientPromise;
      const db = client.db();

      const user = await db.collection<UserDocument>('users').findOne({ email: decoded.email });
      if (!user) return null;

      return {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      };
    } catch (error) {
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const client = await clientPromise;
      const db = client.db();

      const result = await db.collection<UserDocument>('users').findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updates },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return {
        _id: result._id.toString(),
        email: result.email,
        name: result.name,
        createdAt: result.createdAt,
      };
    } catch (error) {
      return null;
    }
  },
};