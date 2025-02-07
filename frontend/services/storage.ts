interface UploadResult {
  path: string;
  fileId: string;
}

export const storage = {
  async uploadPhoto(file: File, path: string): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload photo');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getPhotoUrl(path: string): string {
    if (!path) throw new Error('Path is required');
    return `/api/photos?path=${encodeURIComponent(path)}`;
  },

  async deletePhoto(path: string): Promise<void> {
    try {
      const response = await fetch(`/api/photos?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete photo');
      }
    } catch (error) {
      throw new Error(`Failed to delete photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async getPhotoData(path: string): Promise<Blob> {
    try {
      const response = await fetch(`/api/photos?path=${encodeURIComponent(path)}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get photo');
      }

      return await response.blob();
    } catch (error) {
      throw new Error(`Failed to get photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};