'use client';

import React from 'react';
import { Armchair, ArrowRight, ShieldCheck, Users } from 'lucide-react';

interface MusicalSeatShowcaseProps {
  onOpenSeatBooking: () => void;
}

export const MusicalSeatShowcase: React.FC<MusicalSeatShowcaseProps> = ({
  onOpenSeatBooking,
}) => {
  return (
    <section className="bg-[#faf5ff] text-stone-900 border-2 border-stone-900 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#1c1917] relative select-none">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="space-y-2.5 text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3e8ff] text-purple-900 border border-purple-300 text-xs font-black">
            <Armchair className="w-3.5 h-3.5 text-purple-800" />
            <span>공연장 공식 좌석배치도 연동 [T-06]</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            대극장 전석 지정좌석 &amp; 2인 동행 연석 예매
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
            친구와 나란히 앉을 자리를 실시간으로 함께 고르고, 결제는 각자 카드로 나누어 진행할 수 있습니다.
            VIP석, R석, S석 등급별 시야각과 음향 최적석을 바로 확인하세요.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 font-bold">
              👑 VIP석 1층 중앙 블록
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 font-bold">
              👥 2인 동행 실시간 연석 선점
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 font-bold">
              💳 각자 분할 결제
            </span>
          </div>
        </div>

        {/* Right CTA Box */}
        <div className="flex flex-col items-stretch sm:items-end gap-2.5 w-full md:w-auto">
          <button
            onClick={onOpenSeatBooking}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-sm border-2 border-stone-900 shadow-[2px_2px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <span>좌석배치도 열기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-stone-500 font-mono text-center sm:text-right">
            지킬앤하이드 잔여석 실시간 조회
          </span>
        </div>

      </div>
    </section>
  );
};
