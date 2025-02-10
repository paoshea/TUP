"use client";

import { useState } from 'react';
import { Calendar, MapPin, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShowFormProps {
  initialData?: {
    name: string;
    date: string;
    location: string;
    description?: string;
    categories: string[];
    entryFee?: number;
    maxEntries?: number;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ShowForm({ initialData, onSubmit, onCancel }: ShowFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    date: initialData?.date || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    categories: initialData?.categories || [],
    entryFee: initialData?.entryFee || 0,
    maxEntries: initialData?.maxEntries || 0
  });

  const [newCategory, setNewCategory] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Show Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter show name"
            required
          />
        </div>

        <div>
          <Label htmlFor="date">Show Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter show location"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
            placeholder="Add show description..."
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <Label>Categories</Label>
        <div className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add a category"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
            >
              <span>{category}</span>
              <button
                type="button"
                onClick={() => handleRemoveCategory(index)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Entry Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="entryFee">Entry Fee (£)</Label>
          <Input
            id="entryFee"
            name="entryFee"
            type="number"
            min="0"
            step="0.01"
            value={formData.entryFee}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="maxEntries">Maximum Entries</Label>
          <Input
            id="maxEntries"
            name="maxEntries"
            type="number"
            min="0"
            value={formData.maxEntries}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Show' : 'Create Show'}
        </Button>
      </div>
    </form>
  );
}