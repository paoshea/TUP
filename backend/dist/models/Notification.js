"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    type: {
        type: String,
        enum: ['evaluation', 'show', 'sync', 'system'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending',
        required: true,
    },
    sent_at: {
        type: Date,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
});
// Indexes
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ created_at: 1 });
notificationSchema.index({ sent_at: 1 });
// Methods
notificationSchema.methods.markAsSent = async function () {
    this.status = 'sent';
    this.sent_at = new Date();
    await this.save();
};
notificationSchema.methods.markAsFailed = async function () {
    this.status = 'failed';
    await this.save();
};
// Static methods
notificationSchema.statics.createEvaluationNotification = async function (userId, evaluationId, animalName) {
    return this.create({
        user: userId,
        type: 'evaluation',
        title: 'New Evaluation',
        body: `A new evaluation has been added for ${animalName}`,
        data: { evaluationId },
    });
};
notificationSchema.statics.createShowNotification = async function (userId, showId, showName, message) {
    return this.create({
        user: userId,
        type: 'show',
        title: showName,
        body: message,
        data: { showId },
    });
};
notificationSchema.statics.createSyncNotification = async function (userId, conflictId) {
    return this.create({
        user: userId,
        type: 'sync',
        title: 'Sync Conflict',
        body: 'There was a conflict during synchronization that needs your attention',
        data: { conflictId },
    });
};
notificationSchema.statics.createSystemNotification = async function (userId, title, message, data) {
    return this.create({
        user: userId,
        type: 'system',
        title,
        body: message,
        data,
    });
};
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
