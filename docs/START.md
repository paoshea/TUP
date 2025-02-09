# Getting Started Guide for macOS

## Quick Start
```bash
-  To build and restarted the application, 
npm run build --workspace=frontend && npm run dev --workspace=frontend
- To restart the development server 
npm run dev --workspace=frontend
# 1. Navigate to frontend and copy environment file
cd frontend
cp .env.local.example .env.local

# 2. Navigate to backend and copy environment file
cd ../backend
cp .env.example .env

# 3. Start the frontend development server
cd ../frontend
npm run dev
```

rm -rf node_modules package-lock.json frontend/node_modules frontend/package-lock.json && npm install
npm run dev --workspace=frontend

Expected output:
```
> frontend@0.1.0 dev
> next dev --turbopack

   ▲ Next.js 15.1.6 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in ~3s
```

## Important Notes

### 1. Image Configuration Warning
You may see this warning:
```
⚠ The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.
```

To fix this, update your `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-domain.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}

module.exports = nextConfig
```

### 2. Initial Compilation Times
- First compilation may take ~10s
- Subsequent page compilations are faster (~0.5-1s)
- Expected compilation sequence:
  1. Homepage (/)
  2. Animals page (/animals)
  3. Shows page (/shows)
  4. Evaluations page (/evaluations)

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- MongoDB Atlas account
- Xcode Command Line Tools

## Initial Setup

### 1. Install Command Line Tools
```bash
xcode-select --install
```

### 2. Check System Requirements
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## Project Setup

### 1. Clone and Install
```bash
# Clone repository
git clone <repository-url>
cd TUP-livestock

# Install dependencies for both frontend and backend
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Setup
```bash
# Frontend environment
cd frontend
cp .env.local.example .env.local

# Backend environment
cd ../backend
cp .env.example .env
```

## Development Workflow

### 1. Frontend Development (with Turbopack)
```bash
cd frontend

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm run start
```

### 2. Backend Development
```bash
cd backend

# Start development server with nodemon
npm run dev

# Watch TypeScript compilation
npm run watch

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm start
```

### 3. Running Both Services
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Testing

### 1. Frontend Testing
```bash
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- EvaluationForm.test.tsx
```

### 2. Backend Testing
```bash
cd backend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- AnimalController.test.ts
```

## Configuration

### 1. MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update MONGODB_URI in backend/.env

### 2. Update Environment Variables
```bash
# Backend (.env)
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Common Issues and Solutions

### 1. Port Conflicts
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :8080

# Kill process using a port
kill -9 <PID>
```

### 2. Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 3. Turbopack Issues
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev -- --no-turbo

# If issues persist, try without Turbopack
npm run dev -- --turbo=false
```

### 4. TypeScript Errors
 run the build commands for both projects. 

# Backend
Start with the backend since it's simpler (just TypeScript compilation).
```bash
cd backend
rm -rf dist
npm run build
```
# Frontend
Next, build the frontend, which uses Next.js build system.
```bash
cd frontend
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

## Development Tools

### 1. Recommended VSCode Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- MongoDB for VS Code

### 2. API Testing
```bash
# Install Postman
brew install --cask postman
```

### 3. Process Management
```bash
# Install PM2
npm install -g pm2

# Start both services
pm2 start ecosystem.config.js

# Monitor services
pm2 monit

# Stop all services
pm2 stop all
```

## Performance Optimization

### 1. Frontend Optimization
```bash
# Analyze bundle size
cd frontend
ANALYZE=true npm run build

# Run lighthouse audit
npm run lighthouse

# Check for duplicate dependencies
npm dedupe
```

### 2. Backend Optimization
```bash
# Enable compression
NODE_ENV=production npm start

# Monitor memory usage
node --inspect src/index.ts
```

## Additional Considerations

1. **File Permissions**
```bash
# Fix permission issues
chmod -R 755 .
```

2. **Network Issues**
```bash
# Check network configuration
networksetup -getinfo Wi-Fi

# Flush DNS cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

3. **Memory Issues**
```bash
# Check memory usage
top -o mem

# Clear system cache
sudo purge
```

## Deployment Checklist

1. **Pre-deployment**
- [ ] Run all tests (`npm test` in both directories)
- [ ] Check for TypeScript errors (`npm run build` in both directories)
- [ ] Verify environment variables
- [ ] Build both frontend and backend
- [ ] Test production build locally

2. **Post-deployment**
- [ ] Verify API endpoints
- [ ] Check database connections
- [ ] Verify static assets
- [ ] Test user flows
- [ ] Monitor error logs

## Support and Resources

- Project Documentation: `/docs`
- API Documentation: `/docs/API.md`
- Technical Guide: `/docs/TECH.md`
- User Guide: `/docs/USER_GUIDE.md`

For additional support, please refer to the project's issue tracker or contact the development team.