interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

interface CacheOptions {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum number of items in cache
}

export class Cache<T = any> {
  private cache: Map<string, CacheItem<T>>;
  private readonly options: CacheOptions;

  constructor(options: Partial<CacheOptions> = {}) {
    this.cache = new Map();
    this.options = {
      ttl: options.ttl || 300, // 5 minutes default
      maxSize: options.maxSize || 1000,
    };
  }

  /**
   * Sets a value in the cache
   */
  set(key: string, value: T, ttl?: number): void {
    this.cleanup();

    // Check cache size limit
    if (this.cache.size >= this.options.maxSize) {
      const iterator = this.cache.keys();
      const firstKey = iterator.next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const expiresAt = Date.now() + (ttl || this.options.ttl) * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Gets a value from the cache
   */
  get(key: string): T | undefined {
    this.cleanup();

    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Removes a value from the cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clears all values from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Gets the current size of the cache
   */
  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  /**
   * Checks if a key exists in the cache and is not expired
   */
  has(key: string): boolean {
    this.cleanup();
    const item = this.cache.get(key);
    return !!item && Date.now() <= item.expiresAt;
  }

  /**
   * Gets or sets a cache value using a factory function
   */
  async getOrSet(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Removes expired items from the cache
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Create cache instances for different purposes
export const memoryCache = new Cache();
export const shortCache = new Cache({ ttl: 60 }); // 1 minute
export const longCache = new Cache({ ttl: 3600 }); // 1 hour

// Helper function to create a cache key
export const createCacheKey = (...parts: (string | number | boolean)[]): string => {
  return parts.map(part => String(part)).join(':');
};