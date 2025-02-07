import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthProvider } from '../context/AuthContext';
import { LivestockProvider } from '../context/LivestockContext';
import { UIProvider } from '../context/UIContext';

// Create a custom render function that wraps the component with all providers
function render(ui: React.ReactElement, options = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <LivestockProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </LivestockProvider>
    </AuthProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { render, screen, fireEvent, userEvent };