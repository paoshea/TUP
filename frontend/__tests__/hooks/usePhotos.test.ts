import { renderHook, act } from '@testing-library/react';
import { usePhotos } from '@/hooks/usePhotos';

// Create mock functions
const mockUploadPhoto = jest.fn().mockResolvedValue({ path: 'test-url' });
const mockGetPhotoUrl = jest.fn().mockReturnValue('test-url');
const mockDeletePhoto = jest.fn().mockResolvedValue(undefined);
const mockGetPhotoData = jest.fn().mockResolvedValue({ url: 'test-url', metadata: {} });

// Mock the storage service
jest.mock('@/services/storage', () => ({
  storage: {
    uploadPhoto: mockUploadPhoto,
    getPhotoUrl: mockGetPhotoUrl,
    deletePhoto: mockDeletePhoto,
    getPhotoData: mockGetPhotoData,
  }
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
    expect(mockUploadPhoto).toHaveBeenCalledWith(mockFile, expect.stringContaining(mockFile.name));
  });

  it('handles upload error', async () => {
    const error = new Error('Upload failed');
    mockUploadPhoto.mockRejectedValueOnce(error);

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
    expect(mockDeletePhoto).toHaveBeenCalledWith(photoPath);
  });

  it('handles deletion error', async () => {
    const error = new Error('Delete failed');
    mockDeletePhoto.mockRejectedValueOnce(error);

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