'use client';

import { useState } from 'react';
import { useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import baseDropAirdropABI from '@/lib/abi/baseDropAirdrop.json';

interface AirdropButtonProps {
  recipients: string[];
  token: {
    type: 'ERC20' | 'ERC721' | null;
    address: string;
    amount?: string;
    tokenIds?: string[];
  };
  messageUri: string;
  disabled: boolean;
  onAirdropComplete: (txHash: string) => void;
}

export default function AirdropButton({
  recipients,
  token,
  messageUri,
  disabled,
  onAirdropComplete
}: AirdropButtonProps) {
  const { address } = useAccount();
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  // This would be replaced with the actual deployed contract address
  const contractAddress = "0x123..."; // Replace with deployed contract address

  // Initialize contract write for ERC20
  const {
    data: erc20AirdropData,
    isLoading: isErc20AirdropLoading,
    write: writeErc20Airdrop
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: baseDropAirdropABI,
    functionName: 'airdropERC20',
    args: token.type === 'ERC20' ? [
      token.address,
      recipients,
      ethers.utils.parseUnits(token.amount || '0', 18), // Assuming 18 decimals
      messageUri
    ] : undefined,
  });

  // Initialize contract write for ERC721
  const {
    data: erc721AirdropData,
    isLoading: isErc721AirdropLoading,
    write: writeErc721Airdrop
  } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: baseDropAirdropABI,
    functionName: 'airdropERC721',
    args: token.type === 'ERC721' ? [
      token.address,
      recipients,
      token.tokenIds?.map(id => ethers.BigNumber.from(id)) || [],
      messageUri
    ] : undefined,
  });

  // Wait for transaction to complete
  const { isLoading: isWaitingForTx, isSuccess: isTxSuccess } = useWaitForTransaction({
    hash: (token.type === 'ERC20' ? erc20AirdropData?.hash : erc721AirdropData?.hash) as `0x${string}` | undefined,
    onSuccess(data) {
      onAirdropComplete(data.transactionHash);
    },
  });

  // Simulate approval process
  const approveTokens = async () => {
    setIsApproving(true);
    
    try {
      // In a real app, you'd call the actual approve function on the token contract
      // For this demo, we'll simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsApproved(true);
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setIsApproving(false);
    }
  };

  // Execute the airdrop
  const executeAirdrop = () => {
    if (token.type === 'ERC20') {
      writeErc20Airdrop?.();
    } else if (token.type === 'ERC721') {
      writeErc721Airdrop?.();
    }
  };

  const isLoading = isErc20AirdropLoading || isErc721AirdropLoading || isWaitingForTx || isApproving;

  return (
    <div className="pt-6">
      {!isApproved ? (
        <button
          type="button"
          onClick={approveTokens}
          disabled={disabled || isApproving}
          className={`base-button w-full py-3 ${(disabled || isApproving) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isApproving ? 'Approving Tokens...' : 'Approve Tokens for Airdrop'}
        </button>
      ) : (
        <button
          type="button"
          onClick={executeAirdrop}
          disabled={disabled || isLoading}
          className={`base-button w-full py-3 ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing Airdrop...' : `Airdrop to ${recipients.length} Recipients`}
        </button>
      )}
      
      <p className="mt-4 text-sm text-center text-gray-500">
        {isApproved 
          ? 'Your tokens are approved. Click the button above to execute the airdrop.'
          : 'You need to approve the airdrop contract to transfer your tokens.'}
      </p>
    </div>
  );
} 