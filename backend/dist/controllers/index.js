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
exports.showController = exports.evaluationController = exports.authController = exports.animalController = void 0;
const animal = __importStar(require("./AnimalController"));
const auth = __importStar(require("./AuthController"));
const evaluation = __importStar(require("./EvaluationController"));
const show = __importStar(require("./ShowController"));
exports.animalController = {
    createAnimal: animal.createAnimal,
    getAnimals: animal.getAnimals,
    getAnimal: animal.getAnimal,
    updateAnimal: animal.updateAnimal,
    deleteAnimal: animal.deleteAnimal,
    searchAnimals: animal.searchAnimals,
    getAnimalStats: animal.getAnimalStats
};
exports.authController = {
    signUp: auth.signUp,
    signIn: auth.signIn,
    verifyToken: auth.verifyToken,
    changePassword: auth.changePassword,
    requestPasswordReset: auth.requestPasswordReset,
    resetPassword: auth.resetPassword
};
exports.evaluationController = {
    createEvaluation: evaluation.createEvaluation,
    getAnimalEvaluations: evaluation.getAnimalEvaluations,
    getEvaluatorEvaluations: evaluation.getEvaluatorEvaluations,
    getEvaluation: evaluation.getEvaluation,
    updateEvaluation: evaluation.updateEvaluation,
    deleteEvaluation: evaluation.deleteEvaluation,
    getEvaluationStats: evaluation.getEvaluationStats
};
exports.showController = {
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
