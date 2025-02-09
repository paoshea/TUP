"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreedStandard = void 0;
const mongoose_1 = require("mongoose");
const breedStandardSchema = new mongoose_1.Schema({
    breed: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    criteria: {
        physical: {
            frame: {
                heightAtWithers: {
                    maxScore: { type: Number, required: true },
                    weightage: { type: Number, required: true },
                },
                bodyLength: {
                    maxScore: { type: Number, required: true },
                    weightage: { type: Number, required: true },
                },
                chestWidth: {
                    maxScore: { type: Number, required: true },
                    weightage: { type: Number, required: true },
                },
                boneStructure: {
                    maxScore: { type: Number, required: true },
                    weightage: { type: Number, required: true },
                },
            },
            breedCharacter: {
                headProfile: {
                    maxScore: { type: Number, required: true },
                    weightage: { type: Number, required: true },
                },
                earSet: {
                    maxScore: { type: Number, required: true },
                    weightage: { type: Number, required: true },
                },
                faceMarkings: {
                    maxScore: { type: Number, required: true },
                    weightage: { type: Number, required: true },
                },
            },
        },
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
// Indexes
breedStandardSchema.index({ breed: 1, category: 1 }, { unique: true });
// Methods
breedStandardSchema.methods.calculateScore = function (measurements) {
    const scores = {};
    // Calculate frame scores
    Object.entries(this.criteria.physical.frame).forEach(([key, criteria]) => {
        const measurement = measurements[key];
        if (typeof measurement === 'number') {
            const score = Math.min((measurement / criteria.maxScore) * 10, 10);
            scores[key] = score * criteria.weightage;
        }
    });
    // Calculate breed character scores
    Object.entries(this.criteria.physical.breedCharacter).forEach(([key, criteria]) => {
        const measurement = measurements[key];
        if (typeof measurement === 'number') {
            const score = Math.min((measurement / criteria.maxScore) * 10, 10);
            scores[key] = score * criteria.weightage;
        }
    });
    return scores;
};
exports.BreedStandard = (0, mongoose_1.model)('BreedStandard', breedStandardSchema);
