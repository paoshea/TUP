"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const mongoose_1 = require("mongoose");
const animalSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    scores: {
        movement: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        conformation: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        muscleDevelopment: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        breedCharacteristics: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
    },
    notes: {
        type: String,
    },
    images: [{
            type: String,
        }],
}, {
    timestamps: true,
});
// Indexes
animalSchema.index({ owner: 1 });
animalSchema.index({ breed: 1 });
animalSchema.index({ region: 1 });
animalSchema.index({ category: 1 });
// Virtual for average score
animalSchema.virtual('averageScore').get(function () {
    const scores = Object.values(this.scores);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
});
// Methods
animalSchema.methods.isOwnedBy = function (userId) {
    return this.owner.toString() === userId.toString();
};
exports.Animal = (0, mongoose_1.model)('Animal', animalSchema);
