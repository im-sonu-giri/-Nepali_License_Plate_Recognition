import { FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

const Results = ({ originalImage, recognizedText, confidence }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recognizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg">Recognition Results</h3>
      </div>
      
      <div className="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Original Image</h4>
          <img 
            src={originalImage} 
            alt="License plate" 
            className="rounded-md border border-gray-200 dark:border-gray-700 max-h-48"
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Recognized Text</h4>
          <div className="relative">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <p className="text-2xl font-mono text-center">
                {recognizedText || 'No text recognized'}
              </p>
            </div>
            {recognizedText && (
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-1 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                title="Copy to clipboard"
              >
                {copied ? (
                  <FiCheck className="text-green-500" />
                ) : (
                  <FiCopy className="text-gray-600 dark:text-gray-300" />
                )}
              </button>
            )}
          </div>
          
          {confidence && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Confidence Score</h4>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round(confidence * 100)}% confidence
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;