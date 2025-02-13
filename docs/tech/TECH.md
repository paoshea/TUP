# LiveStock Show Assistant Technical Documentation

## Tech Stack

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- Tailwind CSS 3.4.1

### Dependencies
- `lucide-react` - Icon library
- `react-dom` - React DOM renderer
- `autoprefixer` - CSS post-processor
- `postcss` - CSS transformer

### Development Tools
- ESLint 9.9.1
- TypeScript ESLint
- Vite React Plugin

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- macOS, Linux, or Windows

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd livestock-show-assistant

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Development Server

The development server runs on `http://localhost:5173` by default.

### Common Issues & Solutions

#### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache/typescript

# Verify TypeScript configuration
npx tsc --noEmit
```

## Project Structure

```
livestock-show-assistant/
├── docs/               # Documentation
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   ├── types/        # TypeScript type definitions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
├── index.html        # HTML template
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
```

## Build Process

The build process is handled by Vite:

1. TypeScript compilation
2. Asset optimization
3. CSS processing
4. Bundle generation

Build output is located in the `dist` directory.

## Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement responsive design patterns
- Follow React best practices and hooks guidelines

## Performance Optimization

- Lazy load components when possible
- Optimize images before import
- Use React.memo for expensive computations
- Implement proper key props in lists
- Avoid unnecessary re-renders

## Troubleshooting Guide

### Common Error: White Screen
1. Check console for errors
2. Verify all dependencies are installed
3. Clear browser cache
4. Restart development server

### Build Failures
1. Check TypeScript errors
2. Verify import paths
3. Check for missing dependencies
4. Review environment variables

### Development Server Issues
1. Check port availability
2. Verify Node.js version
3. Clear npm cache
4. Check for conflicting processes

## Deployment

### Production Build
```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

### Build Output Verification
1. Check `dist` directory
2. Verify asset optimization
3. Test in multiple browsers
4. Validate environment variables

## Security Considerations

- Keep dependencies updated
- Use environment variables for sensitive data
- Implement proper CORS policies
- Follow React security best practices
- Validate user input

## Support

For technical issues:
1. Check existing documentation
2. Review console errors
3. Search issue tracker
4. Contact development team

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Submit pull request
5. Wait for review