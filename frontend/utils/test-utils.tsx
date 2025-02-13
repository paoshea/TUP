import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  );
}

function render(ui: React.ReactElement, options: CustomRenderOptions = {}) {
  const { wrapper: Wrapper, ...restOptions } = options;

  const Providers = ({ children }: { children: React.ReactNode }) => {
    return Wrapper ? (
      <AllTheProviders>
        <Wrapper>{children}</Wrapper>
      </AllTheProviders>
    ) : (
      <AllTheProviders>{children}</AllTheProviders>
    );
  };

  return rtlRender(ui, { wrapper: Providers, ...restOptions });
}

// Re-export everything
export * from '@testing-library/react';
export { render };