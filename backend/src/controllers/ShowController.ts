import { Response } from 'express';
import { showService } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiResponse';
import { RequestWithUser } from '../types';
import { CreateShowEntryInput } from '../types/show';

export const createShow = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const organizerId = req.user!.id;
  const show = await showService.createShow(req.body, organizerId);
  res.status(201).json({ success: true, data: show });
});

export const getOrganizedShows = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const organizerId = req.user!.id;
  const shows = await showService.getOrganizedShows(organizerId);
  res.json({ success: true, data: shows });
});

export const getUpcomingShows = asyncHandler(async (_req: RequestWithUser, res: Response) => {
  const shows = await showService.getUpcomingShows();
  res.json({ success: true, data: shows });
});

export const getShow = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { showId } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const show = await showService.getShowById(showId, userId, isAdmin);
  res.json({ success: true, data: show });
});

export const updateShow = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { showId } = req.params;
  const isAdmin = req.user?.role === 'admin';

  const show = await showService.updateShow(showId, userId, req.body, isAdmin);
  res.json({ success: true, data: show });
});

export const deleteShow = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { showId } = req.params;
  const isAdmin = req.user?.role === 'admin';

  await showService.deleteShow(showId, userId, isAdmin);
  res.json({ success: true, message: 'Show deleted successfully' });
});

export const createShowEntry = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const { showId } = req.params;
  const entryData: CreateShowEntryInput = {
    animalId: req.body.animalId,
    category: req.body.category
  };

  const entry = await showService.createShowEntry(showId, entryData, userId);
  res.status(201).json({ success: true, data: entry });
});

export const getShowEntries = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { showId } = req.params;
  const entries = await showService.getEntries(showId);
  res.json({ success: true, data: entries });
});

export const recordShowResult = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { entryId } = req.params;
  const { placement, points, notes } = req.body;

  // Only admins can record results
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'FORBIDDEN', 'Only administrators can record show results');
  }

  const result = await showService.recordShowResult(entryId, placement, points, notes);
  res.status(201).json({ success: true, data: result });
});

export const getShowStats = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { showId } = req.params;
  const stats = await showService.getShowStats(showId);
  res.json({ success: true, data: stats });
});
