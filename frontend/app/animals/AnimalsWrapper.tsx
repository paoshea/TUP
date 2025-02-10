"use client";

import { useState } from 'react';
import { PhotoGallery } from '@/components/features/shared';
import { EvaluationForm } from '@/components/features/evaluations';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, X, Check } from 'lucide-react';
import { mockStore } from '@/lib/mock/store';
import { useCamera } from '@/hooks/useCamera';

interface AnimalsWrapperProps {
  children: React.ReactNode;
}

export default function AnimalsWrapper({ children }: AnimalsWrapperProps) {
  const [activeView, setActiveView] = useState<'list' | 'photos' | 'evaluation'>('list');
  const { photo, takePhoto, clearPhoto } = useCamera();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoSave = async () => {
    if (!photo || !selectedAnimal) return;
    
    setIsSaving(true);
    try {
      await mockStore.saveAnimalPhoto(selectedAnimal.id, photo);
      clearPhoto();
    } catch (error) {
      console.error('Failed to save photo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'photos':
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
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
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
                      onClick={handlePhotoSave}
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

            <PhotoGallery
              photos={selectedAnimal ? mockStore.getAnimalPhotos(selectedAnimal.id) : []}
              onPhotoClick={() => {}}
            />
          </div>
        );

      case 'evaluation':
        return selectedAnimal ? (
          <EvaluationForm
            animalId={selectedAnimal.id}
            onComplete={() => setActiveView('list')}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select an animal to evaluate
          </div>
        );

      default:
        return children;
    }
  };

  return (
    <div className="space-y-4">
      {renderContent()}
    </div>
  );
}