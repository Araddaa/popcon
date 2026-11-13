'use client';

import React, { useState } from 'react';
import { X, Sparkles, MessageCircle } from 'lucide-react';

interface PopconyMascotProps {
  onTriggerConfetti?: () => void;
}

export const PopconyMascot: React.FC<PopconyMascotProps> = ({ onTriggerConfetti }) => {
  const [tipIdx, setTipIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const tips = [
    '🍿 팝코니 TIP: 성수동 오늘 맑음! 잔망루피 팝업 포토존은 자연광 쏟아지는 오후 2시가 젤 예뻐요 ✨',
    '🌧️ 비 오는 날엔 6m 대형 스크린 모네 미디어아트(그라운드시소)로 실내 데이트 추천!',
    '👥 친구랑 따로따로 결제할 땐 상단 [동행] 기능으로 나란히 좌석을 선점하세요!',
    '🎲 이번 주 0원 래플! 잔망루피 한정 바디필로우 응모 마감 D-2예요. 놓치지 마세요!',
    '📸 인생네컷 팝업 인증샷을 등록하면 100% 팝콘 굿즈팩을 드려요 🎟️',
  ];

  const nextTip = () => {
    setTipIdx((prev) => (prev + 1) % tips.length);
    onTriggerConfetti?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none group">
      
      {/* Speech Bubble */}
      {!isMinimized && (
        <div
          onClick={nextTip}
          className="mb-2 max-w-[260px] sm:max-w-[280px] bg-white border-2 border-stone-900 rounded-2xl p-3 shadow-[4px_4px_0px_#1c1917] text-left cursor-pointer hover:bg-amber-50/50 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 relative"
        >
          {/* Close mini button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-800 text-stone-600 flex items-center justify-center text-[10px] font-bold"
            title="말풍선 접기"
          >
            ✕
          </button>

          <p className="text-xs font-black text-stone-900 leading-snug">
            {tips[tipIdx]}
          </p>

          <div className="flex items-center justify-between text-[10px] text-amber-800 font-bold mt-1.5 pt-1 border-t border-dashed border-stone-200">
            <span>👆 클릭하면 다른 꿀팁!</span>
            <span className="font-mono">#{tipIdx + 1}/5</span>
          </div>

          {/* Speech bubble tail pointing down-right */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r-2 border-b-2 border-stone-900 transform rotate-45" />
        </div>
      )}

      {/* Mascot Button */}
      <div className="flex items-center gap-2">
        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="px-2.5 py-1 rounded-full bg-white border-2 border-stone-900 text-[11px] font-black text-stone-900 shadow-[2px_2px_0px_#1c1917] hover:bg-amber-100 transition-all"
          >
            🍿 팝코니 꿀팁 보기
          </button>
        )}

        <button
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false);
            } else {
              nextTip();
            }
          }}
          title="성수동 팝업 마스코트 팝코니"
          className="w-14 h-14 rounded-full bg-[#fef9c3] hover:bg-amber-200 border-2 border-stone-900 shadow-[3px_4px_0px_#1c1917] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center text-2xl transition-all hover:scale-110 relative"
        >
          <span className="animate-bounce">🍿</span>
          
          {/* Mini Sparkle Ping */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
        </button>
      </div>

    </div>
  );
};
