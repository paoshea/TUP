import { Model, Document, FilterQuery, UpdateQuery, QueryOptions, SortOrder } from 'mongoose';
import { ApiError } from '../utils/apiResponse';
import { PaginationOptions, FilterOptions, PaginatedResponse } from '../types';

export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const doc = new this.model(data);
      return await doc.save() as T;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Find a document by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      const doc = await this.model.findById(id).exec();
      return doc;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Find documents with pagination
   */
  async findAll(
    options: PaginationOptions & FilterOptions = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        ...filters
      } = options;

      const skip = (page - 1) * limit;
      const sortOrder: SortOrder = order === 'desc' ? -1 : 1;
      const sortOptions: { [key: string]: SortOrder } = { [sort]: sortOrder };

      const [docs, total] = await Promise.all([
        this.model
          .find(filters as FilterQuery<T>)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.model.countDocuments(filters as FilterQuery<T>),
      ]);

      return {
        items: docs,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Update a document by ID
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const doc = await this.model.findByIdAndUpdate(
        id,
        data as UpdateQuery<T>,
        { new: true }
      ).exec();
      return doc;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Delete a document by ID
   */
  async delete(id: string): Promise<T | null> {
    try {
      const doc = await this.model.findByIdAndDelete(id).exec();
      return doc;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Find one document by filter
   */
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      const doc = await this.model.findOne(filter).exec();
      return doc;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Find documents by filter
   */
  async find(
    filter: FilterQuery<T>,
    options: QueryOptions = {}
  ): Promise<T[]> {
    try {
      const docs = await this.model.find(filter, null, options).exec();
      return docs;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Count documents by filter
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      const count = await this.model.countDocuments(filter);
      return count;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Check if a document exists
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const exists = await this.model.exists(filter);
      return !!exists;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle common database errors
   */
  protected handleError(error: any): never {
    if (error.name === 'ValidationError') {
      throw new ApiError(400, 'VALIDATION_ERROR', error.message, error.errors);
    }

    if (error.name === 'CastError') {
      throw new ApiError(400, 'INVALID_ID', `Invalid ${error.path}: ${error.value}`);
    }

    if (error.code === 11000) {
      throw new ApiError(409, 'DUPLICATE_ENTRY', 'Duplicate entry found');
    }

    throw error;
  }
}