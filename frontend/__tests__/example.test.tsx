import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LivestockSelector from '../src/components/LivestockSelector';
import { type FC } from 'react';

describe('LivestockSelector', () => {
  it('renders LivestockSelector component', () => {
    render(<LivestockSelector />);
    const heading = screen.getByText(/Select Livestock/i);
    expect(heading).toBeInTheDocument();
  });
});