import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizeMap = {
    sm: { icon: 'h-6 w-6', text: 'text-lg font-bold' },
    md: { icon: 'h-8 w-8', text: 'text-xl font-bold' },
    lg: { icon: 'h-12 w-12', text: 'text-3xl font-extrabold' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        className={`${currentSize.icon} shrink-0 transition-transform duration-300 hover:scale-105`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="infinity-silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#D1D1D6" />
            <stop offset="60%" stopColor="#8E8E93" />
            <stop offset="85%" stopColor="#E5E5EA" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <filter id="infinity-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M 30 50 C 30 36, 46 36, 50 50 C 54 64, 70 64, 70 50 C 70 36, 54 36, 50 50 C 46 64, 30 64, 30 50 Z"
          fill="none"
          stroke="url(#infinity-silver-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#infinity-glow)"
        />
      </svg>
      {showText && (
        <span
          className={`font-heading tracking-widest text-shimmer uppercase ${currentSize.text}`}
        >
          INFINITY
        </span>
      )}
    </div>
  );
};
