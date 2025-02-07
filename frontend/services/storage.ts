import { clientPromise } from './mongodb';
import { GridFSBucket } from 'mongodb';

interface UploadResult {
  path: string;
  fileId: string;
}

interface PhotoMetadata {
  path: string;
  fileId: string;
  contentType: string | undefined;
  size: number;
  uploadDate: Date;
}

export const storage = {
  async uploadPhoto(file: File, path: string): Promise<UploadResult> {
    try {
      const client = await clientPromise;
      const db = client.db();
      const bucket = new GridFSBucket(db, {
        bucketName: 'photos'
      });

      // Convert File to Buffer
      const buffer = await file.arrayBuffer();

      // Create upload stream
      const uploadStream = bucket.openUploadStream(path, {
        metadata: {
          contentType: file.type,
          originalName: file.name,
        }
      });

      // Write buffer to stream
      await new Promise<void>((resolve, reject) => {
        uploadStream.write(Buffer.from(buffer), (error) => {
          if (error) reject(error);
          uploadStream.end(() => resolve());
        });
      });

      return {
        path,
        fileId: uploadStream.id.toString()
      };
    } catch (error) {
      throw new Error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getPhotoUrl(path: string): string {
    if (!path) throw new Error('Path is required');
    // In a real application, this would be your CDN or API endpoint
    // For development, we'll use a local API route
    return `/api/photos/${encodeURIComponent(path)}`;
  },

  async deletePhoto(path: string): Promise<void> {
    try {
      const client = await clientPromise;
      const db = client.db();
      const bucket = new GridFSBucket(db, {
        bucketName: 'photos'
      });

      // Find the file by filename (path)
      const files = await bucket.find({ filename: path }).toArray();
      
      if (files.length === 0) {
        throw new Error('File not found');
      }

      // Delete the file
      await bucket.delete(files[0]._id);
    } catch (error) {
      throw new Error(`Failed to delete photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async getPhotoStream(path: string) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const bucket = new GridFSBucket(db, {
        bucketName: 'photos'
      });

      // Find the file by filename (path)
      const files = await bucket.find({ filename: path }).toArray();
      
      if (files.length === 0) {
        throw new Error('File not found');
      }

      // Return the download stream
      return bucket.openDownloadStream(files[0]._id);
    } catch (error) {
      throw new Error(`Failed to get photo stream: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async listPhotos(prefix: string): Promise<PhotoMetadata[]> {
    try {
      const client = await clientPromise;
      const db = client.db();
      const bucket = new GridFSBucket(db, {
        bucketName: 'photos'
      });

      const files = await bucket
        .find({ filename: { $regex: `^${prefix}` } })
        .sort({ uploadDate: -1 })
        .toArray();

      return files.map(file => ({
        path: file.filename,
        fileId: file._id.toString(),
        contentType: file.metadata?.contentType,
        size: file.length,
        uploadDate: file.uploadDate,
      }));
    } catch (error) {
      throw new Error(`Failed to list photos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};