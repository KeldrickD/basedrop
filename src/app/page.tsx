'use client';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function Home() {
  const { isConnected } = useAccount();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Alt+S
      if (e.altKey && e.key === 's') {
        setIsSidebarExpanded(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-['Inter',sans-serif]">
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
        
        {/* Keyboard shortcuts info */}
        {isSidebarExpanded && (
          <div className="absolute bottom-4 left-0 right-0 px-4 py-2 text-xs text-[var(--color-text-secondary)]">
            <p className="mb-1"><kbd className="px-1 py-0.5 bg-[var(--color-surface-dark)] rounded">Alt+S</kbd> Toggle sidebar</p>
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
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-6 font-['Rajdhani',sans-serif] text-[var(--color-text-primary)]">Create New Airdrop</h2>
                  <p className="mb-8 text-[var(--color-text-secondary)] font-['Roboto_Mono',monospace]">Your wallet is connected! Launch your airdrop in minutes.</p>
                  
                  {/* Stepper */}
                  <div className="flex mb-10 justify-between relative">
                    <div className="flex-1 relative">
                      <div className="h-2 bg-[var(--color-primary)] rounded-full"></div>
                      <div className="absolute -top-1 -left-2 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-[var(--glow-primary)]">1</div>
                      <div className="absolute -bottom-8 left-0 text-xs text-[var(--color-text-primary)] font-['Roboto_Mono',monospace]">Upload CSV</div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-2 bg-[var(--color-accent-purple)]/40 rounded-full"></div>
                      <div className="absolute -top-1 -left-2 w-6 h-6 bg-[var(--color-surface)] border border-[var(--color-accent-purple)] text-[var(--color-accent-purple)] rounded-full flex items-center justify-center">2</div>
                      <div className="absolute -bottom-8 left-0 text-xs text-[var(--color-accent-purple)]/80 font-['Roboto_Mono',monospace]">Configure</div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-2 bg-[var(--color-accent-purple)]/40 rounded-full"></div>
                      <div className="absolute -top-1 -left-2 w-6 h-6 bg-[var(--color-surface)] border border-[var(--color-accent-purple)] text-[var(--color-accent-purple)] rounded-full flex items-center justify-center">3</div>
                      <div className="absolute -bottom-8 left-0 text-xs text-[var(--color-accent-purple)]/80 font-['Roboto_Mono',monospace]">Deploy</div>
                    </div>
                  </div>
                  
                  <div className="mt-16">
                    <div className="border-2 border-dashed border-[var(--color-primary)]/50 rounded-lg p-8 text-center 
                                    hover:border-[var(--color-primary)] transition-colors duration-300 bg-[var(--color-primary)]/5
                                    focus-within:border-[var(--color-primary)] focus-within:shadow-[var(--glow-subtle)]"
                         tabIndex={0}
                         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('file-upload')?.click(); }}
                         role="button"
                         aria-label="Drop CSV file here or press Enter to browse files">
                      <p className="text-xl mb-4 font-['Roboto_Mono',monospace]">Drop CSV file here</p>
                      <p className="text-[var(--color-text-secondary)] mb-6">or</p>
                      <button 
                        className="btn-cyberpunk bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] 
                                  px-6 py-2 rounded hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300
                                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Browse Files
                      </button>
                      <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        accept=".csv" 
                        aria-label="Upload CSV file"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 text-right">
                    <Link 
                      href="/configure" 
                      className="btn-cyberpunk inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-md 
                                 hover:bg-[var(--color-primary)]/90 transition-all duration-300 font-['Rajdhani',sans-serif] 
                                 tracking-wider text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      Next Step
                    </Link>
                  </div>
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
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="Toggle theme"
              >
                <span className="material-icons text-sm">dark_mode</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
} 