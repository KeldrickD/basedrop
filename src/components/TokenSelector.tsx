'use client';

import { useState, ChangeEvent } from 'react';
import { useContractReads } from 'wagmi';
import erc20ABI from '@/lib/abi/erc20.json';
import erc721ABI from '@/lib/abi/erc721.json';

interface TokenSelectorProps {
  onTokenSelected: (token: {
    type: 'ERC20' | 'ERC721' | null;
    address: string;
    amount?: string;
    tokenIds?: string[];
  }) => void;
}

export default function TokenSelector({ onTokenSelected }: TokenSelectorProps) {
  const [tokenType, setTokenType] = useState<'ERC20' | 'ERC721' | null>(null);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [tokenIds, setTokenIds] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{ name: string; symbol: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle token address change
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.trim();
    setTokenAddress(address);
    setTokenInfo(null);
    setError(null);

    // Basic Ethereum address validation
    if (address && (address.length !== 42 || !address.startsWith('0x'))) {
      setError('Invalid token address format');
    } else if (address && address.length === 42) {
      validateToken(address);
    }
  };

  // Validate if the address is a valid token contract
  const validateToken = async (address: string) => {
    setIsValidating(true);
    
    try {
      // For simplicity, just check if we can get name and symbol
      // In a production app, you'd want to do more thorough validation
      const abi = tokenType === 'ERC721' ? erc721ABI : erc20ABI;
      
      // This is a simplified version - in real app you'd use useContractReads
      const contract = {
        address: address as `0x${string}`,
        abi,
      };
      
      // For demo purposes, just set placeholder values
      // In a real app, you would fetch this data from the blockchain
      setTokenInfo({
        name: tokenType === 'ERC721' ? 'Sample NFT' : 'Sample Token',
        symbol: tokenType === 'ERC721' ? 'NFT' : 'TKN'
      });

    } catch (err) {
      console.error(err);
      setError('Could not validate token contract. Make sure it\'s a valid ERC20 or ERC721 token.');
    } finally {
      setIsValidating(false);
    }
  };

  // Update parent component when values change
  const updateSelectedToken = () => {
    if (tokenType && tokenAddress) {
      if (tokenType === 'ERC20') {
        onTokenSelected({
          type: tokenType,
          address: tokenAddress,
          amount: tokenAmount
        });
      } else {
        onTokenSelected({
          type: tokenType,
          address: tokenAddress,
          tokenIds: tokenIds.split(',').map(id => id.trim()).filter(id => id)
        });
      }
    } else {
      onTokenSelected({ type: null, address: '' });
    }
  };

  // Update token type
  const handleTokenTypeChange = (type: 'ERC20' | 'ERC721') => {
    setTokenType(type);
    setTokenInfo(null);
    setError(null);
    
    if (tokenAddress) {
      validateToken(tokenAddress);
    }
    
    // Update parent with new selection
    setTimeout(updateSelectedToken, 0);
  };

  // Handle amount change for ERC20
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenAmount(e.target.value);
    setTimeout(updateSelectedToken, 0);
  };

  // Handle token IDs change for ERC721
  const handleTokenIdsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenIds(e.target.value);
    setTimeout(updateSelectedToken,
    0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 2: Select Token</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleTokenTypeChange('ERC20')}
            className={`flex-1 py-3 rounded-lg border ${
              tokenType === 'ERC20'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            ERC20 Token
          </button>
          
          <button
            type="button"
            onClick={() => handleTokenTypeChange('ERC721')}
            className={`flex-1 py-3 rounded-lg border ${
              tokenType === 'ERC721'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            ERC721 NFT
          </button>
        </div>
        
        {tokenType && (
          <>
            <div>
              <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Token Contract Address
              </label>
              <input
                id="tokenAddress"
                type="text"
                value={tokenAddress}
                onChange={handleAddressChange}
                placeholder="0x..."
                className="input-field"
              />
              {isValidating && <p className="mt-1 text-sm text-gray-500">Validating token...</p>}
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              {tokenInfo && (
                <p className="mt-1 text-sm text-green-600">
                  ✓ {tokenInfo.name} ({tokenInfo.symbol})
                </p>
              )}
            </div>
            
            {tokenType === 'ERC20' && tokenAddress && !error && (
              <div>
                <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount per Recipient
                </label>
                <input
                  id="tokenAmount"
                  type="text"
                  value={tokenAmount}
                  onChange={handleAmountChange}
                  placeholder="e.g. 10"
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the amount of tokens to send to each recipient
                </p>
              </div>
            )}
            
            {tokenType === 'ERC721' && tokenAddress && !error && (
              <div>
                <label htmlFor="tokenIds" className="block text-sm font-medium text-gray-700 mb-1">
                  Token IDs
                </label>
                <input
                  id="tokenIds"
                  type="text"
                  value={tokenIds}
                  onChange={handleTokenIdsChange}
                  placeholder="e.g. 1, 2, 3, 4"
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the NFT token IDs separated by commas
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 