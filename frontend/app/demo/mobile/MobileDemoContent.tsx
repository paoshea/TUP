"use client";

import { useState } from 'react';
import { CameraComponent } from '@/components/features/shared';
import { useCamera } from '@/hooks/useCamera';
import { mockStore } from '@/lib/mock/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Image, Check, X } from 'lucide-react';

export default function MobileDemoContent() {
  const { photo, takePhoto, clearPhoto } = useCamera();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!photo) return;
    
    setIsSaving(true);
    try {
      await mockStore.savePhoto(photo);
      clearPhoto();
    } catch (error) {
      console.error('Failed to save photo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
          {photo ? (
            <img
              src={photo}
              alt="Captured photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <CameraComponent onPhotoTaken={takePhoto} />
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          {photo ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={clearPhoto}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-full"
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="icon"
              onClick={() => takePhoto()}
              className="rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        {mockStore.getPhotos().map((photo, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={photo}
              alt={`Saved photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}