import React from 'react';
import ICChipLogo from './ICChipLogo';

const ICFeederAnimation = ({ isActive = false }) => {
  return (
    <div className="relative w-full h-48 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
      {/* Feeder Track */}
      <div className="absolute inset-0 flex items-center">
        {/* Track Lines */}
        <div className="w-full h-0.5 bg-gray-400 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-50"></div>
        </div>
      </div>
      
      {/* Moving ICs */}
      {isActive && (
        <>
          {/* IC 1 */}
          <div className="absolute top-1/2 transform -translate-y-1/2">
            <div className="animate-ic-move">
              <ICChipLogo className="h-12 w-12" />
            </div>
          </div>
          
          {/* IC 2 */}
          <div className="absolute top-1/2 transform -translate-y-1/2">
            <div 
              className="animate-ic-move"
              style={{ animationDelay: '1s' }}
            >
              <ICChipLogo className="h-12 w-12" />
            </div>
          </div>
          
          {/* IC 3 */}
          <div className="absolute top-1/2 transform -translate-y-1/2">
            <div 
              className="animate-ic-move"
              style={{ animationDelay: '2s' }}
            >
              <ICChipLogo className="h-12 w-12" />
            </div>
          </div>
          
          {/* IC 4 */}
          <div className="absolute top-1/2 transform -translate-y-1/2">
            <div 
              className="animate-ic-move"
              style={{ animationDelay: '3s' }}
            >
              <ICChipLogo className="h-12 w-12" />
            </div>
          </div>
        </>
      )}
      
      {/* Feeder Mechanism */}
      <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
        <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center ${isActive ? 'animate-spin' : ''}`}>
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Scanner Area */}
      <div className="absolute right-16 top-0 w-20 h-full bg-gradient-to-l from-green-600 to-green-700 flex items-center justify-center">
        <div className={`w-full h-1 bg-green-300 ${isActive ? 'animate-pulse' : ''}`}>
          {isActive && (
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-ping"></div>
          )}
        </div>
      </div>
      
      {/* Sorting Bins */}
      <div className="absolute right-0 top-0 w-16 h-full flex flex-col">
        <div className="flex-1 bg-green-500 flex items-center justify-center text-white text-xs font-bold">
          PASS
        </div>
        <div className="flex-1 bg-red-500 flex items-center justify-center text-white text-xs font-bold">
          FAIL
        </div>
      </div>
      
      {/* Status Indicator */}
      <div className="absolute top-2 left-20 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-xs font-medium text-gray-600">
          {isActive ? 'SCANNING' : 'READY'}
        </span>
      </div>
    </div>
  );
};

export default ICFeederAnimation;
