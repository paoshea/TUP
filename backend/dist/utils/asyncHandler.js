"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = exports.withTransaction = exports.withErrorHandling = exports.asyncHandler = void 0;
/**
 * Wraps an async request handler to properly catch and forward errors
 * @param fn The async request handler function
 * @returns A function that handles the async operation and catches any errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * Creates a wrapper for database operations with proper error handling
 * @param operation The database operation to perform
 * @returns A promise that resolves with the operation result or rejects with a handled error
 */
const withErrorHandling = async (operation) => {
    try {
        return await operation();
    }
    catch (error) {
        // Handle specific database errors
        if (error.name === 'ValidationError') {
            throw new Error(`Validation Error: ${error.message}`);
        }
        if (error.name === 'CastError') {
            throw new Error(`Invalid ID: ${error.value}`);
        }
        if (error.code === 11000) {
            throw new Error('Duplicate entry');
        }
        // Re-throw other errors
        throw error;
    }
};
exports.withErrorHandling = withErrorHandling;
/**
 * Wraps a database operation in a transaction
 * @param operation The database operation to perform within a transaction
 * @returns A promise that resolves with the operation result
 */
const withTransaction = async (operation) => {
    const mongoose = await Promise.resolve().then(() => __importStar(require('mongoose')));
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await operation(session);
        await session.commitTransaction();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.withTransaction = withTransaction;
/**
 * Retries an operation with exponential backoff
 * @param operation The operation to retry
 * @param maxRetries Maximum number of retry attempts
 * @param baseDelay Base delay in milliseconds
 * @returns A promise that resolves with the operation result
 */
const withRetry = async (operation, maxRetries = 3, baseDelay = 1000) => {
    let lastError = null;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Only retry on specific errors
            if (!isRetryableError(error)) {
                throw error;
            }
            // Wait with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError || new Error('Operation failed after retries');
};
exports.withRetry = withRetry;
/**
 * Determines if an error is retryable
 * @param error The error to check
 * @returns boolean indicating if the error is retryable
 */
const isRetryableError = (error) => {
    // Add specific error types that should be retried
    return (error.name === 'MongoNetworkError' ||
        error.name === 'MongoTimeoutError' ||
        (error.code && [11000, 11001].includes(error.code)));
};
