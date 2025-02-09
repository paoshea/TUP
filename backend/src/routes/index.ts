import { Router } from 'express';
import authRoutes from './auth';
import animalRoutes from './animals';
import evaluationRoutes from './evaluations';
import showRoutes from './shows';
import syncRoutes from './sync';
import notificationRoutes from './notifications';
import { requestLogger } from '../middleware';

const router = Router();

// Apply request logging to all routes
router.use(requestLogger);

// Mount routes
router.use('/auth', authRoutes);
router.use('/animals', animalRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/shows', showRoutes);
router.use('/sync', syncRoutes);
router.use('/notifications', notificationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;