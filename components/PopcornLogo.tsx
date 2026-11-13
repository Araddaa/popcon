'use client';

import React from 'react';

interface PopconLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const PopcornLogo: React.FC<PopconLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 
        Cute Popcorn Character Vector (귀여운 팝콘 요정 마스코트)
        - Smiling face with blush cheeks (발그레한 볼)
        - Cute popcorn shape popping from bucket
        - Pastel colors (No gradients): Butter yellow #fef08a, Pastel pink bucket #ffe4e6, Rose #f43f5e
      */}
      <div className={`${iconSizes[size]} relative flex-shrink-0 transition-transform hover:scale-110 active:scale-95 duration-200 cursor-pointer`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Soft Butter Base Tile */}
          <rect width="64" height="64" rx="20" fill="#fef9c3" />

          {/* Cute Bucket (Pastel Rose with soft stripes) */}
          <path
            d="M18 35L22 55C22.2 56 23.1 56.8 24.2 56.8H39.8C40.9 56.8 41.8 56 42 55L46 35H18Z"
            fill="#ffe4e6"
            stroke="#fb7185"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M26 36L27.5 55.5" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
          <path d="M38 36L36.5 55.5" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />

          {/* Popcorn Fluffy Head (Solid Butter Yellow) */}
          <path
            d="M32 15C28 15 25 18 25 22C25 22.8 25.2 23.6 25.5 24.3C23.5 25.3 22 27.4 22 30C22 33.9 25.1 37 29 37H35C38.9 37 42 33.9 42 30C42 27.4 40.5 25.3 38.5 24.3C38.8 23.6 39 22.8 39 22C39 18 36 15 32 15Z"
            fill="#fef08a"
            stroke="#b45309"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="26" r="4.5" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
          <circle cx="43" cy="26" r="4.5" fill="#fde68a" stroke="#b45309" strokeWidth="2" />

          {/* Cute Eyes (Happy curved eyes ^ ^) */}
          <circle cx="28.5" cy="26" r="1.8" fill="#1c1917" />
          <circle cx="35.5" cy="26" r="1.8" fill="#1c1917" />

          {/* Cute Smile */}
          <path
            d="M30 29.5C31 31 33 31 34 29.5"
            stroke="#1c1917"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Rosy Blush Cheeks (볼터치) */}
          <ellipse cx="26" cy="28.5" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="38" cy="28.5" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />

          {/* Cute Twinkling Sparkle */}
          <path
            d="M48 11L49 13.5L51.5 14.5L49 15.5L48 18L47 15.5L44.5 14.5L47 13.5L48 11Z"
            fill="#fb7185"
          />
        </svg>
      </div>

      {/* Brand Wordmark Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-stone-900 leading-none ${textSizes[size]}`}>
              팝콘
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 tracking-wider">
              pop-con
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-semibold tracking-tight mt-0.5">
            POP &amp; CONNECT ✨
          </span>
        </div>
      )}
    </div>
  );
};
