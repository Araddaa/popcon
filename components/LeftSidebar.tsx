'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Zap, Check } from 'lucide-react';

interface LeftSidebarProps {
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  onOpenEvent: (id: number) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedLocation,
  onSelectLocation,
  onOpenEvent,
}) => {
  const [stamped, setStamped] = useState(false);

  const cuteHotspots = [
    { name: '성수/서울숲', filterVal: '성수', emoji: '🍓', count: 18, color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { name: '더현대 서울', filterVal: '더현대', emoji: '🍇', count: 12, color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { name: '홍대/연남', filterVal: '홍대', emoji: '🍊', count: 9, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { name: '한남/이태원', filterVal: '한남', emoji: '🥑', count: 7, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ];

  return (
    <aside className="w-56 space-y-4 sticky top-24 self-start select-none">
      
      {/* 1. Cute Hotspot Pill Navigator */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
          <span className="text-base">📍</span>
          <span>어디로 놀러갈까요?</span>
        </div>

        <div className="space-y-1.5">
          {cuteHotspots.map((h) => {
            const isSelected = selectedLocation === h.filterVal;
            return (
              <button
                key={h.name}
                onClick={() => onSelectLocation(isSelected ? '' : h.filterVal)}
                className={`w-full px-3 py-2 rounded-2xl text-xs font-bold flex items-center justify-between transition-all hover:scale-102 active:scale-98 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : `${h.color} border`
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{h.emoji}</span>
                  <span>{h.name}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">{h.count}곳</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Concise Cute Cancellation Alert */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1">
            <span className="text-base">⚡</span>
            <span>취소표 톡!</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        </div>

        <div
          onClick={() => onOpenEvent(1)}
          className="p-3 rounded-2xl bg-rose-50 border border-rose-200 cursor-pointer hover:bg-rose-100 transition-all text-left space-y-1"
        >
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-rose-700">방금 발생 ✨</span>
            <span className="text-stone-400 font-mono">1석 남음</span>
          </div>
          <div className="text-xs font-bold text-stone-900 line-clamp-1">
            잔망루피 VIP 1석 뿅!
          </div>
          <div className="text-[10px] text-rose-600 font-semibold">
            누르면 바로 예매하기 →
          </div>
        </div>
      </div>

      {/* 3. Cute Attendance Stamp Widget */}
      <div className="bg-[#fef9c3] border border-amber-200 rounded-3xl p-4 shadow-xs text-center space-y-2">
        <div className="text-xs font-extrabold text-amber-900 flex items-center justify-center gap-1">
          <span>🍿 매일 출석 도장 콩!</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-snug">
          오늘 도장 찍고 <br />
          <strong className="text-amber-950 font-bold">팝콘알 3개</strong> 모았어요!
        </p>
        <button
          onClick={() => setStamped(true)}
          disabled={stamped}
          className={`w-full py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
            stamped
              ? 'bg-amber-200 text-amber-800 cursor-default'
              : 'bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 hover:scale-105 active:scale-95'
          }`}
        >
          {stamped ? '출석 완료! 🌽' : '오늘 도장 콕! 🐾'}
        </button>
      </div>

    </aside>
  );
};
