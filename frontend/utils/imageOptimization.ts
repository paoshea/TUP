interface ImageDimensions {
  width: number;
  height: number;
}

interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Get image dimensions while maintaining aspect ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): ImageDimensions {
  let width = originalWidth;
  let height = originalHeight;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  return { width, height };
}

/**
 * Optimize image blob
 */
export async function optimizeImage(
  blob: Blob,
  options: OptimizeImageOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      const { width, height } = calculateDimensions(
        img.width,
        img.height,
        maxWidth,
        maxHeight
      );

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Apply smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (optimizedBlob) => {
          if (optimizedBlob) {
            resolve(optimizedBlob);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
  });
}

/**
 * Create image preview URL
 */
export async function createPreviewUrl(
  blob: Blob,
  maxSize: number = 400
): Promise<string> {
  const optimizedBlob = await optimizeImage(blob, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality: 0.6,
  });

  return URL.createObjectURL(optimizedBlob);
}

/**
 * Load image with lazy loading and blur placeholder
 */
export function getImageProps(src: string, width: number, height: number) {
  return {
    src,
    width,
    height,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  };
}

/**
 * Generate blur placeholder data URL
 */
export async function generateBlurPlaceholder(
  blob: Blob
): Promise<string> {
  const optimizedBlob = await optimizeImage(blob, {
    maxWidth: 10,
    maxHeight: 10,
    quality: 0.3,
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to create blur placeholder'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(optimizedBlob);
  });
}