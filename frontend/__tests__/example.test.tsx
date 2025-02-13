import { render, screen } from '@testing-library/react';
import LivestockSelector from '../src/components/LivestockSelector';
import React from 'react';

describe('LivestockSelector', () => {
  test('renders LivestockSelector component', () => {
    render(<LivestockSelector />);
    const headingElement = screen.getByText(/Select Livestock/i);
    expect(headingElement).toBeInTheDocument();
  });
});