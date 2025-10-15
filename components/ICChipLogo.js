import React from 'react';

const ICChipLogo = ({ className = "h-16 w-16", animate = false }) => {
  return (
    <div className={`relative ${className} ${animate ? 'animate-pulse' : ''}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main chip body */}
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="4"
          fill="currentColor"
          className="text-blue-600"
        />
        
        {/* Inner circuit pattern */}
        <rect
          x="30"
          y="30"
          width="40"
          height="40"
          rx="2"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        
        {/* Circuit lines */}
        <g stroke="white" strokeWidth="1" fill="none">
          <line x1="35" y1="40" x2="65" y2="40" />
          <line x1="35" y1="50" x2="65" y2="50" />
          <line x1="35" y1="60" x2="65" y2="60" />
          <line x1="40" y1="35" x2="40" y2="65" />
          <line x1="50" y1="35" x2="50" y2="65" />
          <line x1="60" y1="35" x2="60" y2="65" />
        </g>
        
        {/* Corner dots */}
        <circle cx="35" cy="35" r="1.5" fill="white" />
        <circle cx="65" cy="35" r="1.5" fill="white" />
        <circle cx="35" cy="65" r="1.5" fill="white" />
        <circle cx="65" cy="65" r="1.5" fill="white" />
        
        {/* Pins - Left side */}
        <g fill="currentColor" className="text-gray-600">
          <rect x="10" y="25" width="10" height="3" rx="1" />
          <rect x="10" y="35" width="10" height="3" rx="1" />
          <rect x="10" y="45" width="10" height="3" rx="1" />
          <rect x="10" y="55" width="10" height="3" rx="1" />
          <rect x="10" y="65" width="10" height="3" rx="1" />
        </g>
        
        {/* Pins - Right side */}
        <g fill="currentColor" className="text-gray-600">
          <rect x="80" y="25" width="10" height="3" rx="1" />
          <rect x="80" y="35" width="10" height="3" rx="1" />
          <rect x="80" y="45" width="10" height="3" rx="1" />
          <rect x="80" y="55" width="10" height="3" rx="1" />
          <rect x="80" y="65" width="10" height="3" rx="1" />
        </g>
        
        {/* Pins - Top side */}
        <g fill="currentColor" className="text-gray-600">
          <rect x="25" y="10" width="3" height="10" rx="1" />
          <rect x="35" y="10" width="3" height="10" rx="1" />
          <rect x="45" y="10" width="3" height="10" rx="1" />
          <rect x="55" y="10" width="3" height="10" rx="1" />
          <rect x="65" y="10" width="3" height="10" rx="1" />
        </g>
        
        {/* Pins - Bottom side */}
        <g fill="currentColor" className="text-gray-600">
          <rect x="25" y="80" width="3" height="10" rx="1" />
          <rect x="35" y="80" width="3" height="10" rx="1" />
          <rect x="45" y="80" width="3" height="10" rx="1" />
          <rect x="55" y="80" width="3" height="10" rx="1" />
          <rect x="65" y="80" width="3" height="10" rx="1" />
        </g>
        
        {/* Center highlight */}
        <circle cx="50" cy="50" r="3" fill="white" opacity="0.8" />
      </svg>
      
      {/* Animated glow effect */}
      {animate && (
        <div className="absolute inset-0 bg-blue-400 rounded-lg blur-md opacity-20 animate-ping"></div>
      )}
    </div>
  );
};

export default ICChipLogo;
