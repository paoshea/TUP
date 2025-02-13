import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Basic React Test', () => {
  it('renders a div', () => {
    render(<div>Test Content</div>);
    const element = screen.getByText('Test Content');
    expect(element).toBeInTheDocument();
  });
});