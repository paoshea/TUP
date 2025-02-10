# Mobile Responsiveness Guide

## Overview
This guide documents the mobile-first approach and responsive design patterns implemented across TUP's components.

## Core Components

### 1. Animal Management

#### AnimalCard
```typescript
// Responsive padding and spacing
className="p-4 sm:p-6 hover:shadow-md"

// Responsive text sizing
className="text-base sm:text-lg"

// Enhanced touch targets
className="p-3 sm:p-2" // Larger on mobile
```

Features:
- Responsive text sizing
- Enhanced touch targets
- Flexible layout
- Accessible buttons
- Screen reader support

#### AnimalList
```typescript
// Mobile-friendly filters
<Sheet>
  <SheetContent side="bottom">
    <FilterControls />
  </SheetContent>
</Sheet>

// Responsive grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

Features:
- Bottom sheet filters on mobile
- Responsive grid layout
- Enhanced search experience
- Touch-friendly controls
- Improved spacing

### 2. Show Management

#### ShowCard
```typescript
// Responsive date formatting
const mobileFormat = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
};

// Responsive layout
className="flex flex-col sm:flex-row"
```

Features:
- Condensed date format on mobile
- Stacked layout on small screens
- Enhanced touch targets
- Improved readability
- Accessible actions

#### ShowList
```typescript
// Mobile-first filtering
<div className="flex flex-col sm:flex-row gap-4">
  <MobileFilters />
  <DesktopFilters />
</div>
```

Features:
- Optimized filter controls
- Responsive grid layout
- Touch-friendly sorting
- Enhanced search
- Improved spacing

### 3. Evaluation System

#### EvaluationCard
```typescript
// Responsive scores grid
className="grid grid-cols-1 sm:grid-cols-2"

// Enhanced progress bars
className="h-1.5 bg-gray-100 rounded-full"
```

Features:
- Single column layout on mobile
- Larger progress indicators
- Enhanced touch targets
- Improved readability
- Accessible controls

## Best Practices

### 1. Text Sizing
```typescript
// Base sizes for mobile, larger for desktop
text-base sm:text-lg    // Headers
text-xs sm:text-sm     // Body text
text-sm sm:text-base   // Secondary text
```

### 2. Touch Targets
```typescript
// Minimum touch target sizes
className="p-3 sm:p-2"          // Larger padding on mobile
className="h-5 w-5 sm:h-4 sm:w-4" // Larger icons on mobile
```

### 3. Layout Patterns
```typescript
// Flex direction changes
className="flex flex-col sm:flex-row"

// Grid columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### 4. Spacing
```typescript
// Consistent spacing scale
gap-2 sm:gap-4     // Small gaps
gap-4 sm:gap-6     // Medium gaps
p-4 sm:p-6         // Container padding
mb-4 sm:mb-6       // Margins
```

## Accessibility

### 1. Screen Reader Support
```typescript
// Hidden labels for icons
<span className="sr-only">Edit</span>

// Descriptive button text
<span className="sr-only">Show filters</span>
```

### 2. Focus States
```typescript
// Clear focus indicators
focus:ring-2
focus:ring-offset-2
focus:ring-primary
```

### 3. Touch Feedback
```typescript
// Visual feedback on touch
active:bg-gray-100
hover:bg-gray-50
```

## Testing Guidelines

### 1. Viewport Testing
- Test at common breakpoints:
  * Mobile: 320px - 480px
  * Tablet: 481px - 768px
  * Desktop: 769px+

### 2. Touch Testing
- Verify touch target sizes
- Test gesture interactions
- Check tap feedback
- Validate scrolling

### 3. Content Testing
- Check text truncation
- Verify image scaling
- Test long content
- Validate forms

## Implementation Checklist

### 1. Components
- [ ] Responsive layout
- [ ] Mobile-first styles
- [ ] Touch targets
- [ ] Text sizing
- [ ] Spacing

### 2. Functionality
- [ ] Touch events
- [ ] Gesture support
- [ ] Mobile navigation
- [ ] Form inputs

### 3. Accessibility
- [ ] Screen reader
- [ ] Focus states
- [ ] ARIA labels
- [ ] Color contrast

### 4. Performance
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Animation smoothness
- [ ] Load times