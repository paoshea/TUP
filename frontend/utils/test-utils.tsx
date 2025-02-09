import React from 'react';
import { render as rtlRender } from '@testing-library/react';

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  );
}

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };

// Mock hooks
export function mockUseAI() {
  return {
    loading: false,
    error: null,
    analysis: null,
    analyzeAnimal: jest.fn(),
    getRecommendations: jest.fn(),
    compareWithHistorical: jest.fn(),
    resetAnalysis: jest.fn(),
  };
}

export function mockUsePhotos() {
  return {
    uploading: false,
    error: null,
    uploadPhoto: jest.fn(),
    deletePhoto: jest.fn(),
  };
}

export function mockUseEvaluation() {
  return {
    loading: false,
    error: null,
    evaluation: null,
    saveEvaluation: jest.fn(),
    getEvaluation: jest.fn(),
    updateEvaluation: jest.fn(),
  };
}

// Mock services
export const mockStorage = {
  uploadPhoto: jest.fn(),
  getPhotoUrl: jest.fn(),
  deletePhoto: jest.fn(),
  getPhotoData: jest.fn(),
};

export const mockAIService = {
  processMessage: jest.fn(),
};

// Mock data
export const mockAnimal = {
  id: 'test-id',
  name: 'Test Animal',
  category: 'livestock',
  breed: 'Test Breed',
  region: 'Test Region',
  scores: {
    movement: 8,
    conformation: 7,
    muscleDevelopment: 9,
    breedCharacteristics: 8
  }
};