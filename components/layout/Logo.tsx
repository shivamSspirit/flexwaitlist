import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
  const sizeMap = {
    sm: { height: 32, fontSize: 'text-xl' },
    md: { height: 44, fontSize: 'text-2xl' },
    lg: { height: 64, fontSize: 'text-4xl' },
  };

  const { height, fontSize } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/flexit-logo.svg"
        alt="FlexIt Logo"
        width={height}
        height={height}
        className="object-contain"
        priority
      />
      {showText && (
        <span
          className={`font-black ${fontSize} bg-gradient-to-r from-accent-green via-accent-cyan to-accent-purple bg-clip-text text-transparent tracking-tighter`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          FlexIt
        </span>
      )}
    </div>
  );
};
