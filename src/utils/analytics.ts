/**
 * BaseDrop Analytics Module
 * 
 * A simple, privacy-focused analytics system for tracking app usage.
 * Can be connected to services like Plausible, Segment, or others.
 */

type EventType = 
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'file_uploaded'
  | 'airdrop_created'
  | 'airdrop_executed'
  | 'airdrop_error'
  | 'page_view'
  | 'theme_changed'
  | 'feature_used';

interface EventOptions {
  [key: string]: any;
}

interface AnalyticsConfig {
  enabled: boolean;
  anonymizeIp?: boolean;
  sampleRate?: number; // 0-1, percentage of events to track
  excludeEvents?: EventType[];
}

// Default configuration
let config: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === 'production', // Only enable in production by default
  anonymizeIp: true,
  sampleRate: 1.0, // Track 100% of events by default
  excludeEvents: [],
};

/**
 * Configure analytics settings
 */
export const configureAnalytics = (newConfig: Partial<AnalyticsConfig>) => {
  config = { ...config, ...newConfig };
};

/**
 * Track an event
 */
export const trackEvent = (
  eventType: EventType,
  options: EventOptions = {}
) => {
  if (!config.enabled) return;
  if (config.excludeEvents?.includes(eventType)) return;
  if (Math.random() > (config.sampleRate || 1.0)) return;

  // Add timestamp
  const eventData = {
    ...options,
    timestamp: new Date().toISOString(),
    eventType,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventData);
  }

  // In production, we would send this to an analytics service
  // Here's a placeholder for sending to a backend API
  if (process.env.NODE_ENV === 'production') {
    try {
      // Example of sending to a hypothetical API endpoint
      /* 
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      */

      // For now, we'll just store in localStorage for demo purposes
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(eventData);
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
    } catch (error) {
      // Fail silently - analytics should never break the app
      console.error('Analytics error:', error);
    }
  }
};

/**
 * Page view tracking
 */
export const trackPageView = (path: string) => {
  trackEvent('page_view', { path });
};

/**
 * Helper for common wallet events
 */
export const trackWalletConnected = (address: string, provider?: string) => {
  trackEvent('wallet_connected', { 
    address: config.anonymizeIp ? anonymizeAddress(address) : address,
    provider 
  });
};

export const trackWalletDisconnected = () => {
  trackEvent('wallet_disconnected');
};

/**
 * Helper for airdrop events
 */
export const trackAirdropCreated = (
  recipientCount: number,
  tokenType: string,
  networkId: string | number
) => {
  trackEvent('airdrop_created', { 
    recipientCount, 
    tokenType,
    networkId: String(networkId)
  });
};

export const trackAirdropExecuted = (
  airdropId: string,
  successCount: number,
  failCount: number,
  duration: number
) => {
  trackEvent('airdrop_executed', { 
    airdropId, 
    successCount, 
    failCount,
    duration 
  });
};

/**
 * Utility to anonymize wallet addresses
 */
const anonymizeAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default {
  trackEvent,
  trackPageView,
  trackWalletConnected,
  trackWalletDisconnected,
  trackAirdropCreated,
  trackAirdropExecuted,
  configureAnalytics,
}; 