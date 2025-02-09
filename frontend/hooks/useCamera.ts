import { useState, useCallback } from 'react';
import { optimizeImage, generateBlurPlaceholder } from '@/utils/imageOptimization';

interface UseCameraOptions {
  onUpload?: (url: string) => void;
  onError?: (error: Error) => void;
  maxSize?: number; // in bytes
  quality?: number; // 0 to 1
  generateBlur?: boolean; // whether to generate blur placeholder
}

interface UploadResult {
  url: string;
  blurDataUrl?: string;
  width: number;
  height: number;
}

export function useCamera({
  onUpload,
  onError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  quality = 0.85,
  generateBlur = true,
}: UseCameraOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  // Handle photo capture with optimizations
  const handleCapture = useCallback(async (blob: Blob) => {
    try {
      setIsProcessing(true);
      setProgress(0);

      // Step 1: Optimize image
      setProgress(10);
      const optimizedBlob = await optimizeImage(blob, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality,
      });

      // Check size after optimization
      if (optimizedBlob.size > maxSize) {
        throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      }

      setProgress(30);

      // Step 2: Generate blur placeholder if needed
      let blurDataUrl: string | undefined;
      if (generateBlur) {
        blurDataUrl = await generateBlurPlaceholder(optimizedBlob);
      }

      setProgress(50);

      // Step 3: Create form data with metadata
      const formData = new FormData();
      formData.append('file', optimizedBlob, `photo-${Date.now()}.jpg`);
      
      if (blurDataUrl) {
        formData.append('blurDataUrl', blurDataUrl);
      }

      // Get image dimensions for metadata
      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(optimizedBlob);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve({ width: img.width, height: img.height });
        };
      });

      formData.append('metadata', JSON.stringify(dimensions));

      setProgress(70);

      // Step 4: Upload to server with progress tracking
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      setProgress(90);

      const result: UploadResult = await response.json();

      // Step 5: Call onUpload callback with complete result
      onUpload?.(result.url);

      setProgress(100);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to process photo');
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [maxSize, quality, generateBlur, onUpload, onError]);

  // Create an optimized preview for display
  const createPreview = useCallback(async (blob: Blob): Promise<{
    previewUrl: string;
    blurDataUrl?: string;
  }> => {
    // Optimize for preview
    const optimizedBlob = await optimizeImage(blob, {
      maxWidth: 800, // Smaller size for preview
      maxHeight: 800,
      quality: 0.6,
    });

    const previewUrl = URL.createObjectURL(optimizedBlob);
    
    let blurDataUrl: string | undefined;
    if (generateBlur) {
      blurDataUrl = await generateBlurPlaceholder(optimizedBlob);
    }

    return { previewUrl, blurDataUrl };
  }, [generateBlur]);

  return {
    handleCapture,
    createPreview,
    isProcessing,
    progress,
  };
}

// Export types
export type { UseCameraOptions, UploadResult };