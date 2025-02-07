import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { ApiError } from './apiResponse';

// Supported file types and their corresponding MIME types
const SUPPORTED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

type SupportedMimeType = keyof typeof SUPPORTED_TYPES;

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface StorageConfig {
  maxFileSize: number;
  allowedTypes: SupportedMimeType[];
  uploadDir: string;
}

const DEFAULT_CONFIG: StorageConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadDir: path.join(process.cwd(), 'uploads'),
};

export class StorageService {
  private config: StorageConfig;

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Validates a file before upload
   */
  private validateFile(file: UploadedFile): void {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      throw new ApiError(
        400,
        'FILE_TOO_LARGE',
        `File size exceeds maximum limit of ${this.config.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Check file type
    if (!this.config.allowedTypes.includes(file.mimetype as SupportedMimeType)) {
      throw new ApiError(
        400,
        'INVALID_FILE_TYPE',
        `File type ${file.mimetype} is not supported. Allowed types: ${this.config.allowedTypes.join(
          ', '
        )}`
      );
    }
  }

  /**
   * Generates a unique filename for the uploaded file
   */
  private generateFileName(originalName: string, buffer: Buffer): string {
    const hash = createHash('sha256')
      .update(buffer)
      .update(Date.now().toString())
      .digest('hex')
      .slice(0, 16);

    const ext = path.extname(originalName).toLowerCase();
    return `${hash}${ext}`;
  }

  /**
   * Ensures the upload directory exists
   */
  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.config.uploadDir);
    } catch {
      await fs.mkdir(this.config.uploadDir, { recursive: true });
    }
  }

  /**
   * Saves a file to storage
   */
  async saveFile(file: UploadedFile): Promise<string> {
    // Validate file
    this.validateFile(file);

    // Ensure upload directory exists
    await this.ensureUploadDir();

    // Generate unique filename
    const fileName = this.generateFileName(file.originalname, file.buffer);
    const filePath = path.join(this.config.uploadDir, fileName);

    // Save file
    await fs.writeFile(filePath, file.buffer);

    return fileName;
  }

  /**
   * Deletes a file from storage
   */
  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.config.uploadDir, fileName);
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Gets the full path for a file
   */
  getFilePath(fileName: string): string {
    return path.join(this.config.uploadDir, fileName);
  }

  /**
   * Checks if a file exists
   */
  async fileExists(fileName: string): Promise<boolean> {
    try {
      await fs.access(this.getFilePath(fileName));
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance with default config
export const storage = new StorageService();