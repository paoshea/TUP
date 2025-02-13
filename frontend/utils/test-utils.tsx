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