type AirdropData = {
  id: string;
  csvData: string;
  tokenAddress?: string;
  tokenAmount?: string;
  createdAt: number;
};

const QUEUE_STORAGE_KEY = 'basedrop_pending_airdrops';

/**
 * Offline Airdrop Queue Manager
 * Helps queue airdrops when users are offline and process them when connectivity returns
 */
export const OfflineQueueManager = {
  /**
   * Add an airdrop to the offline queue
   */
  queueAirdrop: (airdropData: Omit<AirdropData, 'id' | 'createdAt'>) => {
    const id = `airdrop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newAirdrop: AirdropData = {
      ...airdropData,
      id,
      createdAt: Date.now()
    };

    // Get current queue
    const currentQueue = OfflineQueueManager.getPendingAirdrops();
    
    // Add to queue and save
    const updatedQueue = [...currentQueue, newAirdrop];
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue));
    
    return newAirdrop;
  },

  /**
   * Get all pending airdrops
   */
  getPendingAirdrops: (): AirdropData[] => {
    try {
      const queueData = localStorage.getItem(QUEUE_STORAGE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('Error retrieving pending airdrops:', error);
      return [];
    }
  },

  /**
   * Process a specific airdrop from the queue
   */
  processAirdrop: async (id: string, processingFunction: (data: AirdropData) => Promise<boolean>) => {
    const queue = OfflineQueueManager.getPendingAirdrops();
    const airdropToProcess = queue.find(item => item.id === id);
    
    if (!airdropToProcess) {
      return { success: false, error: 'Airdrop not found in queue' };
    }
    
    try {
      // Process the airdrop with the provided function
      const success = await processingFunction(airdropToProcess);
      
      if (success) {
        // Remove from queue if successful
        OfflineQueueManager.removeFromQueue(id);
        return { success: true };
      } else {
        return { success: false, error: 'Processing failed' };
      }
    } catch (error) {
      console.error('Error processing airdrop:', error);
      return { success: false, error: String(error) };
    }
  },

  /**
   * Process all pending airdrops
   */
  processAllPendingAirdrops: async (processingFunction: (data: AirdropData) => Promise<boolean>) => {
    const pendingAirdrops = OfflineQueueManager.getPendingAirdrops();
    const results = [];
    
    for (const airdrop of pendingAirdrops) {
      const result = await OfflineQueueManager.processAirdrop(airdrop.id, processingFunction);
      results.push({ id: airdrop.id, result });
    }
    
    return results;
  },

  /**
   * Remove an airdrop from the queue
   */
  removeFromQueue: (id: string) => {
    const queue = OfflineQueueManager.getPendingAirdrops();
    const updatedQueue = queue.filter(item => item.id !== id);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue));
  },

  /**
   * Clear the entire queue
   */
  clearQueue: () => {
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  }
};

// Network status monitoring
export const NetworkMonitor = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  
  // Add listener for online status
  onNetworkStatusChange: (callback: (isOnline: boolean) => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};

export default OfflineQueueManager; 