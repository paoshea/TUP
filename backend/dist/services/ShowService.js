"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showService = exports.ShowService = void 0;
const PrismaService_1 = require("./PrismaService");
const apiResponse_1 = require("../utils/apiResponse");
const prisma_1 = require("../types/prisma");
class ShowService extends PrismaService_1.PrismaService {
    /**
     * Create a show
     */
    async createShow(data, organizerId) {
        try {
            const result = await this.$transaction(async (prisma) => {
                const show = await prisma.show.create({
                    data: {
                        ...data,
                        categories: data.categories,
                        organizer: {
                            connect: { id: organizerId }
                        },
                    },
                    include: {
                        organizer: true,
                    }
                });
                const parsedShow = {
                    ...show,
                    categories: typeof show.categories === 'string'
                        ? JSON.parse(show.categories)
                        : show.categories,
                    organizer: (0, prisma_1.formatProfilePublic)(show.organizer)
                };
                return parsedShow;
            });
            return result;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get shows organized by a user
     */
    async getOrganizedShows(organizerId) {
        try {
            const shows = await this.show.findMany({
                where: { organizerId },
                include: {
                    organizer: true
                }
            });
            return shows.map((show) => ({
                ...show,
                categories: typeof show.categories === 'string'
                    ? JSON.parse(show.categories)
                    : show.categories,
                organizer: (0, prisma_1.formatProfilePublic)(show.organizer)
            }));
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get upcoming shows
     */
    async getUpcomingShows() {
        try {
            const shows = await this.show.findMany({
                where: {
                    date: {
                        gte: new Date()
                    }
                },
                orderBy: {
                    date: 'asc'
                },
                include: {
                    organizer: true
                }
            });
            return shows.map((show) => ({
                ...show,
                categories: typeof show.categories === 'string'
                    ? JSON.parse(show.categories)
                    : show.categories,
                organizer: (0, prisma_1.formatProfilePublic)(show.organizer)
            }));
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get a show by ID and verify access
     */
    async getShowById(showId, userId, isAdmin = false) {
        try {
            const show = await this.show.findUnique({
                where: { id: showId },
                include: {
                    organizer: true
                }
            });
            if (!show) {
                throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
            }
            // Check access - allow if user is admin or organizer
            if (!isAdmin && show.organizerId !== userId) {
                throw new apiResponse_1.ApiError(403, 'FORBIDDEN', 'You do not have access to this show');
            }
            return {
                ...show,
                categories: typeof show.categories === 'string'
                    ? JSON.parse(show.categories)
                    : show.categories,
                organizer: (0, prisma_1.formatProfilePublic)(show.organizer)
            };
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Update a show
     */
    async updateShow(showId, userId, data, isAdmin = false) {
        await this.getShowById(showId, userId, isAdmin);
        try {
            const updateData = {
                name: data.name,
                date: data.date,
                location: data.location,
                categories: data.categories
                    ? data.categories
                    : undefined
            };
            const result = await this.show.update({
                where: { id: showId },
                data: updateData,
                include: {
                    organizer: true
                }
            });
            return {
                ...result,
                categories: typeof result.categories === 'string'
                    ? JSON.parse(result.categories)
                    : result.categories,
                organizer: (0, prisma_1.formatProfilePublic)(result.organizer)
            };
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Delete a show
     */
    async deleteShow(showId, userId, isAdmin = false) {
        await this.getShowById(showId, userId, isAdmin);
        try {
            await this.show.delete({
                where: { id: showId }
            });
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get show statistics
     */
    async getShowStats(showId) {
        try {
            const show = await this.$queryRaw `
        SELECT 
          s.categories,
          json_agg(
            json_build_object(
              'id', e.id,
              'entryNumber', e."entryNumber",
              'category', e.category,
              'animal', json_build_object(
                'id', a.id,
                'name', a.name
              ),
              'results', COALESCE(
                (
                  SELECT json_agg(r.*)
                  FROM "ShowResult" r
                  WHERE r."entryId" = e.id
                ),
                '[]'
              )
            )
          ) as entries
        FROM "Show" s
        LEFT JOIN "ShowEntry" e ON e."showId" = s.id
        LEFT JOIN "Animal" a ON a.id = e."animalId"
        WHERE s.id = ${showId}
        GROUP BY s.id
      `;
            if (!show || !show.length) {
                throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
            }
            const showData = show[0];
            const categories = typeof showData.categories === 'string'
                ? JSON.parse(showData.categories)
                : showData.categories;
            const entries = showData.entries || [];
            const stats = {
                totalEntries: entries.length,
                entriesByCategory: {},
                results: []
            };
            // Calculate entries by category
            entries.forEach((entry) => {
                stats.entriesByCategory[entry.category] =
                    (stats.entriesByCategory[entry.category] || 0) + 1;
            });
            // Calculate results by category
            categories.forEach((category) => {
                const categoryEntries = entries.filter((e) => e.category === category.name);
                const topPlacements = categoryEntries
                    .map((entry) => ({
                    entry,
                    result: entry.results[0] // Assuming one result per entry
                }))
                    .filter(({ result }) => (result === null || result === void 0 ? void 0 : result.placement) != null && (result === null || result === void 0 ? void 0 : result.points) != null)
                    .sort((a, b) => a.result.placement - b.result.placement)
                    .slice(0, 3)
                    .map(({ entry, result }) => ({
                    entry_number: entry.entryNumber,
                    animal_name: entry.animal.name,
                    placement: result.placement,
                    points: result.points
                }));
                stats.results.push({
                    category: category.name,
                    entries: categoryEntries.length,
                    topPlacements
                });
            });
            return stats;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Get entries for a show
     */
    async getEntries(showId) {
        try {
            const entries = await this.showEntry.findMany({
                where: { showId },
                include: {
                    animal: true,
                }
            });
            return entries.map((entry) => ({
                id: entry.id,
                entryNumber: entry.entryNumber,
                category: entry.category,
                animal: {
                    id: entry.animal.id,
                    name: entry.animal.name
                },
                results: []
            }));
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Create a show entry
     */
    async createShowEntry(showId, data, userId) {
        var _a;
        try {
            // Verify show exists
            const show = await this.show.findUnique({
                where: { id: showId }
            });
            if (!show) {
                throw new apiResponse_1.ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
            }
            // Get the next entry number for this show
            const lastEntry = await this.showEntry.findFirst({
                where: { showId },
                orderBy: { entryNumber: 'desc' }
            });
            const entryNumber = ((_a = lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.entryNumber) !== null && _a !== void 0 ? _a : 0) + 1;
            const entry = await this.showEntry.create({
                data: {
                    entryNumber,
                    category: data.category,
                    show: { connect: { id: showId } },
                    animal: { connect: { id: data.animalId } },
                    owner: { connect: { id: userId } }
                },
                include: {
                    animal: true,
                    showResults: true
                }
            });
            return {
                id: entry.id,
                entryNumber: entry.entryNumber,
                category: entry.category,
                animal: {
                    id: entry.animal.id,
                    name: entry.animal.name
                },
                results: entry.showResults
            };
        }
        catch (error) {
            this.handleError(error);
        }
    }
    /**
     * Record a show result
     */
    async recordShowResult(entryId, placement, points, notes) {
        try {
            return await this.showResult.create({
                data: { showEntryId: entryId, placement, points, notes }
            });
        }
        catch (error) {
            this.handleError(error);
        }
    }
}
exports.ShowService = ShowService;
// Export singleton instance
exports.showService = new ShowService();
