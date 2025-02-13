import { PrismaService } from './PrismaService';
import { ApiError } from '../utils/apiResponse';
import { Prisma } from '@prisma/client';
import {
  ShowCategory,
  ShowStats,
  CreateShowInput,
  UpdateShowInput,
  ProfilePublic,
  formatProfilePublic
} from '../types/prisma';

interface ShowResult {
  placement: number;
  points: number;
}

interface ShowEntry {
  id: string;
  entryNumber: number;
  category: string;
  animal: {
    id: string;
    name: string;
  };
  results: ShowResult[];
}

export class ShowService extends PrismaService {
  /**
   * Create a show
   */
  async createShow(
    data: CreateShowInput,
    organizerId: string
  ) {
    try {
      const result = await this.$transaction(async (tx) => {
        const show = await tx.show.create({
          data: {
            ...data,
            categories: JSON.stringify(data.categories),
            organizer: {
              connect: { id: organizerId }
            }
          },
          include: {
            organizer: true
          }
        });

        return {
          ...show,
          categories: JSON.parse(show.categories as string) as ShowCategory[],
          organizer: formatProfilePublic(show.organizer)
        };
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get shows organized by a user
   */
  async getOrganizedShows(organizerId: string) {
    try {
      const shows = await this.show.findMany({
        where: { organizerId },
        include: {
          organizer: true
        }
      });

      return shows.map(show => ({
        ...show,
        categories: JSON.parse(show.categories as string) as ShowCategory[],
        organizer: formatProfilePublic(show.organizer)
      }));
    } catch (error) {
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

      return shows.map(show => ({
        ...show,
        categories: JSON.parse(show.categories as string) as ShowCategory[],
        organizer: formatProfilePublic(show.organizer)
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get a show by ID and verify access
   */
  async getShowById(
    showId: string,
    userId: string,
    isAdmin: boolean = false
  ) {
    try {
      const show = await this.show.findUnique({
        where: { id: showId },
        include: {
          organizer: true
        }
      });

      if (!show) {
        throw new ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
      }

      // Check access - allow if user is admin or organizer
      if (!isAdmin && show.organizerId !== userId) {
        throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this show');
      }

      return {
        ...show,
        categories: JSON.parse(show.categories as string) as ShowCategory[],
        organizer: formatProfilePublic(show.organizer)
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update a show
   */
  async updateShow(
    showId: string,
    userId: string,
    data: UpdateShowInput,
    isAdmin: boolean = false
  ) {
    await this.getShowById(showId, userId, isAdmin);

    try {
      const updateData: Prisma.ShowUpdateInput = {
        ...data,
        categories: data.categories ? JSON.stringify(data.categories) : undefined
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
        categories: JSON.parse(result.categories as string) as ShowCategory[],
        organizer: formatProfilePublic(result.organizer)
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete a show
   */
  async deleteShow(
    showId: string,
    userId: string,
    isAdmin: boolean = false
  ): Promise<void> {
    await this.getShowById(showId, userId, isAdmin);

    try {
      await this.show.delete({
        where: { id: showId }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get show statistics
   */
  async getShowStats(showId: string): Promise<ShowStats> {
    try {
      const show = await this.$queryRaw<any>`
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
        throw new ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
      }

      const showData = show[0];
      const categories = JSON.parse(showData.categories) as ShowCategory[];
      const entries = showData.entries || [];

      const stats: ShowStats = {
        totalEntries: entries.length,
        entriesByCategory: {},
        results: []
      };

      // Calculate entries by category
      entries.forEach((entry: ShowEntry) => {
        stats.entriesByCategory[entry.category] =
          (stats.entriesByCategory[entry.category] || 0) + 1;
      });

      // Calculate results by category
      categories.forEach(category => {
        const categoryEntries = entries.filter((e: ShowEntry) => e.category === category.name);

        const topPlacements = categoryEntries
          .map((entry: ShowEntry) => ({
            entry,
            result: entry.results[0] // Assuming one result per entry
          }))
          .filter(({ result }: { result: ShowResult | undefined }) => result?.placement != null && result?.points != null)
          .sort((a: { result: ShowResult }, b: { result: ShowResult }) => a.result.placement - b.result.placement)
          .slice(0, 3)
          .map(({ entry, result }: { entry: ShowEntry; result: ShowResult }) => ({
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
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Export singleton instance
export const showService = new ShowService();