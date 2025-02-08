import { Types } from 'mongoose';
import { Show, ShowEntry, ShowResult } from '../models';
import { BaseService } from './BaseService';
import { ApiError } from '../utils/apiResponse';
import { animalService } from './AnimalService';
import type { IShow } from '../models/Show';
import type { IShowEntry } from '../models/ShowEntry';
import type { IShowResult } from '../models/ShowResult';
import type { IAnimal } from '../models/Animal';

interface ShowStats {
  totalEntries: number;
  entriesByCategory: Record<string, number>;
  results: Array<{
    category: string;
    entries: number;
    topPlacements: Array<{
      entry_number: number;
      animal_name: string;
      placement: number;
      points: number;
    }>;
  }>;
}

type PopulatedShowEntry = Omit<IShowEntry, 'animal'> & {
  animal: Pick<IAnimal, '_id' | 'name'>;
};

export class ShowService extends BaseService<IShow> {
  constructor() {
    super(Show);
  }

  /**
   * Create a new show
   */
  async createShow(data: Partial<IShow>, organizerId: string): Promise<IShow> {
    const show = await this.create({
      ...data,
      organizer: new Types.ObjectId(organizerId),
    });
    return show;
  }

  /**
   * Get shows organized by a user
   */
  async getOrganizedShows(organizerId: string): Promise<IShow[]> {
    return this.find({
      organizer: new Types.ObjectId(organizerId),
    });
  }

  /**
   * Get upcoming shows
   */
  async getUpcomingShows(): Promise<IShow[]> {
    return this.find({
      date: { $gte: new Date() },
    }, {
      sort: { date: 1 },
    });
  }

  /**
   * Get a show by ID and verify access
   */
  async getShowById(showId: string, userId: string, isAdmin: boolean = false): Promise<IShow> {
    const show = await this.findById(showId);
    if (!show) {
      throw new ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
    }

    // Check access - allow if user is admin or organizer
    if (!isAdmin && show.organizer.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this show');
    }

    return show;
  }

  /**
   * Update a show
   */
  async updateShow(
    showId: string,
    userId: string,
    data: Partial<IShow>,
    isAdmin: boolean = false
  ): Promise<IShow> {
    const show = await this.getShowById(showId, userId, isAdmin);

    // Only allow organizer or admin to update
    if (!isAdmin && show.organizer.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Only the organizer can update this show');
    }

    // Remove protected fields from update data
    const { organizer, ...updateData } = data;

    const updatedShow = await this.update(showId, updateData);
    if (!updatedShow) {
      throw new ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
    }

    return updatedShow;
  }

  /**
   * Delete a show
   */
  async deleteShow(showId: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const show = await this.getShowById(showId, userId, isAdmin);

    // Only allow organizer or admin to delete
    if (!isAdmin && show.organizer.toString() !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Only the organizer can delete this show');
    }

    const deletedShow = await this.delete(showId);
    if (!deletedShow) {
      throw new ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
    }
  }

  /**
   * Create a show entry
   */
  async createEntry(
    showId: string,
    animalId: string,
    userId: string,
    category: string
  ): Promise<IShowEntry> {
    // Verify show exists and is upcoming
    const show = await this.findById(showId);
    if (!show) {
      throw new ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
    }

    if (show.date < new Date()) {
      throw new ApiError(400, 'SHOW_ENDED', 'Cannot enter a past show');
    }

    // Verify animal exists and is owned by user
    const animal = await animalService.getAnimalById(animalId, userId);

    // Verify category exists in show
    if (!show.categories.some(c => c.name === category)) {
      throw new ApiError(400, 'INVALID_CATEGORY', 'Invalid show category');
    }

    // Get next entry number
    const lastEntry = await ShowEntry.findOne({ show: show._id })
      .sort({ entry_number: -1 })
      .select('entry_number')
      .lean();

    const entry_number = (lastEntry?.entry_number || 0) + 1;

    // Create entry
    const entry = await ShowEntry.create({
      show: show._id,
      animal: animal._id,
      category,
      entry_number,
      owner: new Types.ObjectId(userId),
    });

    return entry;
  }

  /**
   * Get entries for a show
   */
  async getShowEntries(showId: string): Promise<PopulatedShowEntry[]> {
    try {
      const entries = await ShowEntry.find({ show: new Types.ObjectId(showId) })
        .populate<{ animal: Pick<IAnimal, '_id' | 'name'> }>('animal', '_id name')
        .populate('owner')
        .sort('entry_number')
        .exec();

      return entries as PopulatedShowEntry[];
    } catch (error) {
      throw new ApiError(500, 'DATABASE_ERROR', 'Failed to fetch show entries');
    }
  }

  /**
   * Record show results
   */
  async recordResult(
    entryId: string,
    placement: number,
    points: number,
    notes?: string
  ): Promise<IShowResult> {
    // Verify entry exists
    const entry = await ShowEntry.findById(entryId);
    if (!entry) {
      throw new ApiError(404, 'ENTRY_NOT_FOUND', 'Show entry not found');
    }

    // Create result
    const result = await ShowResult.create({
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
  async getShowStats(showId: string): Promise<ShowStats> {
    const show = await this.findById(showId);
    if (!show) {
      throw new ApiError(404, 'SHOW_NOT_FOUND', 'Show not found');
    }

    const entries = await ShowEntry.find({ show: show._id })
      .populate<{ animal: Pick<IAnimal, '_id' | 'name'> }>('animal', '_id name')
      .exec() as PopulatedShowEntry[];

    const results = await ShowResult.find({
      entry: { $in: entries.map(e => e._id) },
    }).exec();

    const stats: ShowStats = {
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
      const validResults = results.filter(r => 
        r.placement != null && 
        r.points != null && 
        categoryEntries.some(e => e._id.equals(r.entry))
      );

      const topPlacements = validResults
        .sort((a, b) => (a.placement as number) - (b.placement as number))
        .slice(0, 3)
        .map(result => {
          const entry = categoryEntries.find(e => e._id.equals(result.entry))!;
          return {
            entry_number: entry.entry_number,
            animal_name: entry.animal.name,
            placement: result.placement as number,
            points: result.points as number,
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

// Export singleton instance
export const showService = new ShowService();