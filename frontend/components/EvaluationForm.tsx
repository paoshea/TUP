import React, { useState } from 'react';
import Image from 'next/image';
import { usePhotos } from '@/hooks/usePhotos';
import type { Animal } from '@/types';

interface EvaluationFormProps {
  onSave: (data: Partial<Animal>) => Promise<void>;
  initialData?: Partial<Animal>;
}

export function EvaluationForm({ onSave, initialData }: EvaluationFormProps) {
  const [scores, setScores] = useState({
    movement: initialData?.scores?.movement ?? 0,
    conformation: initialData?.scores?.conformation ?? 0,
    muscleDevelopment: initialData?.scores?.muscleDevelopment ?? 0,
    breedCharacteristics: initialData?.scores?.breedCharacteristics ?? 0,
  });
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const { uploadPhoto, deletePhoto, uploading, error } = usePhotos(initialData?.id ?? 'temp');

  const handleScoreChange = (category: keyof typeof scores, value: string) => {
    const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 10);
    setScores(prev => ({ ...prev, [category]: numValue }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      const uploadPromises = Array.from(files).map(async file => {
        const url = await uploadPhoto(file);
        return url;
      });

      const newUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...newUrls]);
    } catch (err) {
      console.error('Failed to upload photos:', err);
    }
  };

  const handlePhotoDelete = async (url: string) => {
    try {
      await deletePhoto(url);
      setImages(prev => prev.filter(i => i !== url));
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      scores,
      notes,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(scores).map(([category, value]) => (
          <div key={category} className="space-y-2">
            <label htmlFor={category} className="block text-sm font-medium">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="number"
              id={category}
              value={value}
              onChange={(e) => handleScoreChange(category as keyof typeof scores, e.target.value)}
              min="0"
              max="10"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add evaluation notes..."
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Photos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <div className="aspect-square relative">
                <Image
                  src={url}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <button
                type="button"
                onClick={() => handlePhotoDelete(url)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
            <span className="text-sm text-gray-600">Add Photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              aria-label="Upload photos"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Save Evaluation'}
      </button>
    </form>
  );
}