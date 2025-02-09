"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowResult = void 0;
const mongoose_1 = require("mongoose");
const showResultSchema = new mongoose_1.Schema({
    entry: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ShowEntry',
        required: true,
    },
    placement: {
        type: Number,
        min: 1,
    },
    points: {
        type: Number,
        min: 0,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
});
// Indexes
showResultSchema.index({ entry: 1 });
showResultSchema.index({ placement: 1 });
showResultSchema.index({ points: -1 });
// Middleware to ensure only one result per entry
showResultSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existingResult = await (0, mongoose_1.model)('ShowResult').findOne({ entry: this.entry });
        if (existingResult) {
            next(new Error('Entry already has a result'));
            return;
        }
    }
    next();
});
// Methods
showResultSchema.methods.getEntry = async function () {
    return (0, mongoose_1.model)('ShowEntry').findById(this.entry).populate(['animal', 'owner']);
};
exports.ShowResult = (0, mongoose_1.model)('ShowResult', showResultSchema);
