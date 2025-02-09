import { storage } from '@/services/storage';

describe('Storage Service Integration', () => {
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockPath = 'test-path/photo.jpg';
  const mockFileId = 'test-file-123';

  beforeEach(() => {
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  it('should upload a photo', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ path: mockPath, fileId: mockFileId }),
      })
    );

    const result = await storage.uploadPhoto(mockFile, mockPath);
    expect(result).toEqual({ path: mockPath, fileId: mockFileId });
  });

  it('should get photo URL', () => {
    const url = storage.getPhotoUrl(mockPath);
    expect(url).toBe(`/api/photos?path=${encodeURIComponent(mockPath)}`);
  });

  it('should throw error when getting URL with empty path', () => {
    expect(() => storage.getPhotoUrl('')).toThrow('Path is required');
  });

  it('should handle photo deletion', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    await expect(storage.deletePhoto(mockPath)).resolves.not.toThrow();
  });

  it('should get photo data', async () => {
    const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      })
    );

    const result = await storage.getPhotoData(mockPath);
    expect(result).toEqual(mockBlob);
  });

  it('should handle upload errors', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Server error' }),
      })
    );

    await expect(storage.uploadPhoto(mockFile, mockPath)).rejects.toThrow(
      'Failed to upload photo: Server error'
    );
  });

  it('should handle deletion errors', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'File not found' }),
      })
    );

    await expect(storage.deletePhoto(mockPath)).rejects.toThrow(
      'Failed to delete photo: File not found'
    );
  });

  it('should handle photo data fetch errors', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'File not found' }),
      })
    );

    await expect(storage.getPhotoData(mockPath)).rejects.toThrow(
      'Failed to get photo: File not found'
    );
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(networkError)
    );

    await expect(storage.uploadPhoto(mockFile, mockPath)).rejects.toThrow(
      'Failed to upload photo: Network error'
    );
  });

  it('should handle invalid JSON responses', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })
    );

    await expect(storage.uploadPhoto(mockFile, mockPath)).rejects.toThrow(
      'Failed to upload photo: Invalid JSON'
    );
  });
});