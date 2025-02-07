import { renderHook, act } from '@testing-library/react';
import { usePhotos } from '../../hooks/usePhotos';
import { storage } from '../../services/storage';

// Mock the storage service
jest.mock('../../services/storage', () => ({
  storage: {
    uploadPhoto: jest.fn(),
    getPhotoUrl: jest.fn(),
    deletePhoto: jest.fn(),
  },
}));

describe('usePhotos', () => {
  const testAnimalId = 'test-animal-123';
  const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with no error and not uploading', () => {
    const { result } = renderHook(() => usePhotos(testAnimalId));
    expect(result.current.error).toBeNull();
    expect(result.current.uploading).toBe(false);
  });

  it('handles photo upload successfully', async () => {
    const mockPath = `${testAnimalId}/test.jpg`;
    const mockUrl = 'https://example.com/photos/test.jpg';

    (storage.uploadPhoto as jest.Mock).mockResolvedValueOnce({ path: mockPath });
    (storage.getPhotoUrl as jest.Mock).mockReturnValueOnce(mockUrl);

    const { result } = renderHook(() => usePhotos(testAnimalId));

    let uploadedUrl: string | undefined;

    await act(async () => {
      uploadedUrl = await result.current.uploadPhoto(testFile);
    });

    expect(uploadedUrl).toBe(mockUrl);
    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(storage.uploadPhoto).toHaveBeenCalledWith(testFile, expect.stringContaining(testAnimalId));
    expect(storage.getPhotoUrl).toHaveBeenCalledWith(mockPath);
  });

  it('handles upload error', async () => {
    const error = new Error('Upload failed');
    (storage.uploadPhoto as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePhotos(testAnimalId));

    await expect(
      act(async () => {
        await result.current.uploadPhoto(testFile);
      })
    ).rejects.toThrow('Upload failed');

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('handles photo deletion successfully', async () => {
    const mockPath = `${testAnimalId}/test.jpg`;
    (storage.deletePhoto as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => usePhotos(testAnimalId));

    await act(async () => {
      await result.current.deletePhoto(mockPath);
    });

    expect(result.current.error).toBeNull();
    expect(storage.deletePhoto).toHaveBeenCalledWith(mockPath);
  });

  it('handles deletion error', async () => {
    const error = new Error('Delete failed');
    const mockPath = `${testAnimalId}/test.jpg`;
    (storage.deletePhoto as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePhotos(testAnimalId));

    await expect(
      act(async () => {
        await result.current.deletePhoto(mockPath);
      })
    ).rejects.toThrow('Delete failed');

    expect(result.current.error).toEqual(error);
  });

  it('generates unique file paths for uploads', async () => {
    const mockUrl = 'https://example.com/photos/test.jpg';
    (storage.uploadPhoto as jest.Mock).mockResolvedValueOnce({ path: 'path1' });
    (storage.getPhotoUrl as jest.Mock).mockReturnValueOnce(mockUrl);

    const { result } = renderHook(() => usePhotos(testAnimalId));

    await act(async () => {
      await result.current.uploadPhoto(testFile);
    });

    const uploadPath = (storage.uploadPhoto as jest.Mock).mock.calls[0][1];
    expect(uploadPath).toContain(testAnimalId);
    expect(uploadPath).toContain(testFile.name);
    expect(uploadPath).toMatch(/\d{13}-test\.jpg$/); // Timestamp format
  });
});