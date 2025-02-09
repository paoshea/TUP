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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_MESSAGES = exports.PATTERNS = exports.ERROR_MESSAGES = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.SUPPORTED_IMAGE_TYPES = exports.MAX_FILE_SIZE = exports.UPLOAD_DIR = void 0;
__exportStar(require("./apiResponse"), exports);
__exportStar(require("./asyncHandler"), exports);
__exportStar(require("./cache"), exports);
__exportStar(require("./database"), exports);
__exportStar(require("./dateTime"), exports);
__exportStar(require("./storage"), exports);
__exportStar(require("./validation"), exports);
// Export commonly used constants and configurations
exports.UPLOAD_DIR = 'uploads';
exports.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
exports.SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
exports.DEFAULT_PAGE_SIZE = 10;
exports.MAX_PAGE_SIZE = 100;
// Export commonly used error messages
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: 'You must be authenticated to access this resource',
    FORBIDDEN: 'You do not have permission to access this resource',
    NOT_FOUND: (resource) => `${resource} not found`,
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_ERROR: 'An unexpected error occurred',
    DUPLICATE_ENTRY: 'A record with this value already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    INVALID_TOKEN: 'Invalid or expired token',
    FILE_TOO_LARGE: (maxSize) => `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB`,
    INVALID_FILE_TYPE: (allowedTypes) => `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
};
// Export commonly used regex patterns
exports.PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    PHONE: /^\+?[\d\s-]{10,}$/,
    MONGO_ID: /^[0-9a-fA-F]{24}$/,
};
// Export commonly used validation messages
exports.VALIDATION_MESSAGES = {
    REQUIRED: (field) => `${field} is required`,
    MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters long`,
    MAX_LENGTH: (field, max) => `${field} must not exceed ${max} characters`,
    MIN_VALUE: (field, min) => `${field} must be greater than or equal to ${min}`,
    MAX_VALUE: (field, max) => `${field} must be less than or equal to ${max}`,
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters long and contain at least one letter and one number',
    INVALID_PHONE: 'Invalid phone number',
    INVALID_DATE: 'Invalid date format',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
};
