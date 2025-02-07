# LiveStock Show Assistant Frontend

A Next.js application for livestock show management with MongoDB integration.

## Features

- Authentication with JWT and MongoDB
- Real-time livestock data management
- Photo management with GridFS
- AI-powered analysis and recommendations
- Dark/Light theme support
- Responsive design

## Prerequisites

- Node.js 18+
- MongoDB 6.0+
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `NEXT_PUBLIC_API_URL`: API endpoint URL
- `NODE_ENV`: Environment (development/production)

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Project Structure

```
frontend/
├── app/                 # Next.js app router
├── components/         # React components
├── context/           # Context providers
├── hooks/             # Custom hooks
├── services/          # API services
├── types/             # TypeScript types
├── utils/             # Utility functions
└── __tests__/         # Test files
```

## MongoDB Integration

The application uses MongoDB for:
- User authentication
- Livestock data storage
- Photo storage (GridFS)
- Analytics and historical data

Key services:
- `api.ts`: CRUD operations
- `storage.ts`: Photo management with GridFS
- `ai.ts`: AI analysis with MongoDB aggregation

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler

## Environment Variables

Required environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/livestock
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT
