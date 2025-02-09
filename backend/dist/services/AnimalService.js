"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animalService = exports.AnimalService = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const BaseService_1 = require("./BaseService");
const apiResponse_1 = require("../utils/apiResponse");
class AnimalService extends BaseService_1.BaseService {
    constructor() {
        super(models_1.Animal);
    }
    /**
     * Create a new animal
     */
    async createAnimal(data, userId) {
        const animal = await this.create({
            ...data,
            owner: new mongoose_1.Types.ObjectId(userId),
        });
        return animal;
    }
    /**
     * Get animals owned by a user
     */
    async getUserAnimals(userId, query = {}) {
        return this.find({
            owner: new mongoose_1.Types.ObjectId(userId),
            ...query,
        });
    }
    /**
     * Get an animal by ID and verify ownership
     */
    async getAnimalById(animalId, userId) {
        const animal = await this.findById(animalId);
        if (!animal) {
            throw new apiResponse_1.ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
        }
        if (animal.owner.toString() !== userId) {
            throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'You do not have access to this animal');
        }
        return animal;
    }
    /**
     * Update an animal
     */
    async updateAnimal(animalId, userId, data) {
        const animal = await this.getAnimalById(animalId, userId);
        // Remove owner from update data for security
        const { owner, ...updateData } = data;
        const updatedAnimal = await this.update(animalId, updateData);
        if (!updatedAnimal) {
            throw new apiResponse_1.ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
        }
        return updatedAnimal;
    }
    /**
     * Delete an animal
     */
    async deleteAnimal(animalId, userId) {
        const animal = await this.getAnimalById(animalId, userId);
        const deletedAnimal = await this.delete(animalId);
        if (!deletedAnimal) {
            throw new apiResponse_1.ApiError(404, 'ANIMAL_NOT_FOUND', 'Animal not found');
        }
    }
    /**
     * Search animals by criteria
     */
    async searchAnimals(criteria) {
        const query = {};
        if (criteria.breed) {
            query.breed = criteria.breed;
        }
        if (criteria.category) {
            query.category = criteria.category;
        }
        if (criteria.region) {
            query.region = criteria.region;
        }
        if (criteria.owner) {
            query.owner = new mongoose_1.Types.ObjectId(criteria.owner);
        }
        if (criteria.minScore || criteria.maxScore) {
            query['scores.average'] = {};
            if (criteria.minScore) {
                query['scores.average'].$gte = criteria.minScore;
            }
            if (criteria.maxScore) {
                query['scores.average'].$lte = criteria.maxScore;
            }
        }
        return this.find(query);
    }
    /**
     * Get animal statistics
     */
    async getAnimalStats(userId) {
        const animals = await this.getUserAnimals(userId);
        const stats = {
            total: animals.length,
            byBreed: {},
            byCategory: {},
            averageScore: 0,
        };
        let totalScore = 0;
        let scoreCount = 0;
        animals.forEach(animal => {
            // Count by breed
            stats.byBreed[animal.breed] = (stats.byBreed[animal.breed] || 0) + 1;
            // Count by category
            stats.byCategory[animal.category] = (stats.byCategory[animal.category] || 0) + 1;
            // Calculate average score
            const scores = Object.values(animal.scores);
            if (scores.length > 0) {
                totalScore += scores.reduce((a, b) => a + b, 0) / scores.length;
                scoreCount++;
            }
        });
        stats.averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
        return stats;
    }
}
exports.AnimalService = AnimalService;
// Export singleton instance
exports.animalService = new AnimalService();
