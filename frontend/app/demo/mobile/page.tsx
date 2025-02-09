'use client';

import { MobileLayout, MobilePage, MobileCard, MobileButton } from '@/components/layout/MobileLayout';
import { CameraComponent } from '@/components/CameraComponent';
import { useCamera } from '@/hooks/useCamera';
import { useState } from 'react';
import Image from 'next/image';

export default function MobileDemoPage() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const { handleCapture, isProcessing } = useCamera({
    onUpload: (url) => setPhotoUrl(url),
    onError: (error) => console.error('Camera error:', error),
  });

  // Get image dimensions when photo is loaded
  const handlePhotoLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  return (
    <MobileLayout
      header={
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">Mobile Demo</h1>
        </div>
      }
      footer={
        <div className="flex items-center justify-around w-full">
          <button className="p-2 text-sm">
            <span className="sr-only">Home</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button className="p-2 text-sm">
            <span className="sr-only">Camera</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button className="p-2 text-sm">
            <span className="sr-only">Profile</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      }
    >
      <MobilePage>
        <MobileCard>
          <h2 className="text-lg font-semibold mb-4">Camera Demo</h2>
          <div className="space-y-4">
            <CameraComponent
              onCapture={handleCapture}
              className="rounded-lg overflow-hidden"
              aspectRatio="square"
            />
            {isProcessing && (
              <div className="text-center text-sm text-muted-foreground">
                Processing photo...
              </div>
            )}
            {photoUrl && dimensions && (
              <div className="space-y-2">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={photoUrl}
                    alt="Captured photo"
                    width={dimensions.width}
                    height={dimensions.height}
                    className="object-cover"
                    onLoad={handlePhotoLoad}
                    priority
                  />
                </div>
                <MobileButton
                  onClick={() => setPhotoUrl(null)}
                  className="w-full"
                >
                  Take Another Photo
                </MobileButton>
              </div>
            )}
          </div>
        </MobileCard>

        <MobileCard>
          <h2 className="text-lg font-semibold mb-4">Responsive Elements</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                1
              </div>
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                2
              </div>
              <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
                3
              </div>
            </div>
            <div className="touch:text-lg sm:text-base">
              This text is larger on touch devices
            </div>
            <div className="h-12 touch:h-14 bg-primary/10 rounded-lg flex items-center justify-center">
              Taller on touch devices
            </div>
          </div>
        </MobileCard>
      </MobilePage>
    </MobileLayout>
  );
}