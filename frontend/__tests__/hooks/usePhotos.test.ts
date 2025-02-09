import { renderHook, act } from '@testing-library/react';
import { usePhotos } from '@/hooks/usePhotos';

describe('usePhotos', () => {
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockAnimalId = 'test-animal-123';

  beforeEach(() => {
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => usePhotos(mockAnimalId));

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles photo upload successfully', async () => {
    const mockPhotoUrl = 'test-url';
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ path: 'test-path' }),
      })
    );
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: mockPhotoUrl }),
      })
    );

    const { result } = renderHook(() => usePhotos(mockAnimalId));

    let uploadedUrl: string | undefined;
    await act(async () => {
      uploadedUrl = await result.current.uploadPhoto(mockFile);
    });

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(uploadedUrl).toBe(mockPhotoUrl);
  });

  it('handles upload error', async () => {
    const error = new Error('Upload failed');
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error)
    );

    const { result } = renderHook(() => usePhotos(mockAnimalId));

    await act(async () => {
      try {
        await result.current.uploadPhoto(mockFile);
        fail('Expected upload to fail');
      } catch {
        // Expected error
      }
    });

    expect(result.current.uploading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to upload photo');
  });

  it('handles photo deletion successfully', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { result } = renderHook(() => usePhotos(mockAnimalId));
    const photoPath = 'test-path/photo.jpg';

    await act(async () => {
      await result.current.deletePhoto(photoPath);
    });

    expect(result.current.error).toBeNull();
  });

  it('handles deletion error', async () => {
    const error = new Error('Delete failed');
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error)
    );

    const { result } = renderHook(() => usePhotos(mockAnimalId));
    const photoPath = 'test-path/photo.jpg';

    await act(async () => {
      try {
        await result.current.deletePhoto(photoPath);
        fail('Expected deletion to fail');
      } catch {
        // Expected error
      }
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to delete photo');
  });
});