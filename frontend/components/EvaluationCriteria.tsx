"use client";

import React from 'react';
import { ClipboardCheck, AlertCircle } from 'lucide-react';

const criteria = {
  movement: [
    { name: 'Gait', description: 'Natural and fluid movement pattern', maxScore: 10 },
    { name: 'Structural Soundness', description: 'Proper leg alignment and movement', maxScore: 10 },
    { name: 'Balance', description: 'Even distribution of weight while moving', maxScore: 10 },
  ],
  conformation: [
    { name: 'Body Type', description: 'Overall body structure and proportions', maxScore: 10 },
    { name: 'Muscling', description: 'Muscle development and distribution', maxScore: 10 },
    { name: 'Skeletal Structure', description: 'Bone quality and joint alignment', maxScore: 10 },
  ],
  breedCharacteristics: [
    { name: 'Head', description: 'Breed-specific head features', maxScore: 10 },
    { name: 'Coat', description: 'Quality and characteristics of coat', maxScore: 10 },
    { name: 'Color', description: 'Standard breed coloring', maxScore: 10 },
  ]
};

export function EvaluationCriteria() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Evaluation Criteria</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AlertCircle className="h-4 w-4" />
          <span>All criteria scored out of 10 points</span>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(criteria).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium capitalize flex items-center gap-2 text-blue-600">
              <ClipboardCheck className="h-5 w-5" />
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h3>

            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <span className="text-sm text-gray-600">
                      Max Score: {item.maxScore}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Scoring Guidelines</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>9-10: Exceptional - Exceeds breed standards</li>
              <li>7-8: Above Average - Strong adherence to standards</li>
              <li>5-6: Average - Meets basic requirements</li>
              <li>3-4: Below Average - Some deficiencies</li>
              <li>1-2: Poor - Significant deficiencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}