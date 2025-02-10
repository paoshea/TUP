import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { optimizeImage, generateBlurPlaceholder } from '@/utils/imageOptimization';

interface CameraComponentProps {
  onCapture: (blob: Blob) => void;
  onError?: (error: Error) => void;
  className?: string;
  aspectRatio?: 'square' | '4:3' | '16:9';
  facingMode?: 'user' | 'environment';
  showPreview?: boolean;
}

export function CameraComponent({
  onCapture,
  onError,
  className,
  aspectRatio = '4:3',
  facingMode = 'environment',
  showPreview = true,
}: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Calculate aspect ratio constraints
  const getAspectRatio = useCallback(() => {
    switch (aspectRatio) {
      case 'square': return { width: { ideal: 1080 }, height: { ideal: 1080 } };
      case '4:3': return { width: { ideal: 1440 }, height: { ideal: 1080 } };
      case '16:9': return { width: { ideal: 1920 }, height: { ideal: 1080 } };
      default: return { width: { ideal: 1440 }, height: { ideal: 1080 } };
    }
  }, [aspectRatio]);

  // Initialize camera with performance optimizations
  const initializeCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          ...getAspectRatio(),
          // Add performance optimizations
          frameRate: { ideal: 30 },
          // Automatically adjust based on available bandwidth
          width: { min: 640, ideal: 1440, max: 1920 },
          height: { min: 480, ideal: 1080, max: 1920 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Enable hardware acceleration
        videoRef.current.style.transform = 'translateZ(0)';
        
        setIsActive(true);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize camera');
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, getAspectRatio, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Get image dimensions
  const getImageDimensions = useCallback((url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.src = url;
    });
  }, []);

  // Capture and optimize photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !isActive) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Flip horizontally if using front camera
    if (facingMode === 'user') {
      context.scale(-1, 1);
      context.translate(-canvas.width, 0);
    }

    context.drawImage(video, 0, 0);

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          0.85
        );
      });

      // Optimize image
      const optimizedBlob = await optimizeImage(blob);

      if (showPreview) {
        // Generate preview and blur placeholder
        const previewUrl = URL.createObjectURL(optimizedBlob);
        setPreview(previewUrl);

        const blurUrl = await generateBlurPlaceholder(optimizedBlob);
        setBlurDataUrl(blurUrl);

        // Get dimensions for next/image
        const imageDimensions = await getImageDimensions(previewUrl);
        setDimensions(imageDimensions);
      }

      onCapture(optimizedBlob);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to capture photo');
      setError(error.message);
      onError?.(error);
    }
  }, [isActive, facingMode, onCapture, onError, showPreview, getImageDimensions]);

  return (
    <div className={cn("relative", className)}>
      {/* Video preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "w-full bg-black",
          facingMode === 'user' && "scale-x-[-1]",
          aspectRatio === 'square' && "aspect-square",
          aspectRatio === '4:3' && "aspect-[4/3]",
          aspectRatio === '16:9' && "aspect-[16/9]",
          "transform-gpu", // Enable hardware acceleration
        )}
      />

      {/* Preview overlay */}
      {preview && showPreview && dimensions && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${blurDataUrl || preview})`,
            filter: blurDataUrl ? 'blur(20px)' : 'none',
          }}
        >
          <Image
            src={preview}
            alt="Preview"
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full object-cover"
            onLoadingComplete={(target) => {
              // Remove blur when full image loads
              target.parentElement!.style.backgroundImage = 'none';
            }}
            priority
          />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        {!isActive && (
          <button
            onClick={initializeCamera}
            disabled={isLoading}
            className="bg-primary text-primary-foreground rounded-full p-4 touch:p-6"
          >
            {isLoading ? 'Initializing...' : 'Start Camera'}
          </button>
        )}

        {isActive && (
          <button
            onClick={capturePhoto}
            className="bg-primary text-primary-foreground rounded-full p-4 touch:p-6"
          >
            Capture
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-destructive text-destructive-foreground p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}