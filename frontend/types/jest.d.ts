import '@testing-library/jest-dom';
import { CSSProperties } from 'react';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Partial<CSSProperties>): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveValue(value: string | number | string[]): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}