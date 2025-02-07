import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  env: string;
  port: number;
  mongodb: {
    uri: string;
    options: {
      maxPoolSize: number;
    };
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string[];
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/livestock',
    options: {
      maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE || '10', 10),
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  },
};

export { config };