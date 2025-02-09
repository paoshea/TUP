"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
exports.config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    cors: {
        origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/livestock',
        options: {
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
    sync: {
        batchSize: parseInt(process.env.SYNC_BATCH_SIZE || '100', 10),
        interval: parseInt(process.env.SYNC_INTERVAL || '5000', 10),
        maxRetries: parseInt(process.env.SYNC_MAX_RETRIES || '3', 10),
    },
};
