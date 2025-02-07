export { errorHandler } from './errorHandler';
export { requestLogger } from './requestLogger';
export { authenticate } from './authenticate';

// Role-based access control middleware factory
export const requireRole = (roles: string[]) => {
  return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'You must be logged in to access this resource',
      });
    }

    // TODO: Implement role checking once roles are added to the user model
    // For now, just pass through
    next();
  };
};

// Ownership check middleware factory
export const requireOwnership = (paramName: string) => {
  return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'You must be logged in to access this resource',
      });
    }

    const resourceId = req.params[paramName];
    if (!resourceId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Resource ID parameter '${paramName}' is required`,
      });
    }

    // TODO: Implement ownership checking based on the resource type
    // For now, just pass through
    next();
  };
};