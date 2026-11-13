'use client';

import React from 'react';
import { Ticket, Users, ArrowUp, QrCode, Heart } from 'lucide-react';

interface RightSidebarProps {
  onGoToRecipe: () => void;
  onGoToGroup: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onGoToRecipe,
  onGoToGroup,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="w-60 space-y-4 sticky top-24 self-start select-none">
      
      {/* 1. Cute Mini Ticket Pocket */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1.5">
            <span className="text-base">🎟️</span>
            <span>내 티켓 주머니</span>
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
            D-2
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 text-left">
          <div className="text-xs font-bold text-stone-900 line-clamp-1">
            잔망루피 윈터 팝업
          </div>
          <div className="text-[11px] text-stone-500">
            11.15 (토) 14:00 • VIP C4
          </div>
          <button
            onClick={onGoToRecipe}
            className="w-full mt-2 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all hover:scale-102 active:scale-98 shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR 쏙 꺼내기 🪄</span>
          </button>
        </div>
      </div>

      {/* 2. Cute Buddy Matcher Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1.5">
            <span className="text-base">💌</span>
            <span>동행 짝꿍 찾기</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        </div>

        <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200/80 space-y-1.5 text-left">
          <div className="flex items-center justify-between text-[10px] text-purple-700 font-bold">
            <span>더현대 지브리전</span>
            <span className="font-mono">1/2명</span>
          </div>
          <div className="text-xs font-bold text-stone-900 line-clamp-1">
            주말에 나란히 보실 짝꿍? 🐾
          </div>
          <button
            onClick={onGoToGroup}
            className="w-full py-1.5 rounded-xl bg-purple-200 hover:bg-purple-300 text-purple-950 font-bold text-xs flex items-center justify-center gap-1 transition-all hover:scale-102 active:scale-98"
          >
            <span>손들기! 🙋</span>
          </button>
        </div>
      </div>

      {/* 3. Cute Floating Back-to-Top Button */}
      <button
        onClick={scrollToTop}
        className="w-full py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-102 active:scale-98"
      >
        <span>🍿 맨 위로 슝~</span>
        <ArrowUp className="w-3.5 h-3.5 text-stone-500" />
      </button>

    </aside>
  );
};
