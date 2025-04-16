'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">BaseDrop</h1>
        </div>
        
        <div>
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
              </div>
              <button 
                onClick={() => disconnect()}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={() => connect()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition duration-200"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
} 