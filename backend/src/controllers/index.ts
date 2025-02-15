import * as animal from './AnimalController';
import * as auth from './AuthController';
import * as evaluation from './EvaluationController';
import * as show from './ShowController';
import * as notification from './NotificationController';

// Individual controller exports for routes
export const animalController = animal;
export const authController = auth;
export const evaluationController = evaluation;
export const showController = show;
export const notificationController = notification;

// Combined controllers object for convenience
export const controllers = {
  // Animal endpoints
  createAnimal: animal.createAnimal,
  getAnimal: animal.getAnimal,
  updateAnimal: animal.updateAnimal,
  deleteAnimal: animal.deleteAnimal,
  getAnimals: animal.getAnimals,
  searchAnimals: animal.searchAnimals,
  getStats: animal.getStats,

  // Auth endpoints
  signUp: auth.signUp,
  signIn: auth.signIn,
  verifyToken: auth.verifyToken,
  changePassword: auth.changePassword,
  requestPasswordReset: auth.requestPasswordReset,
  resetPassword: auth.resetPassword,

  // Evaluation endpoints
  createEvaluation: evaluation.createEvaluation,
  getEvaluation: evaluation.getEvaluation,
  updateEvaluation: evaluation.updateEvaluation,
  deleteEvaluation: evaluation.deleteEvaluation,
  getAnimalEvaluations: evaluation.getAnimalEvaluations,
  getEvaluatorEvaluations: evaluation.getEvaluatorEvaluations,
  getEvaluationStats: evaluation.getEvaluationStats,

  // Show endpoints
  createShow: show.createShow,
  getShow: show.getShow,
  updateShow: show.updateShow,
  deleteShow: show.deleteShow,
  getOrganizedShows: show.getOrganizedShows,
  getUpcomingShows: show.getUpcomingShows,
  createShowEntry: show.createShowEntry,
  getShowEntries: show.getShowEntries,
  recordShowResult: show.recordShowResult,
  getShowStats: show.getShowStats,

  // Notification endpoints
  getUserNotifications: notification.getUserNotifications,
  markNotificationAsRead: notification.markNotificationAsRead,
  processPendingNotifications: notification.processPendingNotifications,
  cleanupNotifications: notification.cleanupNotifications,
  registerPushToken: notification.registerPushToken
};