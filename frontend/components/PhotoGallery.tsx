import React, { useState } from 'react';
import Image from 'next/image';
import { usePhotos } from '@/hooks/usePhotos';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { cn } from '@/lib/utils';

interface PhotoGalleryProps {
  animalId: string;
  photos: string[];
  onPhotosChange?: (photos: string[]) => void;
}

export function PhotoGallery({ animalId, photos, onPhotosChange }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { uploadPhoto, deletePhoto, uploading, error } = usePhotos(animalId);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(async file => {
        const url = await uploadPhoto(file);
        return url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedPhotos = [...photos, ...newUrls];
      onPhotosChange?.(updatedPhotos);
    } catch (err) {
      console.error('Failed to upload photos:', err);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const uploadPromises = Array.from(files).map(async file => {
        const url = await uploadPhoto(file);
        return url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedPhotos = [...photos, ...newUrls];
      onPhotosChange?.(updatedPhotos);
    } catch (err) {
      console.error('Failed to upload photos:', err);
    }
  };

  const handleDelete = async (url: string) => {
    try {
      await deletePhoto(url);
      const updatedPhotos = photos.filter(p => p !== url);
      onPhotosChange?.(updatedPhotos);
      if (selectedPhoto === url) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              'flex flex-col items-center justify-center gap-4 p-8 text-center',
              'border-2 border-dashed border-muted rounded-lg',
              'transition-colors duration-200',
              'hover:border-primary/50'
            )}
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Drag and drop photos here</p>
              <p className="text-xs text-muted-foreground">or</p>
              <Button variant="secondary" asChild>
                <label className="cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((url) => (
          <div key={url} className="relative group">
            <div 
              className="aspect-square relative cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setSelectedPhoto(url)}
            >
              <Image
                src={url}
                alt="Animal photo"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(url)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Delete photo</span>
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-square">
            {selectedPhoto && (
              <Image
                src={selectedPhoto}
                alt="Selected photo"
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {uploading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-2 bg-background p-4 rounded-lg shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-sm font-medium">Uploading photos...</p>
          </div>
        </div>
      )}
    </div>
  );
}