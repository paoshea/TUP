import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LivestockSelector from '../src/components/LivestockSelector';

test('renders LivestockSelector component', () => {
  render(<LivestockSelector />);
  const linkElement = screen.getByText(/Select Livestock/i);
  expect(linkElement).toBeInTheDocument();
});