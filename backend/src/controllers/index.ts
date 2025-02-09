import * as animal from './AnimalController';
import * as auth from './AuthController';
import * as evaluation from './EvaluationController';
import * as show from './ShowController';

export const animalController = {
  createAnimal: animal.createAnimal,
  getAnimals: animal.getAnimals,
  getAnimal: animal.getAnimal,
  updateAnimal: animal.updateAnimal,
  deleteAnimal: animal.deleteAnimal,
  searchAnimals: animal.searchAnimals,
  getAnimalStats: animal.getAnimalStats
};

export const authController = {
  signUp: auth.signUp,
  signIn: auth.signIn,
  verifyToken: auth.verifyToken,
  changePassword: auth.changePassword,
  requestPasswordReset: auth.requestPasswordReset,
  resetPassword: auth.resetPassword
};

export const evaluationController = {
  createEvaluation: evaluation.createEvaluation,
  getAnimalEvaluations: evaluation.getAnimalEvaluations,
  getEvaluatorEvaluations: evaluation.getEvaluatorEvaluations,
  getEvaluation: evaluation.getEvaluation,
  updateEvaluation: evaluation.updateEvaluation,
  deleteEvaluation: evaluation.deleteEvaluation,
  getEvaluationStats: evaluation.getEvaluationStats
};

export const showController = {
  createShow: show.createShow,
  getOrganizedShows: show.getOrganizedShows,
  getUpcomingShows: show.getUpcomingShows,
  getShow: show.getShow,
  updateShow: show.updateShow,
  deleteShow: show.deleteShow,
  createShowEntry: show.createShowEntry,
  getShowEntries: show.getShowEntries,
  recordShowResult: show.recordShowResult,
  getShowStats: show.getShowStats
};