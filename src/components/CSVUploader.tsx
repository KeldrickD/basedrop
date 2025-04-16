'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface CSVUploaderProps {
  onRecipientsLoaded: (recipients: string[]) => void;
}

export default function CSVUploader({ onRecipientsLoaded }: CSVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }
      
      setFile(selectedFile);
      processCSV(selectedFile);
    }
  };

  const processCSV = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const content = e.target.result as string;
          const lines = content.split('\n');
          
          // Extract addresses, assuming they are in the first column
          const extractedAddresses: string[] = [];
          
          lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
              // Get first column if CSV has multiple columns
              const columns = trimmedLine.split(',');
              const address = columns[0].trim().replace(/"/g, '');
              
              // Basic Ethereum address validation
              if (address.startsWith('0x') && address.length === 42) {
                extractedAddresses.push(address);
              }
            }
          });
          
          if (extractedAddresses.length === 0) {
            setError('No valid Ethereum addresses found in the CSV');
          } else {
            setAddresses(extractedAddresses);
            onRecipientsLoaded(extractedAddresses);
          }
        }
      } catch (err) {
        setError('Failed to parse CSV file');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 1: Upload Wallet Addresses</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        
        {!file ? (
          <div>
            <p className="mb-4 text-gray-600">Upload a CSV file with wallet addresses.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="base-button"
            >
              Select CSV File
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 font-medium">{file.name}</p>
            <p className="text-sm text-gray-600 mb-4">
              {addresses.length} valid wallet addresses found
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 underline"
              >
                Replace File
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isLoading && <p className="text-sm text-gray-600">Processing file...</p>}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {addresses.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Preview:</h4>
          <div className="bg-gray-100 p-3 rounded-md max-h-32 overflow-y-auto">
            {addresses.slice(0, 5).map((address, i) => (
              <div key={i} className="text-sm font-mono mb-1">
                {address}
              </div>
            ))}
            {addresses.length > 5 && (
              <p className="text-sm text-gray-600">
                + {addresses.length - 5} more addresses
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 