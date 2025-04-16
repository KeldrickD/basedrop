'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import CSVUploader from '@/components/CSVUploader';
import TokenSelector from '@/components/TokenSelector';
import MessageInput from '@/components/MessageInput';
import AirdropButton from '@/components/AirdropButton';
import AirdropSummary from '@/components/AirdropSummary';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();
  const [recipients, setRecipients] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState<{
    type: 'ERC20' | 'ERC721' | null;
    address: string;
    amount?: string;
    tokenIds?: string[];
  }>({
    type: null,
    address: '',
  });
  const [message, setMessage] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleAirdropComplete = (hash: string) => {
    setTxHash(hash);
    setShowSummary(true);
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">BaseDrop</h1>
        <p className="text-xl mb-8 text-gray-600">Launch airdrops, rewards, or tokens — straight to wallets on Base.</p>
        
        {!isConnected ? (
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Connect your wallet to get started</h2>
            <p className="mb-6">You need to connect your wallet to create an airdrop campaign.</p>
          </div>
        ) : !showSummary ? (
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create New Airdrop</h2>
            
            <div className="space-y-8">
              <CSVUploader onRecipientsLoaded={setRecipients} />
              
              <TokenSelector 
                onTokenSelected={setSelectedToken}
              />
              
              <MessageInput 
                onMessageChange={setMessage}
                onIpfsHashGenerated={setIpfsHash}
              />
              
              <AirdropButton 
                recipients={recipients}
                token={selectedToken}
                messageUri={ipfsHash}
                onAirdropComplete={handleAirdropComplete}
                disabled={
                  recipients.length === 0 || 
                  !selectedToken.type || 
                  !selectedToken.address || 
                  !ipfsHash
                }
              />
            </div>
          </div>
        ) : (
          <AirdropSummary 
            recipients={recipients}
            token={selectedToken}
            messageUri={ipfsHash}
            txHash={txHash}
            onCreateNew={() => {
              setShowSummary(false);
              setRecipients([]);
              setSelectedToken({ type: null, address: '' });
              setMessage('');
              setIpfsHash('');
              setTxHash('');
            }}
          />
        )}
      </div>
    </main>
  );
} 