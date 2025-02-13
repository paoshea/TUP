import { render } from '@testing-library/react';
import React from 'react';

test('renders div', () => {
  const { getByText } = render(<div>Test</div>);
  expect(getByText('Test')).toBeInTheDocument();
});