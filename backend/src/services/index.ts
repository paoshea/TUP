export { authService } from './AuthService';
export { animalService } from './AnimalService';
export { evaluationService } from './EvaluationService';
export { showService } from './ShowService';

// Export service types
export type { IShow } from '../models/Show';
export type { IShowEntry } from '../models/ShowEntry';
export type { IShowResult } from '../models/ShowResult';
export type { IAnimal } from '../models/Animal';
export type { IEvaluation } from '../models/Evaluation';
export type { IProfile } from '../models/Profile';

// Export base service for extension
export { BaseService } from './BaseService';