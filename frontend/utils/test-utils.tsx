import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

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

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

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

export function render(ui: React.ReactElement, options: CustomRenderOptions = {}) {
  const { wrapper: Wrapper, ...restOptions } = options;

  function CustomWrapper({ children }: { children: React.ReactNode }) {
    return Wrapper ? (
      <AllTheProviders>
        <Wrapper>{children}</Wrapper>
      </AllTheProviders>
    ) : (
      <AllTheProviders>{children}</AllTheProviders>
    );
  }

  const result = rtlRender(ui, {
    ...restOptions,
    wrapper: CustomWrapper,
  });

  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) => {
      result.rerender(
        <CustomWrapper>{rerenderUi}</CustomWrapper>
      );
    },
  };
}

// Re-export everything
export * from '@testing-library/react';

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
    getRecommendations: jest.fn().mockResolvedValue(['Test recommendation']),
    compareWithHistorical: jest.fn().mockResolvedValue({
      improvements: ['Test improvement'],
      trends: { 'Test Metric': 5 },
      predictions: ['Test prediction']
    }),
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