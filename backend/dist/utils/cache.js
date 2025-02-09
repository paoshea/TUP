"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheKey = exports.longCache = exports.shortCache = exports.memoryCache = exports.Cache = void 0;
class Cache {
    constructor(options = {}) {
        this.cache = new Map();
        this.options = {
            ttl: options.ttl || 300, // 5 minutes default
            maxSize: options.maxSize || 1000,
        };
    }
    /**
     * Sets a value in the cache
     */
    set(key, value, ttl) {
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
    get(key) {
        this.cleanup();
        const item = this.cache.get(key);
        if (!item)
            return undefined;
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }
        return item.value;
    }
    /**
     * Removes a value from the cache
     */
    delete(key) {
        this.cache.delete(key);
    }
    /**
     * Clears all values from the cache
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Gets the current size of the cache
     */
    size() {
        this.cleanup();
        return this.cache.size;
    }
    /**
     * Checks if a key exists in the cache and is not expired
     */
    has(key) {
        this.cleanup();
        const item = this.cache.get(key);
        return !!item && Date.now() <= item.expiresAt;
    }
    /**
     * Gets or sets a cache value using a factory function
     */
    async getOrSet(key, factory, ttl) {
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
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}
exports.Cache = Cache;
// Create cache instances for different purposes
exports.memoryCache = new Cache();
exports.shortCache = new Cache({ ttl: 60 }); // 1 minute
exports.longCache = new Cache({ ttl: 3600 }); // 1 hour
// Helper function to create a cache key
const createCacheKey = (...parts) => {
    return parts.map(part => String(part)).join(':');
};
exports.createCacheKey = createCacheKey;
