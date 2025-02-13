import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Basic Test', () => {
  it('renders text', () => {
    render(<div>Hello World</div>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});