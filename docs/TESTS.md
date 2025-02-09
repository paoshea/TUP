# Testing Guide

This document provides a comprehensive guide to the testing setup and patterns used in the TUP Livestock project.

## Test Setup

### Test Utilities (`utils/test-utils.tsx`)

We use a custom test utilities file that provides:

1. **Custom Render Function**: A wrapper around React Testing Library's render function that includes:
   - Mock UI Context
   - Mock Livestock Context
   - Test wrapper div for easier querying
   - Support for custom wrappers and options

2. **Mock Data**: Common mock data used across tests:
   - Mock animals
   - Mock evaluations
   - Mock scores

3. **Mock Hooks**: Pre-configured mock implementations of our custom hooks:
   - `mockUseAI()`: Mock AI analysis functionality
   - `mockUsePhotos()`: Mock photo upload/management
   - `mockUseEvaluation()`: Mock evaluation handling

4. **Mock Services**: Mock implementations of external services:
   - Storage service for photo management
   - AI service for analysis

## Test Types

### Unit Tests

Located in `__tests__/components` and `__tests__/hooks`, these test individual components and hooks in isolation.

#### Component Tests
- Test rendering
- Test user interactions
- Test state changes
- Test prop changes
- Test error states

Example (`EvaluationForm.test.tsx`):
```typescript
it('renders all score categories', () => {
  render(<EvaluationForm onSave={mockSave} initialData={mockData} />);
  expect(screen.getByText('Movement')).toBeInTheDocument();
  // ... more expectations
});
```

#### Hook Tests
- Test initial state
- Test state updates
- Test async operations
- Test error handling

Example (`usePhotos.test.ts`):
```typescript
it('handles photo upload successfully', async () => {
  const { result } = renderHook(() => usePhotos(mockAnimalId));
  await act(async () => {
    await result.current.uploadPhoto(mockFile);
  });
  expect(result.current.uploading).toBe(false);
  // ... more expectations
});
```

### Integration Tests

Located in `__tests__/integration`, these test how multiple components or services work together.

Example (`evaluation.test.tsx`):
```typescript
it('completes full evaluation process', async () => {
  render(
    <>
      <FlockAnalyzer animals={[mockAnimal]} />
      <EvaluationForm onSave={mockSave} initialData={mockData} />
    </>
  );
  // Test the full flow
});
```

## Test Patterns

### Mock Initialization

We use factory functions to create mocks, ensuring proper initialization:

```typescript
// Create mock API
const mockApi = {
  animals: {
    get: jest.fn(),
    create: jest.fn(),
    // ...
  }
};

// Mock the service
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: mockApi
}));
```

### Async Testing

We follow these patterns for testing async operations:

1. Use `act` for state updates:
```typescript
await act(async () => {
  await result.current.someAsyncOperation();
});
```

2. Use `waitFor` for assertions that may take time:
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### Error Handling

We test both success and error paths:

```typescript
it('handles error state', async () => {
  const error = new Error('Test error');
  mockApi.someMethod.mockRejectedValueOnce(error);
  
  // Perform action that should fail
  // Assert error state
});
```

## Running Tests

### Basic Commands

- Run all tests:
```bash
npm test
```

- Run tests with watch mode:
```bash
npm test -- --watch
```

- Run specific test file:
```bash
npm test -- path/to/test.ts
```

### Transform Ignore Patterns

For packages that need transformation (like lucide-react):
```bash
npm test -- "--transformIgnorePatterns=node_modules/(?!lucide-react)/"

cd frontend && npm test -- "--transformIgnorePatterns=node_modules/(?"'!'"lucide-react)/"

```

## Debugging Tests

1. Use `console.log` in tests (removed in production)
2. Use the `debug()` utility from React Testing Library:
```typescript
const { debug } = render(<Component />);
debug(); // Prints the current DOM state
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clear Descriptions**: Use descriptive test names
3. **Setup/Teardown**: Use `beforeEach`/`afterEach` for common setup
4. **Mock Reset**: Clear mocks between tests
5. **Error Cases**: Always test error scenarios
6. **Async Handling**: Always use `act` and `waitFor` appropriately
7. **Type Safety**: Leverage TypeScript for better test reliability

## Common Issues and Solutions

1. **Mock Timing Issues**:
   - Use factory functions for mock creation
   - Initialize mocks before they're used

2. **Async Test Failures**:
   - Wrap state updates in `act`
   - Use `waitFor` for assertions that depend on async operations

3. **Component Re-renders**:
   - Use `rerender` from the custom render function
   - Ensure proper cleanup in `beforeEach`