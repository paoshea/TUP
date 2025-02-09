import React from 'react';
import { render as rtlRender } from '@testing-library/react';

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

// Create mock contexts
const MockUIContext = React.createContext({
  toast: jest.fn(),
  setLoading: jest.fn(),
});

const MockLivestockContext = React.createContext({
  animals: [mockAnimal],
  refreshAnimals: jest.fn(),
});

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <MockUIContext.Provider value={{ toast: jest.fn(), setLoading: jest.fn() }}>
      <MockLivestockContext.Provider value={{ animals: [mockAnimal], refreshAnimals: jest.fn() }}>
        <div data-testid="test-wrapper">
          {children}
        </div>
      </MockLivestockContext.Provider>
    </MockUIContext.Provider>
  );
}

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render };

// Mock hooks
export function mockUseAI() {
  return {
    loading: false,
    error: null as Error | null,
    analysis: null,
    analyzeAnimal: jest.fn().mockResolvedValue({
      insights: ['Test insight'],
      recommendations: ['Test recommendation'],
      confidence: 85
    }),
    getRecommendations: jest.fn(),
    compareWithHistorical: jest.fn(),
    resetAnalysis: jest.fn(),
  };
}

export function mockUsePhotos() {
  return {
    uploading: false,
    error: null as Error | null,
    uploadPhoto: jest.fn().mockResolvedValue('test-url'),
    deletePhoto: jest.fn().mockResolvedValue(undefined),
  };
}

export function mockUseEvaluation() {
  return {
    loading: false,
    error: null as Error | null,
    evaluation: null,
    fetchEvaluation: jest.fn().mockResolvedValue(mockAnimal),
    saveEvaluation: jest.fn().mockResolvedValue({ id: 'test-eval-id' }),
  };
}

// Mock services
export const mockStorage = {
  uploadPhoto: jest.fn().mockResolvedValue('test-url'),
  getPhotoUrl: jest.fn().mockReturnValue('test-url'),
  deletePhoto: jest.fn().mockResolvedValue(undefined),
  getPhotoData: jest.fn().mockResolvedValue({ url: 'test-url', metadata: {} }),
};

export const mockAIService = {
  processMessage: jest.fn().mockResolvedValue({ response: 'test response' }),
};