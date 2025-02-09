"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Show = void 0;
const mongoose_1 = require("mongoose");
const showSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    categories: [{
            name: {
                type: String,
                required: true,
            },
            classes: [{
                    type: String,
                    required: true,
                }],
        }],
    organizer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
// Indexes
showSchema.index({ date: 1 });
showSchema.index({ location: 1 });
showSchema.index({ organizer: 1 });
showSchema.index({ 'categories.name': 1 });
// Methods
showSchema.methods.hasClass = function (categoryName, className) {
    const category = this.categories.find((c) => c.name === categoryName);
    return category ? category.classes.includes(className) : false;
};
showSchema.methods.addCategory = function (category) {
    if (!this.categories.some((c) => c.name === category.name)) {
        this.categories.push(category);
    }
};
showSchema.methods.removeClass = function (categoryName, className) {
    const category = this.categories.find((c) => c.name === categoryName);
    if (category) {
        category.classes = category.classes.filter((c) => c !== className);
        if (category.classes.length === 0) {
            this.categories = this.categories.filter((c) => c.name !== categoryName);
        }
    }
};
exports.Show = (0, mongoose_1.model)('Show', showSchema);
