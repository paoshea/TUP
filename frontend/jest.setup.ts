import '@testing-library/jest-dom';
import React from 'react';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Camera: function MockCamera() { return React.createElement('div', { 'data-testid': 'camera-icon' }); },
  Upload: function MockUpload() { return React.createElement('div', { 'data-testid': 'upload-icon' }); },
  X: function MockX() { return React.createElement('div', { 'data-testid': 'x-icon' }); },
  Plus: function MockPlus() { return React.createElement('div', { 'data-testid': 'plus-icon' }); },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement('img', props);
  },
}));

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));