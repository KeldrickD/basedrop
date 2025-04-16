'use client';

interface AirdropSummaryProps {
  recipients: string[];
  token: {
    type: 'ERC20' | 'ERC721' | null;
    address: string;
    amount?: string;
    tokenIds?: string[];
  };
  messageUri: string;
  txHash: string;
  onCreateNew: () => void;
}

export default function AirdropSummary({
  recipients,
  token,
  messageUri,
  txHash,
  onCreateNew
}: AirdropSummaryProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Airdrop Successful!</h2>
        <p className="text-gray-600 mt-2">Your tokens have been airdropped to {recipients.length} recipients.</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-500">TRANSACTION HASH</h3>
          <p className="font-mono text-sm break-all">{txHash}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">TOKEN TYPE</h3>
          <p>{token.type === 'ERC20' ? 'ERC20 Token' : 'ERC721 NFT'}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">TOKEN ADDRESS</h3>
          <p className="font-mono text-sm break-all">{token.address}</p>
        </div>
        
        {token.type === 'ERC20' && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">AMOUNT PER RECIPIENT</h3>
            <p>{token.amount}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">MESSAGE URI</h3>
          <p className="font-mono text-sm break-all">{messageUri}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <a 
          href={`https://basescan.org/tx/${txHash}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block text-center text-blue-600 hover:text-blue-800 underline"
        >
          View on BaseScan
        </a>
        
        <button
          type="button"
          onClick={onCreateNew}
          className="base-button w-full"
        >
          Create New Airdrop
        </button>
      </div>
    </div>
  );
} 