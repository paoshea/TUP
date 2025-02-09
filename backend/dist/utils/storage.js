"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.StorageService = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const apiResponse_1 = require("./apiResponse");
// Supported file types and their corresponding MIME types
const SUPPORTED_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const DEFAULT_CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadDir: path_1.default.join(process.cwd(), 'uploads'),
};
class StorageService {
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Validates a file before upload
     */
    validateFile(file) {
        // Check file size
        if (file.size > this.config.maxFileSize) {
            throw new apiResponse_1.ApiError(400, 'FILE_TOO_LARGE', `File size exceeds maximum limit of ${this.config.maxFileSize / 1024 / 1024}MB`);
        }
        // Check file type
        if (!this.config.allowedTypes.includes(file.mimetype)) {
            throw new apiResponse_1.ApiError(400, 'INVALID_FILE_TYPE', `File type ${file.mimetype} is not supported. Allowed types: ${this.config.allowedTypes.join(', ')}`);
        }
    }
    /**
     * Generates a unique filename for the uploaded file
     */
    generateFileName(originalName, buffer) {
        const hash = (0, crypto_1.createHash)('sha256')
            .update(buffer)
            .update(Date.now().toString())
            .digest('hex')
            .slice(0, 16);
        const ext = path_1.default.extname(originalName).toLowerCase();
        return `${hash}${ext}`;
    }
    /**
     * Ensures the upload directory exists
     */
    async ensureUploadDir() {
        try {
            await fs_1.promises.access(this.config.uploadDir);
        }
        catch (_a) {
            await fs_1.promises.mkdir(this.config.uploadDir, { recursive: true });
        }
    }
    /**
     * Saves a file to storage
     */
    async saveFile(file) {
        // Validate file
        this.validateFile(file);
        // Ensure upload directory exists
        await this.ensureUploadDir();
        // Generate unique filename
        const fileName = this.generateFileName(file.originalname, file.buffer);
        const filePath = path_1.default.join(this.config.uploadDir, fileName);
        // Save file
        await fs_1.promises.writeFile(filePath, file.buffer);
        return fileName;
    }
    /**
     * Deletes a file from storage
     */
    async deleteFile(fileName) {
        const filePath = path_1.default.join(this.config.uploadDir, fileName);
        try {
            await fs_1.promises.unlink(filePath);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    /**
     * Gets the full path for a file
     */
    getFilePath(fileName) {
        return path_1.default.join(this.config.uploadDir, fileName);
    }
    /**
     * Checks if a file exists
     */
    async fileExists(fileName) {
        try {
            await fs_1.promises.access(this.getFilePath(fileName));
            return true;
        }
        catch (_a) {
            return false;
        }
    }
}
exports.StorageService = StorageService;
// Export singleton instance with default config
exports.storage = new StorageService();
