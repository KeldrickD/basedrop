'use client';

import React, { useState, useEffect, useCallback, DragEvent, ChangeEvent } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CSVPreviewProps {
  onFileLoaded?: (file: File, data: string[][]) => void;
}

const CSVPreview: React.FC<CSVPreviewProps> = ({ onFileLoaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  // Process CSV and extract preview data
  const processCSV = useCallback((csvText: string) => {
    try {
      const lines = csvText.split(/\r\n|\n/);
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);
      
      if (nonEmptyLines.length === 0) {
        setError('CSV file appears to be empty');
        return [];
      }
      
      // Parse CSV into array of arrays
      const parsedData = nonEmptyLines.map(line => {
        // Handle quoted values with commas inside
        let inQuote = false;
        let currentField = '';
        const fields = [];
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuote = !inQuote;
          } else if (char === ',' && !inQuote) {
            fields.push(currentField);
            currentField = '';
          } else {
            currentField += char;
          }
        }
        
        // Push the last field
        fields.push(currentField);
        return fields;
      });
      
      // Limit to header + 5 rows for preview
      const previewData = parsedData.slice(0, Math.min(6, parsedData.length));
      return previewData;
    } catch (e) {
      console.error('Error parsing CSV:', e);
      setError('Error parsing CSV file');
      return [];
    }
  }, []);

  // Handle file selection
  const handleFileChange = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const csvText = event.target.result as string;
        const parsedData = processCSV(csvText);
        setPreview(parsedData);
        
        if (onFileLoaded && parsedData.length > 0) {
          onFileLoaded(selectedFile, parsedData);
        }
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsText(selectedFile);
  }, [processCSV, onFileLoaded]);

  // Handle file input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      handleFileChange(selectedFile);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      
      // Validate file type
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        setError('Please drop a CSV file');
        return;
      }
      
      handleFileChange(droppedFile);
    }
  }, [handleFileChange]);

  return (
    <div className="w-full">
      {/* File Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-[var(--color-primary)] shadow-[var(--glow-primary)] bg-[var(--color-primary)]/10' 
            : 'border-[var(--color-primary)]/50 hover:border-[var(--color-primary)] bg-[var(--color-primary)]/5 hover:shadow-[var(--glow-subtle)]'
          }
          focus-within:border-[var(--color-primary)] focus-within:shadow-[var(--glow-subtle)]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        onKeyDown={(e) => { 
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('file-upload')?.click();
          }
        }}
        role="button"
        aria-label="Drop CSV file here or press Enter to browse files"
      >
        {file ? (
          <div className="flex flex-col items-center">
            <span className="material-icons text-[var(--color-primary)] text-3xl mb-2">description</span>
            <p className="text-xl mb-2 font-['Roboto_Mono',monospace] text-[var(--color-text-primary)]">
              {file.name}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {(file.size / 1024).toFixed(1)} KB · Uploaded
            </p>
            <button 
              className="mt-4 text-[var(--color-accent-pink)] hover:text-[var(--color-accent-purple)] text-sm"
              onClick={() => {
                setFile(null);
                setPreview([]);
              }}
            >
              Remove and upload different file
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
        
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept=".csv" 
          onChange={handleInputChange}
          aria-label="Upload CSV file"
        />
        
        {error && (
          <div className="mt-4 text-[var(--color-accent-pink)] text-sm">
            {error}
          </div>
        )}
      </div>
      
      {/* CSV Preview Table */}
      {preview.length > 0 && (
        <div className="mt-6 overflow-x-auto bg-[var(--color-surface)] rounded-lg border border-[var(--color-primary)]/30 p-4 shadow-[var(--glow-subtle)]">
          <h3 className="text-sm font-['Rajdhani',sans-serif] font-bold mb-3 text-[var(--color-primary)]">
            CSV PREVIEW
          </h3>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--color-primary)]/10">
                  {preview[0]?.map((header, i) => (
                    <th key={i} className="p-2 text-left text-[var(--color-primary)] font-['Roboto_Mono',monospace] whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 
                    ? 'bg-[var(--color-surface)]' 
                    : 'bg-[var(--color-surface-dark)]'
                  }>
                    {row.map((cell, j) => (
                      <td key={j} className="p-2 text-[var(--color-text-secondary)] font-['Roboto_Mono',monospace] whitespace-nowrap border-b border-[var(--color-primary)]/10">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-right text-[var(--color-text-secondary)]">
            Showing {Math.min(5, preview.length - 1)} of {file ? file.name.split('\n').length - 1 : 0} rows
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVPreview; 