"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showService = exports.ShowService = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
const BaseService_1 = require("./BaseService");
const apiResponse_1 = require("../utils/apiResponse");
const AnimalService_1 = require("./AnimalService");
class ShowService extends BaseService_1.BaseService {
    constructor() {
        super(models_1.Show);
    }
    /**
     * Create a new show
     */
    async createShow(data, organizerId) {
        const show = await this.create({
            ...data,
            organizer: new mongoose_1.Types.ObjectId(organizerId),
        });
        return show;
    }
    /**
     * Get shows organized by a user
     */
    async getOrganizedShows(organizerId) {
        return this.find({
            organizer: new mongoose_1.Types.ObjectId(organizerId),
        });
    }
    /**
     * Get upcoming shows
     */
    async getUpcomingShows() {
        return this.find({
            date: { $gte: new Date() },
        }, {
            sort: { date: 1 },
        });
    }
    /**
     * Get a show by ID and verify access
     */
    async getShowById(showId, userId, isAdmin = false) {
        const show = await this.findById(showId);
        if (!show) {
            throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
        }
        // Check access - allow if user is admin or organizer
        if (!isAdmin && show.organizer.toString() !== userId) {
            throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'You do not have access to this show');
        }
        return show;
    }
    /**
     * Update a show
     */
    async updateShow(showId, userId, data, isAdmin = false) {
        const show = await this.getShowById(showId, userId, isAdmin);
        // Only allow organizer or admin to update
        if (!isAdmin && show.organizer.toString() !== userId) {
            throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'Only the organizer can update this show');
        }
        // Remove protected fields from update data
        const { organizer, ...updateData } = data;
        const updatedShow = await this.update(showId, updateData);
        if (!updatedShow) {
            throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
        }
        return updatedShow;
    }
    /**
     * Delete a show
     */
    async deleteShow(showId, userId, isAdmin = false) {
        const show = await this.getShowById(showId, userId, isAdmin);
        // Only allow organizer or admin to delete
        if (!isAdmin && show.organizer.toString() !== userId) {
            throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'Only the organizer can delete this show');
        }
        const deletedShow = await this.delete(showId);
        if (!deletedShow) {
            throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
        }
    }
    /**
     * Create a show entry
     */
    async createEntry(showId, animalId, userId, category) {
        // Verify show exists and is upcoming
        const show = await this.findById(showId);
        if (!show) {
            throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
        }
        if (show.date < new Date()) {
            throw new apiResponse_1.ApiError(400, 'SHOW_ENDED', 'Cannot enter a past show');
        }
        // Verify animal exists and is owned by user
        const animal = await AnimalService_1.animalService.getAnimalById(animalId, userId);
        // Verify category exists in show
        if (!show.categories.some(c => c.name === category)) {
            throw new apiResponse_1.ApiError(400, 'INVALID_CATEGORY', 'Invalid show category');
        }
        // Get next entry number
        const lastEntry = await models_1.ShowEntry.findOne({ show: show._id })
            .sort({ entry_number: -1 })
            .select('entry_number')
            .lean();
        const entry_number = ((lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.entry_number) || 0) + 1;
        // Create entry
        const entry = await models_1.ShowEntry.create({
            show: show._id,
            animal: animal._id,
            category,
            entry_number,
            owner: new mongoose_1.Types.ObjectId(userId),
        });
        return entry;
    }
    /**
     * Get entries for a show
     */
    async getShowEntries(showId) {
        try {
            const entries = await models_1.ShowEntry.find({ show: new mongoose_1.Types.ObjectId(showId) })
                .populate('animal', '_id name')
                .populate('owner')
                .sort('entry_number')
                .exec();
            return entries;
        }
        catch (error) {
            throw new apiResponse_1.ApiError(500, 'DATABASE_ERROR', 'Failed to fetch show entries');
        }
    }
    /**
     * Record show results
     */
    async recordResult(entryId, placement, points, notes) {
        // Verify entry exists
        const entry = await models_1.ShowEntry.findById(entryId);
        if (!entry) {
            throw new apiResponse_1.ApiError(404, 'ENTRY_NOT_FOUND', 'Show entry not found');
        }
        // Create result
        const result = await models_1.ShowResult.create({
            entry: entry._id,
            placement,
            points,
            notes,
        });
        return result;
    }
    /**
     * Get show statistics
     */
    async getShowStats(showId) {
        const show = await this.findById(showId);
        if (!show) {
            throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
        }
        const entries = await models_1.ShowEntry.find({ show: show._id })
            .populate('animal', '_id name')
            .exec();
        const results = await models_1.ShowResult.find({
            entry: { $in: entries.map(e => e._id) },
        }).exec();
        const stats = {
            totalEntries: entries.length,
            entriesByCategory: {},
            results: [],
        };
        // Calculate entries by category
        entries.forEach(entry => {
            stats.entriesByCategory[entry.category] =
                (stats.entriesByCategory[entry.category] || 0) + 1;
        });
        // Calculate results by category
        show.categories.forEach(category => {
            const categoryEntries = entries.filter(e => e.category === category.name);
            const validResults = results.filter(r => r.placement != null &&
                r.points != null &&
                categoryEntries.some(e => e._id.equals(r.entry)));
            const topPlacements = validResults
                .sort((a, b) => a.placement - b.placement)
                .slice(0, 3)
                .map(result => {
                const entry = categoryEntries.find(e => e._id.equals(result.entry));
                return {
                    entry_number: entry.entry_number,
                    animal_name: entry.animal.name,
                    placement: result.placement,
                    points: result.points,
                };
            });
            stats.results.push({
                category: category.name,
                entries: categoryEntries.length,
                topPlacements,
            });
        });
        return stats;
    }
}
exports.ShowService = ShowService;
// Export singleton instance
exports.showService = new ShowService();
