"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluation = void 0;
const mongoose_1 = require("mongoose");
const evaluationSchema = new mongoose_1.Schema({
    animal: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Animal',
        required: true,
    },
    evaluator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    scores: {
        movement: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
        conformation: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
        muscleDevelopment: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
        breedCharacteristics: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});
// Indexes
evaluationSchema.index({ animal: 1 });
evaluationSchema.index({ evaluator: 1 });
evaluationSchema.index({ createdAt: -1 });
// Virtual for average score
evaluationSchema.virtual('averageScore').get(function () {
    const scores = Object.values(this.scores);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
});
// Helper function to calculate average scores
async function updateAnimalScores(animalId) {
    const Animal = (0, mongoose_1.model)('Animal');
    const Evaluation = (0, mongoose_1.model)('Evaluation');
    // Get all evaluations for this animal
    const result = await Evaluation
        .find({ animal: animalId })
        .select('scores')
        .lean();
    // Type assertion for the query result
    const evaluations = result;
    if (evaluations.length === 0)
        return;
    // Calculate average scores
    const totalScores = evaluations.reduce((acc, curr) => {
        Object.entries(curr.scores).forEach(([key, value]) => {
            acc[key] = (acc[key] || 0) + value;
        });
        return acc;
    }, {});
    const averageScores = Object.entries(totalScores).reduce((acc, [key, value]) => {
        acc[key] = value / evaluations.length;
        return acc;
    }, {
        movement: 0,
        conformation: 0,
        muscleDevelopment: 0,
        breedCharacteristics: 0,
    });
    // Update animal scores
    await Animal.findByIdAndUpdate(animalId, {
        scores: averageScores,
    });
}
// Middleware to update animal scores after evaluation
evaluationSchema.post('save', async function (doc) {
    await updateAnimalScores(doc.animal instanceof mongoose_1.Types.ObjectId ? doc.animal : doc.animal._id);
});
exports.Evaluation = (0, mongoose_1.model)('Evaluation', evaluationSchema);
