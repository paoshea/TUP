import React, { useState } from 'react';
import Image from 'next/image';
import { usePhotos } from '@/hooks/usePhotos';

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
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      >
        <div className="space-y-2">
          <p className="text-gray-600">Drag and drop photos here</p>
          <p className="text-sm text-gray-500">or</p>
          <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
            Browse Files
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error.message}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((url) => (
          <div key={url} className="relative group">
            <div 
              className="aspect-square relative cursor-pointer"
              onClick={() => setSelectedPhoto(url)}
            >
              <Image
                src={url}
                alt="Animal photo"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <button
              onClick={() => handleDelete(url)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            <div className="relative aspect-square">
              <Image
                src={selectedPhoto}
                alt="Selected photo"
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white text-black rounded-full"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Uploading photos...</p>
          </div>
        </div>
      )}
    </div>
  );
}