'use client';

import { useState, ChangeEvent } from 'react';

interface MessageInputProps {
  onMessageChange: (message: string) => void;
  onIpfsHashGenerated: (hash: string) => void;
}

export default function MessageInput({ onMessageChange, onIpfsHashGenerated }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState('');

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    onMessageChange(newMessage);
    
    // Clear the hash if message changes
    if (ipfsHash) {
      setIpfsHash('');
    }
  };

  const uploadToIPFS = async () => {
    if (!message.trim()) {
      setError('Please enter a message to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // In a real app, you'd use web3.storage to upload to IPFS
      // For this demo, we'll simulate an IPFS upload with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a fake IPFS hash
      const mockHash = `ipfs://QmX${Math.random().toString(36).substring(2, 15)}`;
      setIpfsHash(mockHash);
      onIpfsHashGenerated(mockHash);
    } catch (err) {
      console.error(err);
      setError('Failed to upload to IPFS. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Add Message</h3>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter a message for your airdrop recipients..."
          className="input-field min-h-[100px]"
        />
        <p className="mt-1 text-xs text-gray-500">
          This message will be stored on IPFS and linked to your airdrop
        </p>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {ipfsHash ? (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800">Message saved to IPFS</p>
          <p className="text-xs text-green-700 break-all mt-1">{ipfsHash}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={uploadToIPFS}
          disabled={isUploading || !message.trim()}
          className={`base-button ${isUploading || !message.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Uploading...' : 'Save Message to IPFS'}
        </button>
      )}
    </div>
  );
} 