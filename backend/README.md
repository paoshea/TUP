# Livestock Management System Backend

A Node.js/Express backend for the Livestock Management System, providing APIs for animal management, evaluations, shows, and more.

## Features

- 🔐 JWT-based authentication
- 🐄 Animal management
- 📊 Evaluations and scoring
- 🏆 Show management
- 📁 File uploads
- 🔄 Data synchronization
- 📱 Push notifications

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
5. Update the environment variables in `.env` with your configuration

## Development

Start the development server:

```bash
npm run dev
```

The server will start on http://localhost:3000 (or the port specified in your .env file).

## API Documentation

### Authentication

- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login user
- POST `/api/auth/verify` - Verify JWT token
- POST `/api/auth/change-password` - Change password
- POST `/api/auth/password-reset/request` - Request password reset
- POST `/api/auth/password-reset` - Reset password

### Animals

- POST `/api/animals` - Create animal
- GET `/api/animals` - List animals
- GET `/api/animals/:id` - Get animal details
- PATCH `/api/animals/:id` - Update animal
- DELETE `/api/animals/:id` - Delete animal
- GET `/api/animals/search` - Search animals
- GET `/api/animals/stats` - Get animal statistics

### Evaluations

- POST `/api/evaluations/:animalId` - Create evaluation
- GET `/api/evaluations/animal/:animalId` - Get animal evaluations
- GET `/api/evaluations/evaluator` - Get evaluator's evaluations
- GET `/api/evaluations/:evaluationId` - Get evaluation details
- PATCH `/api/evaluations/:evaluationId` - Update evaluation
- DELETE `/api/evaluations/:evaluationId` - Delete evaluation
- GET `/api/evaluations/stats/:animalId` - Get evaluation statistics

### Shows

- POST `/api/shows` - Create show
- GET `/api/shows/organized` - List organized shows
- GET `/api/shows/upcoming` - List upcoming shows
- GET `/api/shows/:showId` - Get show details
- PATCH `/api/shows/:showId` - Update show
- DELETE `/api/shows/:showId` - Delete show
- POST `/api/shows/:showId/entries` - Create show entry
- GET `/api/shows/:showId/entries` - List show entries
- POST `/api/shows/entries/:entryId/results` - Record show results
- GET `/api/shows/:showId/stats` - Get show statistics

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}  // Optional additional information
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.