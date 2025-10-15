import React, { useEffect, useState } from 'react';
import ICChipLogo from './ICChipLogo';

const AnimatedBackground = ({ variant = 'home' }) => {
  // Avoid SSR/CSR mismatch by rendering random particles only after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (variant === 'home') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating IC Chips */}
        <div className="absolute top-10 left-10 animate-float-slow">
          <ICChipLogo className="h-12 w-12 text-blue-300 opacity-20" />
        </div>
        <div className="absolute top-32 right-20 animate-float-medium">
          <ICChipLogo className="h-8 w-8 text-purple-300 opacity-30" />
        </div>
        <div className="absolute bottom-40 left-32 animate-float-fast">
          <ICChipLogo className="h-10 w-10 text-indigo-300 opacity-25" />
        </div>
        <div className="absolute top-64 left-1/2 animate-float-slow delay-1000">
          <ICChipLogo className="h-14 w-14 text-blue-400 opacity-15" />
        </div>
        <div className="absolute bottom-20 right-40 animate-float-medium delay-2000">
          <ICChipLogo className="h-9 w-9 text-purple-400 opacity-20" />
        </div>
        <div className="absolute top-20 right-1/3 animate-float-fast delay-3000">
          <ICChipLogo className="h-11 w-11 text-indigo-400 opacity-25" />
        </div>

        {/* Circuit Pattern Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300" />
              <circle cx="50" cy="50" r="3" fill="currentColor" className="text-blue-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>

        {/* Animated Particles (client-only to avoid SSR mismatch) */}
        {mounted && (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-indigo-500/15 to-transparent rounded-full blur-2xl animate-pulse-slow delay-4000"></div>
      </div>
    );
  }

  if (variant === 'scanning') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Scanning Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-500 rounded-sm animate-pulse"
                style={{
                  animationDelay: `${(i * 50)}ms`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Technical Elements */}
        <div className="absolute top-16 left-16 animate-spin-slow">
          <div className="w-16 h-16 border-2 border-blue-300 rounded-full opacity-20">
            <div className="w-full h-full border-2 border-green-300 rounded-full animate-spin-reverse">
              <ICChipLogo className="h-8 w-8 m-2 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 right-20 animate-bounce-slow">
          <div className="relative">
            <ICChipLogo className="h-12 w-12 text-green-400 opacity-30" />
            <div className="absolute inset-0 animate-ping">
              <ICChipLogo className="h-12 w-12 text-green-300 opacity-20" />
            </div>
          </div>
        </div>

        {/* Data Flow Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M0,500 Q250,300 500,500 T1000,500"
            fill="none"
            stroke="url(#dataFlow)"
            strokeWidth="2"
            className="text-blue-400 animate-pulse"
          />
          <path
            d="M0,300 Q250,100 500,300 T1000,300"
            fill="none"
            stroke="url(#dataFlow)"
            strokeWidth="1"
            className="text-green-400 animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M0,700 Q250,500 500,700 T1000,700"
            fill="none"
            stroke="url(#dataFlow)"
            strokeWidth="1"
            className="text-purple-400 animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>
    );
  }

  return null;
};

export default AnimatedBackground;
