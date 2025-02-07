"use client";

import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import type { Animal } from '../types';

interface EvaluationFormProps {
  onSave: (data: Partial<Animal>) => void;
}

export function EvaluationForm({ onSave }: EvaluationFormProps) {
  const [formData, setFormData] = useState<Partial<Animal>>({
    scores: {
      movement: 0,
      conformation: 0,
      muscleDevelopment: 0,
      breedCharacteristics: 0,
    },
    notes: '',
    images: [],
  });

  const handleScoreChange = (category: keyof typeof formData.scores) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(10, Math.max(0, parseInt(e.target.value) || 0));
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores!,
        [category]: value
      }
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Evaluation Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scores */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Scores</h3>
          
          {Object.entries(formData.scores!).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={score}
                  onChange={handleScoreChange(category as keyof typeof formData.scores)}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-8 text-center font-medium">{score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={formData.notes}
            onChange={handleNotesChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add evaluation notes..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <Camera className="h-5 w-5" />
            Add Photos
          </button>
          {formData.images && formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={image} alt={`Evaluation ${index + 1}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-5 w-5" />
          Save Evaluation
        </button>
      </form>
    </div>
  );
}