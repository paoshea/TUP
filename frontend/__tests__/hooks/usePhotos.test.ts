import { renderHook, act } from '@testing-library/react';
import { usePhotos } from '@/hooks/usePhotos';

// Create mock storage service
const mockStorageService = {
  uploadPhoto: jest.fn().mockResolvedValue({ path: 'test-url' }),
  getPhotoUrl: jest.fn().mockReturnValue('test-url'),
  deletePhoto: jest.fn().mockResolvedValue(undefined),
  getPhotoData: jest.fn().mockResolvedValue({ url: 'test-url', metadata: {} })
};

// Mock the storage service before importing the hook
jest.mock('@/services/storage', () => ({
  __esModule: true,
  default: mockStorageService
}));

describe('usePhotos', () => {
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockAnimalId = 'test-animal-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => usePhotos(mockAnimalId));

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles photo upload successfully', async () => {
    const { result } = renderHook(() => usePhotos(mockAnimalId));

    let uploadedUrl: string | undefined;
    await act(async () => {
      uploadedUrl = await result.current.uploadPhoto(mockFile);
    });

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(uploadedUrl).toBe('test-url');
    expect(mockStorageService.uploadPhoto).toHaveBeenCalledWith(mockFile, expect.any(String));
  });

  it('handles upload error', async () => {
    const error = new Error('Upload failed');
    mockStorageService.uploadPhoto.mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePhotos(mockAnimalId));

    await act(async () => {
      try {
        await result.current.uploadPhoto(mockFile);
        fail('Expected upload to fail');
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Upload failed');
  });

  it('handles photo deletion successfully', async () => {
    const { result } = renderHook(() => usePhotos(mockAnimalId));
    const photoPath = 'test-path/photo.jpg';

    await act(async () => {
      await result.current.deletePhoto(photoPath);
    });

    expect(result.current.error).toBeNull();
    expect(mockStorageService.deletePhoto).toHaveBeenCalledWith(photoPath);
  });

  it('handles deletion error', async () => {
    const error = new Error('Delete failed');
    mockStorageService.deletePhoto.mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePhotos(mockAnimalId));
    const photoPath = 'test-path/photo.jpg';

    await act(async () => {
      try {
        await result.current.deletePhoto(photoPath);
        fail('Expected deletion to fail');
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Delete failed');
  });
});