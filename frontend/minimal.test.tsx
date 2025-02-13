import React from 'react';
import { render } from '@testing-library/react';

test('renders', () => {
  const { container } = render(<div>test</div>);
  expect(container).toBeInTheDocument();
});