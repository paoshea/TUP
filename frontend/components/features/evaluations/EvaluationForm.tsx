"use client";

import { useState } from 'react';
import { Camera, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface EvaluationFormProps {
  initialData?: {
    animalId: string;
    scores: {
      movement: number;
      conformation: number;
      muscleDevelopment: number;
      breedCharacteristics: number;
    };
    notes: string;
    images: string[];
  };
  animals: Array<{ id: string; name: string }>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function EvaluationForm({ initialData, animals, onSubmit, onCancel }: EvaluationFormProps) {
  const [formData, setFormData] = useState({
    animalId: initialData?.animalId || '',
    scores: {
      movement: initialData?.scores.movement || 7,
      conformation: initialData?.scores.conformation || 7,
      muscleDevelopment: initialData?.scores.muscleDevelopment || 7,
      breedCharacteristics: initialData?.scores.breedCharacteristics || 7
    },
    notes: initialData?.notes || '',
    images: initialData?.images || []
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(formData.images);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScoreChange = (category: keyof typeof formData.scores, value: number) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, imageFiles });
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7.5) return 'Very Good';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Animal Selection */}
      <div>
        <Label htmlFor="animalId">Animal</Label>
        <select
          id="animalId"
          name="animalId"
          value={formData.animalId}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 p-2"
          required
        >
          <option value="">Select animal</option>
          {animals.map(animal => (
            <option key={animal.id} value={animal.id}>
              {animal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scores Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Scores</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Movement</Label>
              <span className="text-sm font-medium">
                {formData.scores.movement.toFixed(1)} - {getScoreLabel(formData.scores.movement)}
              </span>
            </div>
            <Slider
              value={[formData.scores.movement]}
              onValueChange={([value]) => handleScoreChange('movement', value)}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Conformation</Label>
              <span className="text-sm font-medium">
                {formData.scores.conformation.toFixed(1)} - {getScoreLabel(formData.scores.conformation)}
              </span>
            </div>
            <Slider
              value={[formData.scores.conformation]}
              onValueChange={([value]) => handleScoreChange('conformation', value)}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Muscle Development</Label>
              <span className="text-sm font-medium">
                {formData.scores.muscleDevelopment.toFixed(1)} - {getScoreLabel(formData.scores.muscleDevelopment)}
              </span>
            </div>
            <Slider
              value={[formData.scores.muscleDevelopment]}
              onValueChange={([value]) => handleScoreChange('muscleDevelopment', value)}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Breed Characteristics</Label>
              <span className="text-sm font-medium">
                {formData.scores.breedCharacteristics.toFixed(1)} - {getScoreLabel(formData.scores.breedCharacteristics)}
              </span>
            </div>
            <Slider
              value={[formData.scores.breedCharacteristics]}
              onValueChange={([value]) => handleScoreChange('breedCharacteristics', value)}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div>
        <Label>Photos</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
              multiple
            />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Plus className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">Add Photos</span>
              </div>
            </Label>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
          placeholder="Add evaluation notes..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Evaluation' : 'Save Evaluation'}
        </Button>
      </div>
    </form>
  );
}