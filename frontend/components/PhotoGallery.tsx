"use client";

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, ZoomIn } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  notes: string;
  date: string;
}

export function PhotoGallery() {
  const [photos] = useState<Photo[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80',
      notes: 'Strong breed characteristics, excellent confirmation',
      date: '2025-03-15',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
      notes: 'Good muscle development, balanced frame',
      date: '2025-03-14',
    }
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Photo Gallery</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Camera className="h-5 w-5" />
          Add Photos
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              src={photo.url}
              alt={photo.notes}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
              <p className="text-white text-sm truncate">{photo.notes}</p>
              <p className="text-gray-300 text-xs">{new Date(photo.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Photo Details</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.notes}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Taken
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedPhoto.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <p className="text-gray-900">{selectedPhoto.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No photos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding some photos.
          </p>
        </div>
      )}
    </div>
  );
}