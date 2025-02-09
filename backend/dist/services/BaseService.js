"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const apiResponse_1 = require("../utils/apiResponse");
class BaseService {
    constructor(model) {
        this.model = model;
    }
    /**
     * Create a new document
     */
    async create(data) {
        try {
            const doc = new this.model(data);
            return await doc.save();
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Find a document by ID
     */
    async findById(id) {
        try {
            const doc = await this.model.findById(id).exec();
            return doc;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Find documents with pagination
     */
    async findAll(options = {}) {
        try {
            const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', ...filters } = options;
            const skip = (page - 1) * limit;
            const sortOrder = order === 'desc' ? -1 : 1;
            const sortOptions = { [sort]: sortOrder };
            const [docs, total] = await Promise.all([
                this.model
                    .find(filters)
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.model.countDocuments(filters),
            ]);
            return {
                items: docs,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Update a document by ID
     */
    async update(id, data) {
        try {
            const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
            return doc;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Delete a document by ID
     */
    async delete(id) {
        try {
            const doc = await this.model.findByIdAndDelete(id).exec();
            return doc;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Find one document by filter
     */
    async findOne(filter) {
        try {
            const doc = await this.model.findOne(filter).exec();
            return doc;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Find documents by filter
     */
    async find(filter, options = {}) {
        try {
            const docs = await this.model.find(filter, null, options).exec();
            return docs;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Count documents by filter
     */
    async count(filter = {}) {
        try {
            const count = await this.model.countDocuments(filter);
            return count;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Check if a document exists
     */
    async exists(filter) {
        try {
            const exists = await this.model.exists(filter);
            return !!exists;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Handle common database errors
     */
    handleError(error) {
        if (error.name === 'ValidationError') {
            throw new apiResponse_1.ApiError(400, 'VALIDATION_ERROR', error.message, error.errors);
        }
        if (error.name === 'CastError') {
            throw new apiResponse_1.ApiError(400, 'INVALID_ID', `Invalid ${error.path}: ${error.value}`);
        }
        if (error.code === 11000) {
            throw new apiResponse_1.ApiError(409, 'DUPLICATE_ENTRY', 'Duplicate entry found');
        }
        throw error;
    }
}
exports.BaseService = BaseService;
