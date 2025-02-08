import dotenv from 'dotenv';
import { ConnectOptions } from 'mongoose';

// Load environment variables
dotenv.config();

export interface Config {
  env: string;
  port: number;
  cors: {
    origin: string[];
  };
  mongodb: {
    uri: string;
    options: ConnectOptions;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  storage: {
    uploadDir: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  cors: {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/livestock',
    options: {
      // These options are now properly typed through ConnectOptions
      minPoolSize: 5,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  storage: {
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};