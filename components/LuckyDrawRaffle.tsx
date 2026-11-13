'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Clock, Check, Share2, Flame, Award, Ticket } from 'lucide-react';

interface LuckyDrawRaffleProps {
  onTriggerConfetti?: () => void;
}

export const LuckyDrawRaffle: React.FC<LuckyDrawRaffleProps> = ({ onTriggerConfetti }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 14,
    seconds: 35,
    millis: 9,
  });
  const [isApplied, setIsApplied] = useState(false);
  const [raffleNumber, setRaffleNumber] = useState<string>('');
  const [participantCount, setParticipantCount] = useState(3842);

  // High-frequency live countdown timer (KREAM style)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.millis > 0) {
          return { ...prev, millis: prev.millis - 1 };
        }
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1, millis: 9 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59, millis: 9 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59, millis: 9 };
        }
        return prev;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleApply = () => {
    if (isApplied) return;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setRaffleNumber(`POP-LUCKY-${randomNum}`);
    setIsApplied(true);
    setParticipantCount((prev) => prev + 1);
    onTriggerConfetti?.();
  };

  return (
    <section className="bg-[#fffdf7] border-2 border-stone-900 rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1c1917] relative select-none">
      
      {/* Top Banner Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border-2 border-stone-900 text-xs font-black shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-stone-700" />
            <span>위클리 래플</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>주간 한정 래플</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            11월 14일 추첨 예정인 한정판 굿즈
          </p>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-1.5 bg-stone-950 text-white px-3.5 py-2 rounded-2xl border-2 border-stone-900 shadow-[2px_3px_0px_#1c1917] self-start sm:self-auto font-mono text-xs sm:text-sm font-black">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>응모 마감까지</span>
          <span className="text-amber-400 font-bold ml-1">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Raffle Showcase Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-4 sm:p-6 bg-white rounded-3xl border-2 border-stone-900 shadow-sm">
        
        {/* Left Item Visual Frame */}
        <div className="w-full md:w-64 aspect-square rounded-2xl overflow-hidden border-2 border-stone-900 relative bg-[#fff5f5] flex-shrink-0 group">
          <img
            src="/images/loopy_winter.jpg"
            alt="잔망루피 한정판 팝콘 쿠션"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute top-3 left-3 bg-stone-900 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md font-mono border border-stone-700">
            0원
          </div>
        </div>

        {/* Right Info & Interaction */}
        <div className="flex-1 space-y-4 text-left w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[11px] border border-stone-300">
                추첨 50명
              </span>
              <span className="text-xs text-stone-400 font-medium">에스팩토리 D동</span>
            </div>
            
            <h4 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
              잔망루피 윈터 팝콘 버킷 &amp; 바디필로우 세트
            </h4>
            
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              성수동 현장 팝업 한정 제작 에디션.
            </p>
          </div>

          {/* Pricing & Participation Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2 border-y-2 border-dashed border-stone-200">
            <div>
              <p className="text-[11px] text-stone-400 font-medium">응모 가격</p>
              <p className="text-sm sm:text-base font-black text-stone-900 font-mono">0원</p>
            </div>
            <div>
              <p className="text-[11px] text-stone-400 font-medium">응모자</p>
              <p className="text-sm sm:text-base font-black text-stone-900 font-mono">
                {participantCount.toLocaleString()}명
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] text-stone-400 font-medium">발표일</p>
              <p className="text-sm sm:text-base font-black text-stone-900 font-mono">11.14 10:00</p>
            </div>
          </div>

          {/* Action Row */}
          {!isApplied ? (
            <div className="pt-1">
              <button
                onClick={handleApply}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs sm:text-sm border-2 border-stone-900 shadow-[2px_3px_0px_#1c1917] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4 text-amber-300" />
                <span>래플 응모하기</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-stone-50 border-2 border-stone-900 shadow-sm space-y-1.5 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>응모가 완료되었습니다.</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-300 font-mono text-[11px] font-black">
                  {raffleNumber}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                11월 14일 발표 후 [내 티켓]에서 확인 가능합니다.
              </p>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
