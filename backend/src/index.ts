import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectToDatabase } from './utils/database';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authenticate } from './middleware/authenticate';

// Import routes
import { authRoutes } from './routes/auth';
import { animalRoutes } from './routes/animals';
import { evaluationRoutes } from './routes/evaluations';
import { showRoutes } from './routes/shows';
import { syncRoutes } from './routes/sync';
import { notificationRoutes } from './routes/notifications';

const app = express();

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/animals', authenticate, animalRoutes);
app.use('/api/evaluations', authenticate, evaluationRoutes);
app.use('/api/shows', authenticate, showRoutes);
app.use('/api/sync', authenticate, syncRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);

// Error handling
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.env} mode`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;