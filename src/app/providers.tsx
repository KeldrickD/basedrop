'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { setupGlobalErrorHandlers } from '@/utils/errorReporting';
import { WagmiConfig, createConfig } from 'wagmi';
import { base } from 'viem/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

// Configure wagmi client
const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: 'BaseDrop',
    appDescription: 'Launch airdrops on Base',
    appIcon: 'https://family.co/logo.png',
    chains: [base],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  }),
);

export function Providers({ children }: { children: React.ReactNode }) {
  // Set up global error handlers
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Import analytics dynamically to avoid SSR issues
      import('@/utils/analytics').then(({ trackPageView }) => {
        // Track initial page view
        trackPageView(window.location.pathname);

        // Track subsequent page navigations
        const handleRouteChange = (url: string) => {
          trackPageView(url);
        };

        // Listen for route changes in Next.js
        // This is a simplified example - actual implementation depends on your router
        window.addEventListener('popstate', () => {
          handleRouteChange(window.location.pathname);
        });

        return () => {
          window.removeEventListener('popstate', () => {
            handleRouteChange(window.location.pathname);
          });
        };
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <WagmiConfig config={config}>
        <ConnectKitProvider theme="midnight">
          {/* Skip to content link for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          
          {children}
        </ConnectKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
} 