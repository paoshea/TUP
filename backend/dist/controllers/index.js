"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllers = exports.notificationController = exports.showController = exports.evaluationController = exports.authController = exports.animalController = void 0;
const animal = __importStar(require("./AnimalController"));
const auth = __importStar(require("./AuthController"));
const evaluation = __importStar(require("./EvaluationController"));
const show = __importStar(require("./ShowController"));
const notification = __importStar(require("./NotificationController"));
// Individual controller exports for routes
exports.animalController = animal;
exports.authController = auth;
exports.evaluationController = evaluation;
exports.showController = show;
exports.notificationController = notification;
// Combined controllers object for convenience
exports.controllers = {
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
