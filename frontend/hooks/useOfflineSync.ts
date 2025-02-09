import { useState, useEffect } from 'react';

interface SyncItem<T = Record<string, unknown>> {
  id: string;
  data: T;
  timestamp: number;
  type: 'evaluation' | 'animal' | 'show';
  action: 'create' | 'update' | 'delete';
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load existing sync queue from localStorage
    const loadSyncQueue = () => {
      const saved = localStorage.getItem('syncQueue');
      if (saved) {
        setSyncQueue(JSON.parse(saved));
      }
    };

    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    loadSyncQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save sync queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Attempt to sync when coming online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing) {
      syncQueuedItems();
    }
  }, [isOnline, syncQueue]);

  const addToSyncQueue = <T extends Record<string, unknown>>(item: Omit<SyncItem<T>, 'timestamp'>) => {
    setSyncQueue(prev => [...prev, { ...item, timestamp: Date.now() }]);
  };

  const removeFromSyncQueue = (id: string) => {
    setSyncQueue(prev => prev.filter(item => item.id !== id));
  };

  const syncQueuedItems = async () => {
    if (!isOnline || isSyncing || syncQueue.length === 0) return;

    setIsSyncing(true);
    
    try {
      for (const item of syncQueue) {
        try {
          let endpoint = `/api/${item.type}s`;
          const method = item.action === 'create' ? 'POST' : 
                      item.action === 'update' ? 'PUT' : 'DELETE';
          
          if (item.action !== 'create') {
            endpoint += `/${item.id}`;
          }

          const response = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: item.action !== 'delete' ? JSON.stringify(item.data) : undefined,
          });

          if (response.ok) {
            removeFromSyncQueue(item.id);
          } else {
            console.error(`Failed to sync item ${item.id}:`, await response.text());
          }
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const saveOffline = async <T extends Record<string, unknown>>(
    type: SyncItem['type'],
    action: SyncItem['action'],
    id: string,
    data?: T
  ): Promise<boolean> => {
    // Save to local storage
    const storageKey = `${type}_${id}`;
    if (action !== 'delete' && data) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } else {
      localStorage.removeItem(storageKey);
    }

    // Add to sync queue
    addToSyncQueue<T>({
      id,
      type,
      action,
      data: data ?? {} as T
    });

    return true;
  };

  return {
    isOnline,
    isSyncing,
    syncQueue,
    saveOffline,
    syncQueuedItems,
  };
}