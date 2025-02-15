"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export function PhotoGallery({ photos, onPhotosChange }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  const handlePhotoClick = (photo: string, index: number) => {
    setSelectedPhoto(photo);
    setPreviewIndex(index);
  };

  const handleRemovePhoto = (photoToRemove: string) => {
    const newPhotos = photos.filter(photo => photo !== photoToRemove);
    onPhotosChange(newPhotos);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setPreviewIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
      setSelectedPhoto(photos[previewIndex > 0 ? previewIndex - 1 : photos.length - 1]);
    } else {
      setPreviewIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
      setSelectedPhoto(photos[previewIndex < photos.length - 1 ? previewIndex + 1 : 0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Photo Gallery</CardTitle>
          <Button size="sm">
            <Camera className="h-4 w-4 mr-2" />
            Add Photos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <Camera className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No photos yet</p>
            <p className="text-xs text-muted-foreground">
              Upload photos to track progress
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo}
                className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
              >
                <Image
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer transition-transform group-hover:scale-105"
                  onClick={() => handlePhotoClick(photo, index)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(photo);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg p-4 max-w-4xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Photo Preview</h3>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative aspect-video">
                <Image
                  src={selectedPhoto}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">Photo {previewIndex + 1} of {photos.length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}