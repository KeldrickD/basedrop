/**
 * Error Reporting Module
 * 
 * A utility for tracking and reporting errors to help improve the application.
 * Can be connected to services like Sentry, LogRocket, etc.
 */

type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

type ErrorCategory = 
  | 'connection'
  | 'transaction'
  | 'validation'
  | 'api'
  | 'ui'
  | 'other';

interface ErrorDetails {
  message: string;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  stack?: string;
  componentName?: string;
  metadata?: Record<string, any>;
  user?: {
    address?: string;
    provider?: string;
  };
}

interface ErrorReportingConfig {
  enabled: boolean;
  sampleRate?: number; // 0-1, percentage of errors to report
  consoleOutput?: boolean;
  includeMetadata?: boolean;
  anonymizeUser?: boolean;
}

// Default configuration
let config: ErrorReportingConfig = {
  enabled: process.env.NODE_ENV === 'production', // Only enable in production by default
  sampleRate: 1.0, // Report 100% of errors by default
  consoleOutput: process.env.NODE_ENV === 'development',
  includeMetadata: true,
  anonymizeUser: true,
};

/**
 * Configure error reporting settings
 */
export const configureErrorReporting = (newConfig: Partial<ErrorReportingConfig>) => {
  config = { ...config, ...newConfig };
};

/**
 * Process and anonymize error data as needed
 */
const processErrorDetails = (details: ErrorDetails): ErrorDetails => {
  if (!config.includeMetadata) {
    const { message, severity, category } = details;
    return { message, severity, category };
  }

  if (config.anonymizeUser && details.user?.address) {
    return {
      ...details,
      user: {
        ...details.user,
        address: anonymizeAddress(details.user.address),
      },
    };
  }

  return details;
};

/**
 * Utility to anonymize wallet addresses
 */
const anonymizeAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Report an error or exception
 */
export const reportError = (error: Error | string, details: Omit<ErrorDetails, 'message'> = {}) => {
  if (!config.enabled) return;
  if (Math.random() > (config.sampleRate || 1.0)) return;

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  
  const errorDetails: ErrorDetails = processErrorDetails({
    message: errorMessage,
    stack: errorStack,
    severity: details.severity || 'error',
    category: details.category || 'other',
    ...details,
  });

  // Log to console in development
  if (config.consoleOutput) {
    console.error('[Error Reporting]', errorDetails);
  }

  // In production, we would send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    try {
      // Example of sending to a hypothetical API endpoint
      /* 
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...errorDetails,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          appVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
        }),
      });
      */
      
      // Would integrate with Sentry or similar here
      // Example with Sentry:
      /* 
      Sentry.captureException(error, {
        level: errorDetails.severity,
        tags: {
          category: errorDetails.category,
          component: errorDetails.componentName,
        },
        extra: errorDetails.metadata,
        user: errorDetails.user,
      });
      */
      
      // For now, we'll just store in localStorage for demo purposes
      const errors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      errors.push({
        ...errorDetails,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('error_reports', JSON.stringify(errors.slice(-50))); // Keep last 50 errors
    } catch (e) {
      // Fail silently - error reporting should never break the app further
      console.error('Error reporting failed:', e);
    }
  }
};

/**
 * Set up global error handlers
 */
export const setupGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return;
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason || 'Unhandled Promise Rejection', {
      category: 'other',
      severity: 'error',
      metadata: { 
        type: 'unhandledRejection',
      },
    });
  });

  // Create a custom error boundary for React components
  // (This would be implemented as a React component)
  
  // Override console.error in development
  if (process.env.NODE_ENV === 'development') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call the original console.error
      originalConsoleError.apply(console, args);
      
      // Report console errors that look like exceptions
      const errorArg = args.find(arg => arg instanceof Error);
      if (errorArg) {
        reportError(errorArg, {
          category: 'other',
          severity: 'warning',
          metadata: { source: 'console.error' },
        });
      }
    };
  }
};

export default {
  reportError,
  configureErrorReporting,
  setupGlobalErrorHandlers,
}; 