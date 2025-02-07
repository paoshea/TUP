import { useState } from 'react';
import { storage } from '../services/storage';

export function usePhotos(animalId: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      const path = `${animalId}/${Date.now()}-${file.name}`;
      const result = await storage.uploadPhoto(file, path);
      return storage.getPhotoUrl(result.path);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload photo');
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (path: string) => {
    try {
      setError(null);
      await storage.deletePhoto(path);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete photo');
      setError(error);
      throw error;
    }
  };

  return {
    uploadPhoto,
    deletePhoto,
    uploading,
    error,
  };
}