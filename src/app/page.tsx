'use client';

import Header from '@/components/Header';
import CSVPreview from '@/components/CSVPreview';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import StepWizard from '@/components/StepWizard';
import { NetworkMonitor } from '@/utils/offlineQueue';
import analytics from '@/utils/analytics';

export default function Home() {
  const { isConnected } = useAccount();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Track network status
  useEffect(() => {
    setIsOnline(NetworkMonitor.isOnline);
    
    const cleanup = NetworkMonitor.onNetworkStatusChange((online) => {
      setIsOnline(online);
      if (online) {
        // Process any queued operations when back online
      }
    });
    
    return cleanup;
  }, []);

  // Report page view for analytics
  useEffect(() => {
    analytics.trackPageView('home');
  }, []);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Alt+S
      if (e.altKey && e.key === 's') {
        setIsSidebarExpanded(prev => !prev);
      }
      
      // Toggle theme with Alt+T
      if (e.altKey && e.key === 't') {
        toggleTheme();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  // Create wizard steps
  const wizardSteps = [
    {
      id: 'upload',
      title: 'Upload CSV',
      content: (
        <div className="py-4">
          <h3 className="text-xl font-bold mb-4 font-['Rajdhani',sans-serif]">Upload Recipient List</h3>
          <p className="mb-6 text-[var(--color-text-secondary)]">
            Upload a CSV file with wallet addresses and token amounts for your airdrop
          </p>
          <CSVPreview
            onFileLoaded={(file, data) => {
              console.log('CSV loaded:', data.length, 'rows');
              analytics.trackEvent('file_uploaded', { 
                fileSize: file.size,
                rowCount: data.length
              });
            }}
          />
        </div>
      ),
    },
    {
      id: 'configure',
      title: 'Configure',
      content: (
        <div className="py-4">
          <h3 className="text-xl font-bold mb-4 font-['Rajdhani',sans-serif]">Configure Airdrop</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Token Type</label>
              <select className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-primary)]/30 rounded-md p-2 text-[var(--color-text-primary)]">
                <option value="erc20">ERC-20 Token</option>
                <option value="erc721">ERC-721 NFT</option>
                <option value="erc1155">ERC-1155 Multi-Token</option>
              </select>
            </div>
            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Token Address</label>
              <input 
                type="text" 
                placeholder="0x..." 
                className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-primary)]/30 rounded-md p-2 text-[var(--color-text-primary)]"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'review',
      title: 'Review',
      content: (
        <div className="py-4">
          <h3 className="text-xl font-bold mb-4 font-['Rajdhani',sans-serif]">Review & Deploy</h3>
          <div className="bg-[var(--color-surface-dark)] p-4 rounded-md mb-6 border border-[var(--color-primary)]/30">
            <div className="flex justify-between py-2 border-b border-[var(--color-primary)]/10">
              <span className="text-[var(--color-text-secondary)]">Recipients</span>
              <span className="font-bold">125 addresses</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--color-primary)]/10">
              <span className="text-[var(--color-text-secondary)]">Token</span>
              <span className="font-bold">BaseCoin (BC)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--color-primary)]/10">
              <span className="text-[var(--color-text-secondary)]">Total Amount</span>
              <span className="font-bold">10,000 BC</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--color-text-secondary)]">Estimated Gas</span>
              <span className="font-bold">~0.025 ETH</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-['Inter',sans-serif]" id="main-content">
      {/* Network status indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 w-full bg-[var(--color-accent-pink)] text-white py-1 px-4 text-center z-50 text-sm">
          You are currently offline. Changes will be queued and processed when you reconnect.
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-[var(--color-surface)] z-30 transition-all duration-300 pt-16 shadow-[var(--glow-subtle)] ${isSidebarExpanded ? 'w-64' : 'w-16'}`}
           aria-label="Navigation sidebar">
        <button 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="absolute top-4 right-4 text-[var(--color-primary)] hover:text-[var(--color-accent-purple)] transition-colors duration-200 
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-full p-1"
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          title="Toggle sidebar (Alt+S)"
        >
          {isSidebarExpanded ? 
            <span className="material-icons">chevron_left</span> : 
            <span className="material-icons">chevron_right</span>
          }
        </button>
        <nav className="mt-6" aria-label="Main navigation">
          <ul>
            <li className="mb-4">
              <Link 
                href="/" 
                className={`flex items-center px-4 py-2 group transition-all ${
                  activeTab === 'dashboard' 
                    ? 'text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                } hover:bg-[var(--color-primary)]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-r`}
                onClick={() => setActiveTab('dashboard')}
                tabIndex={0}
                role="menuitem"
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
              >
                <span className={`material-icons tooltip ${!isSidebarExpanded ? 'group-hover:animate-pulse' : ''}`} 
                      data-tooltip="Dashboard" 
                      aria-label={!isSidebarExpanded ? "Dashboard" : undefined}>
                  dashboard
                </span>
                {isSidebarExpanded && <span className="ml-2">Dashboard</span>}
                {activeTab === 'dashboard' && (
                  <span className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)] w-full rounded-full 
                                   shadow-[var(--glow-subtle)]"></span>
                )}
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                href="/create-airdrop" 
                className={`flex items-center px-4 py-2 group transition-all ${
                  activeTab === 'create' 
                    ? 'text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                } hover:bg-[var(--color-primary)]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-r`}
                onClick={() => setActiveTab('create')}
                tabIndex={0}
                role="menuitem"
                aria-current={activeTab === 'create' ? 'page' : undefined}
              >
                <span className={`material-icons tooltip ${!isSidebarExpanded ? 'group-hover:animate-pulse' : ''}`} 
                      data-tooltip="Create Airdrop" 
                      aria-label={!isSidebarExpanded ? "Create Airdrop" : undefined}>
                  add_circle
                </span>
                {isSidebarExpanded && <span className="ml-2">Create Airdrop</span>}
                {activeTab === 'create' && (
                  <span className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)] w-full rounded-full 
                                   shadow-[var(--glow-subtle)]"></span>
                )}
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                href="/history" 
                className={`flex items-center px-4 py-2 group transition-all ${
                  activeTab === 'history' 
                    ? 'text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                } hover:bg-[var(--color-primary)]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-r`}
                onClick={() => setActiveTab('history')}
                tabIndex={0}
                role="menuitem"
                aria-current={activeTab === 'history' ? 'page' : undefined}
              >
                <span className={`material-icons tooltip ${!isSidebarExpanded ? 'group-hover:animate-pulse' : ''}`} 
                      data-tooltip="History" 
                      aria-label={!isSidebarExpanded ? "History" : undefined}>
                  history
                </span>
                {isSidebarExpanded && <span className="ml-2">History</span>}
                {activeTab === 'history' && (
                  <span className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)] w-full rounded-full 
                                   shadow-[var(--glow-subtle)]"></span>
                )}
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                href="/settings" 
                className={`flex items-center px-4 py-2 group transition-all ${
                  activeTab === 'settings' 
                    ? 'text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                } hover:bg-[var(--color-primary)]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-r`}
                onClick={() => setActiveTab('settings')}
                tabIndex={0}
                role="menuitem"
                aria-current={activeTab === 'settings' ? 'page' : undefined}
              >
                <span className={`material-icons tooltip ${!isSidebarExpanded ? 'group-hover:animate-pulse' : ''}`} 
                      data-tooltip="Settings" 
                      aria-label={!isSidebarExpanded ? "Settings" : undefined}>
                  settings
                </span>
                {isSidebarExpanded && <span className="ml-2">Settings</span>}
                {activeTab === 'settings' && (
                  <span className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-primary)] w-full rounded-full 
                                   shadow-[var(--glow-subtle)]"></span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Theme toggle in sidebar */}
        <div className="absolute bottom-12 left-0 right-0 px-4 text-center">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center py-2 px-3 rounded-md hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode (Alt+T)`}
          >
            <span className="material-icons">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {isSidebarExpanded && (
              <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
        </div>
        
        {/* Keyboard shortcuts info */}
        {isSidebarExpanded && (
          <div className="absolute bottom-4 left-0 right-0 px-4 py-2 text-xs text-[var(--color-text-secondary)]">
            <p className="mb-1"><kbd className="px-1 py-0.5 bg-[var(--color-surface-dark)] rounded">Alt+S</kbd> Toggle sidebar</p>
            <p><kbd className="px-1 py-0.5 bg-[var(--color-surface-dark)] rounded">Alt+T</kbd> Toggle theme</p>
          </div>
        )}
      </div>
      
      {/* Main Content - Now properly offset to not overlap with sidebar */}
      <div className={`${isSidebarExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Header stays at the very top, but offset from sidebar */}
        <div className="fixed top-0 right-0 z-20 w-full" style={{ width: `calc(100% - ${isSidebarExpanded ? '16rem' : '4rem'})` }}>
          <Header />
        </div>
        
        {/* Main content area, now with proper top padding to account for header */}
        <div className="pt-16 relative overflow-hidden">
          {/* Hero Section with Gradient Background */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-purple)] py-16 px-6 relative">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-5xl font-bold mb-4 font-['Rajdhani',sans-serif] tracking-wider">
                <span className="animate-[neon-breathe_3s_ease-in-out_infinite]">BaseDrop</span>
              </h1>
              <p className="text-xl max-w-2xl mx-auto font-['Roboto_Mono',monospace] opacity-90">
                A simple, efficient platform to airdrop tokens, NFTs, and rewards directly to wallets on Base.
              </p>
            </div>
            {/* Cyberpunk grid overlay */}
            <div className="absolute inset-0 z-0 opacity-20" 
              style={{
                backgroundImage: "linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }}>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12 max-w-6xl -mt-8">
            {/* Main Card */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-8 shadow-[var(--glow-subtle)] backdrop-blur-sm backdrop-filter border border-[var(--color-primary)]/20 mb-12">
              {!isConnected ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4 font-['Rajdhani',sans-serif] text-[var(--color-text-primary)]">Connect your wallet to get started</h2>
                  <p className="mb-8 text-[var(--color-text-secondary)] font-['Roboto_Mono',monospace]">You need to connect your wallet to create an airdrop campaign.</p>
                  <button 
                    className="btn-cyberpunk bg-[var(--color-primary)] text-white px-8 py-3 rounded-md hover:bg-[var(--color-primary)]/90 
                              font-['Rajdhani',sans-serif] tracking-wider text-lg animate-[pulse-glow_4s_ease-in-out_infinite]
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    aria-label="Connect your wallet"
                    onClick={() => {
                      // This would typically be handled by your wallet connector
                      analytics.trackEvent('wallet_connect_attempt');
                    }}
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-6 font-['Rajdhani',sans-serif] text-[var(--color-text-primary)]">Create New Airdrop</h2>
                  
                  {/* Step Wizard */}
                  <StepWizard 
                    steps={wizardSteps}
                    onComplete={() => {
                      console.log('Wizard completed');
                      analytics.trackEvent('airdrop_created', {
                        wizardCompleted: true
                      });
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Features Section - Cyberpunk style */}
            <h3 className="text-2xl font-bold mb-8 font-['Rajdhani',sans-serif] text-center text-[var(--color-text-primary)]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-pink)]">FEATURES</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-[var(--glow-subtle)] border border-[var(--color-primary)]/20 
                            hover:shadow-[var(--glow-primary)] transition-all duration-300 focus-within:shadow-[var(--glow-primary)]"
                   tabIndex={0}>
                <div className="w-12 h-12 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mb-4 
                                group-hover:animate-pulse transition-all duration-300">
                  <span className="material-icons text-[var(--color-primary)]">bolt</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-['Rajdhani',sans-serif] text-[var(--color-text-primary)]">Simple & Fast</h3>
                <p className="text-[var(--color-text-secondary)] font-['Roboto_Mono',monospace] text-sm">Create and launch airdrops in minutes with our intuitive interface.</p>
              </div>
              <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-[var(--glow-subtle)] border border-[var(--color-accent-purple)]/20 
                            hover:shadow-[var(--glow-purple)] transition-all duration-300 focus-within:shadow-[var(--glow-purple)]"
                   tabIndex={0}>
                <div className="w-12 h-12 bg-[var(--color-accent-purple)]/20 rounded-full flex items-center justify-center mb-4 
                                group-hover:animate-pulse transition-all duration-300">
                  <span className="material-icons text-[var(--color-accent-purple)]">local_fire_department</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-['Rajdhani',sans-serif] text-[var(--color-text-primary)]">Gas Optimized</h3>
                <p className="text-[var(--color-text-secondary)] font-['Roboto_Mono',monospace] text-sm">Efficient smart contracts minimize gas costs on the Base network.</p>
              </div>
              <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-[var(--glow-subtle)] border border-[var(--color-accent-pink)]/20 
                            hover:shadow-[var(--glow-pink)] transition-all duration-300 focus-within:shadow-[var(--glow-pink)]"
                   tabIndex={0}>
                <div className="w-12 h-12 bg-[var(--color-accent-pink)]/20 rounded-full flex items-center justify-center mb-4 
                                group-hover:animate-pulse transition-all duration-300">
                  <span className="material-icons text-[var(--color-accent-pink)]">card_giftcard</span>
                </div>
                <h3 className="text-xl font-bold mb-3 font-['Rajdhani',sans-serif] text-[var(--color-text-primary)]">Flexible Rewards</h3>
                <p className="text-[var(--color-text-secondary)] font-['Roboto_Mono',monospace] text-sm">Distribute tokens, NFTs, or other on-chain rewards to your community.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - properly offset as well */}
      <div className={`${isSidebarExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <footer className="bg-[var(--color-surface-dark)] py-8 border-t border-[var(--color-primary)]/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-[var(--color-text-secondary)] font-['Roboto_Mono',monospace] text-sm">
            <p>© 2025 <span className="text-[var(--color-primary)]">BaseDrop</span>. All rights reserved.</p>
            <div className="mt-3 flex justify-center space-x-4">
              <button 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="View documentation"
              >
                <span className="material-icons text-sm">description</span>
              </button>
              <button 
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="View GitHub repository"
              >
                <span className="material-icons text-sm">code</span>
              </button>
              <button 
                onClick={toggleTheme}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <span className="material-icons text-sm">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
} 