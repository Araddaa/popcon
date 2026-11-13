'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Users, Gift, Camera, ChevronRight } from 'lucide-react';

interface LiveMarqueeProps {
  onOpenEvent: (id: number) => void;
  onOpenRaffle: () => void;
  onOpenPhotobooth: () => void;
}

export const LiveMarquee: React.FC<LiveMarqueeProps> = ({
  onOpenEvent,
  onOpenRaffle,
  onOpenPhotobooth,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const tickerItems = [
    {
      id: 1,
      type: 'hype',
      badge: '🔥 LIVE 성수',
      badgeColor: 'bg-rose-500 text-white',
      text: '성수 에스팩토리 [잔망루피 팝업] 실시간 대기 42팀 돌파 · 오후 현장 접수 진행 중!',
      actionLabel: '실시간 예약 보기',
      action: () => onOpenEvent(1),
    },
    {
      id: 2,
      type: 'match',
      badge: '⚡ 방금 매칭',
      badgeColor: 'bg-purple-600 text-white',
      text: '김*우 님이 [지브리 비하인드전] 2인 동행 예매 완료! (나란히 앉기 성공)',
      actionLabel: '동행 예매 알아보기',
      action: () => onOpenEvent(5),
    },
    {
      id: 3,
      type: 'raffle',
      badge: '🎁 0원 래플',
      badgeColor: 'bg-amber-500 text-stone-900',
      text: '한정판 [잔망루피 대형 팝콘 바디필로우] 0원 래플 응모 마감 D-2!',
      actionLabel: '0원 응모하기',
      action: () => onOpenRaffle(),
    },
    {
      id: 4,
      type: 'photo',
      badge: '📸 인생네컷',
      badgeColor: 'bg-stone-900 text-yellow-300',
      text: '오늘 성수 팝콘 포토부스에 142장의 현장 인생네컷 인증샷이 등록되었어요!',
      actionLabel: '네컷 갤러리 보기',
      action: () => onOpenPhotobooth(),
    },
  ];

  // Rotate ticker item every 4.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % tickerItems.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  const active = tickerItems[currentIdx];

  return (
    <div className="w-full bg-stone-950 text-white border-y border-stone-800 py-2 sm:py-2.5 px-4 overflow-hidden relative select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-[13px]">
        
        {/* Left Live Indicator & Ticker Text */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Pulsing Live Dot */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          </div>

          {/* Badge */}
          <span className={`px-2 py-0.5 rounded-md font-black text-[11px] tracking-tight flex-shrink-0 font-mono shadow-xs ${active.badgeColor}`}>
            {active.badge}
          </span>

          {/* Rolling Headline */}
          <div
            key={active.id}
            onClick={active.action}
            className="truncate font-semibold text-stone-200 hover:text-amber-300 cursor-pointer transition-all animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            {active.text}
          </div>
        </div>

        {/* Right CTA Action Pill */}
        <button
          onClick={active.action}
          className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs transition-all border border-stone-700 flex-shrink-0 group"
        >
          <span>{active.actionLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
};
