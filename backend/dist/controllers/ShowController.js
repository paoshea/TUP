"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShowStats = exports.recordShowResult = exports.getShowEntries = exports.createShowEntry = exports.deleteShow = exports.updateShow = exports.getShow = exports.getUpcomingShows = exports.getOrganizedShows = exports.createShow = void 0;
const services_1 = require("../services");
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
exports.createShow = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizerId = req.user.id;
    const show = await services_1.showService.createShow(req.body, organizerId);
    res.status(201).json({ success: true, data: show });
});
exports.getOrganizedShows = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const organizerId = req.user.id;
    const shows = await services_1.showService.getOrganizedShows(organizerId);
    res.json({ success: true, data: shows });
});
exports.getUpcomingShows = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const shows = await services_1.showService.getUpcomingShows();
    res.json({ success: true, data: shows });
});
exports.getShow = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { showId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    const show = await services_1.showService.getShowById(showId, userId, isAdmin);
    res.json({ success: true, data: show });
});
exports.updateShow = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { showId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    const show = await services_1.showService.updateShow(showId, userId, req.body, isAdmin);
    res.json({ success: true, data: show });
});
exports.deleteShow = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const userId = req.user.id;
    const { showId } = req.params;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
    await services_1.showService.deleteShow(showId, userId, isAdmin);
    res.json({ success: true, message: 'Show deleted successfully' });
});
exports.createShowEntry = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { showId } = req.params;
    const entryData = {
        animalId: req.body.animalId,
        category: req.body.category
    };
    const entry = await services_1.showService.createShowEntry(showId, entryData, userId);
    res.status(201).json({ success: true, data: entry });
});
exports.getShowEntries = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { showId } = req.params;
    const entries = await services_1.showService.getEntries(showId);
    res.json({ success: true, data: entries });
});
exports.recordShowResult = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { entryId } = req.params;
    const { placement, points, notes } = req.body;
    // Only admins can record results
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'Only administrators can record show results');
    }
    const result = await services_1.showService.recordShowResult(entryId, placement, points, notes);
    res.status(201).json({ success: true, data: result });
});
exports.getShowStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { showId } = req.params;
    const stats = await services_1.showService.getShowStats(showId);
    res.json({ success: true, data: stats });
});
