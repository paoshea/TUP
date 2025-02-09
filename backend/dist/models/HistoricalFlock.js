"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalFlock = void 0;
const mongoose_1 = require("mongoose");
const historicalFlockSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    established: {
        type: Number,
        required: true,
    },
    achievements: [{
            type: String,
        }],
    notable_traits: {
        type: String,
    },
    show_performance: {
        type: Number,
        min: 0,
        max: 100,
    },
    regions: [{
            type: String,
            required: true,
        }],
    key_metrics: {
        movement: {
            type: Number,
            min: 0,
            max: 10,
        },
        conformationScore: {
            type: Number,
            min: 0,
            max: 10,
        },
        muscleDevelopment: {
            type: Number,
            min: 0,
            max: 10,
        },
        breedCharacteristics: {
            type: Number,
            min: 0,
            max: 10,
        },
        breedingSuccess: {
            type: Number,
            min: 0,
            max: 100,
        },
        woolQuality: {
            type: Number,
            min: 0,
            max: 100,
        },
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
});
// Indexes
historicalFlockSchema.index({ breed: 1 });
historicalFlockSchema.index({ regions: 1 });
historicalFlockSchema.index({ established: 1 });
historicalFlockSchema.index({ show_performance: -1 });
// Virtual for average score
historicalFlockSchema.virtual('averageScore').get(function () {
    const scores = [
        this.key_metrics.movement,
        this.key_metrics.conformationScore,
        this.key_metrics.muscleDevelopment,
        this.key_metrics.breedCharacteristics,
    ].filter((score) => typeof score === 'number');
    if (scores.length === 0)
        return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
});
exports.HistoricalFlock = (0, mongoose_1.model)('HistoricalFlock', historicalFlockSchema);
