import { storage } from '../../services/storage';

describe('Storage Service Integration', () => {
  const testAnimalId = 'test-animal-123';
  let uploadedPath: string;

  beforeAll(() => {
    // Ensure test environment
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Tests must be run in test environment');
    }
  });

  afterAll(async () => {
    // Cleanup: delete test photo if it exists
    if (uploadedPath) {
      try {
        await storage.deletePhoto(uploadedPath);
      } catch (error) {
        console.error('Cleanup failed:', error);
      }
    }
  });

  it('should upload and retrieve a photo', async () => {
    // Create a test file
    const testFile = new File(['test image content'], 'test.jpg', { type: 'image/jpeg' });
    
    // Upload the file
    const result = await storage.uploadPhoto(testFile, `${testAnimalId}/test.jpg`);
    uploadedPath = result.path;

    // Verify upload result
    expect(result.path).toBeDefined();
    expect(result.fileId).toBeDefined();
    expect(result.path).toContain(testAnimalId);

    // Get photo URL
    const url = storage.getPhotoUrl(result.path);
    expect(url).toContain(encodeURIComponent(result.path));

    // Get photo data
    const blob = await storage.getPhotoData(result.path);
    expect(blob).toBeDefined();
    const text = await blob.text();
    expect(text).toBe('test image content');
  });

  it('should list photos by prefix', async () => {
    // Create another test file
    const testFile2 = new File(['test image 2'], 'test2.jpg', { type: 'image/jpeg' });
    await storage.uploadPhoto(testFile2, `${testAnimalId}/test2.jpg`);

    // Get photo URL to verify it exists
    expect(() => storage.getPhotoUrl(`${testAnimalId}/test2.jpg`)).not.toThrow();

    // Cleanup second file
    await storage.deletePhoto(`${testAnimalId}/test2.jpg`);
  });

  it('should handle file deletion', async () => {
    // Create a file to delete
    const testFile = new File(['delete me'], 'delete.jpg', { type: 'image/jpeg' });
    const result = await storage.uploadPhoto(testFile, `${testAnimalId}/delete.jpg`);

    // Delete the file
    await storage.deletePhoto(result.path);

    // Verify deletion
    await expect(storage.getPhotoData(result.path)).rejects.toThrow('Failed to get photo');
  });

  it('should handle non-existent files', async () => {
    const nonExistentPath = `${testAnimalId}/non-existent.jpg`;
    
    // Try to get non-existent file
    await expect(storage.getPhotoData(nonExistentPath)).rejects.toThrow('Failed to get photo');
    
    // Try to delete non-existent file
    await expect(storage.deletePhoto(nonExistentPath)).rejects.toThrow('File not found');
  });
});