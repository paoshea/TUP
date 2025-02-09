interface CacheConfig {
  maxAge: number;
  maxItems: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class AdvancedCache {
  private cache: Map<string, CacheItem<unknown>>;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.cache = new Map();
    this.config = config;
  }

  set<T>(key: string, data: T): void {
    this.cleanup();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item) return null;

    if (Date.now() - item.timestamp > this.config.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > this.config.maxAge) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();

    // Remove expired items
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config.maxAge) {
        this.cache.delete(key);
      }
    }

    // Remove oldest items if cache is too large
    if (this.cache.size > this.config.maxItems) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      const itemsToRemove = entries
        .slice(0, this.cache.size - this.config.maxItems)
        .map(([key]) => key);

      itemsToRemove.forEach(key => this.cache.delete(key));
    }
  }

  getStats(): {
    size: number;
    oldestItem: number;
    newestItem: number;
  } {
    if (this.cache.size === 0) {
      return {
        size: 0,
        oldestItem: 0,
        newestItem: 0
      };
    }

    const timestamps = Array.from(this.cache.values())
      .map(item => item.timestamp);

    return {
      size: this.cache.size,
      oldestItem: Math.min(...timestamps),
      newestItem: Math.max(...timestamps)
    };
  }
}