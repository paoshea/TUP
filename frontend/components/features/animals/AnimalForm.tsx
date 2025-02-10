"use client";

import { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AnimalFormProps {
  initialData?: {
    name: string;
    breed: string;
    age: number;
    status: string;
    notes?: string;
    image?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function AnimalForm({ initialData, onSubmit, onCancel }: AnimalFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    breed: initialData?.breed || '',
    age: initialData?.age || 0,
    status: initialData?.status || 'Active',
    notes: initialData?.notes || '',
    image: initialData?.image || ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>Photo</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, image: '' }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Upload className="h-4 w-4" />
                Upload Photo
              </div>
            </Label>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter animal name"
            required
          />
        </div>

        <div>
          <Label htmlFor="breed">Breed</Label>
          <select
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="">Select breed</option>
            <option value="North Country Cheviot">North Country Cheviot</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            name="age"
            type="number"
            min="0"
            step="0.5"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
            placeholder="Add any additional notes..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Animal' : 'Add Animal'}
        </Button>
      </div>
    </form>
  );
}