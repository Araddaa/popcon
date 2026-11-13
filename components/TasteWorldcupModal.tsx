'use client';

import React, { useState } from 'react';
import { X, Trophy, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { CultureEvent } from '../types';

interface TasteWorldcupModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CultureEvent[];
  onOpenEvent: (event: CultureEvent) => void;
}

export const TasteWorldcupModal: React.FC<TasteWorldcupModalProps> = ({
  isOpen,
  onClose,
  events,
  onOpenEvent,
}) => {
  // 16 contenders
  const [roundEvents, setRoundEvents] = useState<CultureEvent[]>(() => events.slice(0, 8)); // 8-gang or 16-gang
  const [currentMatch, setCurrentMatch] = useState<number>(0);
  const [nextRound, setNextRound] = useState<CultureEvent[]>([]);
  const [winner, setWinner] = useState<CultureEvent | null>(null);

  if (!isOpen) return null;

  const contenderA = roundEvents[currentMatch * 2];
  const contenderB = roundEvents[currentMatch * 2 + 1];

  const handleSelect = (chosen: CultureEvent) => {
    const updatedNext = [...nextRound, chosen];
    const totalMatches = roundEvents.length / 2;

    if (currentMatch + 1 < totalMatches) {
      setCurrentMatch(currentMatch + 1);
      setNextRound(updatedNext);
    } else {
      // Round completed
      if (updatedNext.length === 1) {
        // Winner decided
        setWinner(updatedNext[0]);
      } else {
        // Move to next round
        setRoundEvents(updatedNext);
        setCurrentMatch(0);
        setNextRound([]);
      }
    }
  };

  const handleRestart = () => {
    setRoundEvents(events.slice(0, 8));
    setCurrentMatch(0);
    setNextRound([]);
    setWinner(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-2xl bg-white border-2 border-stone-900 rounded-2xl shadow-[6px_6px_0px_#1c1917] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-900 bg-[#faf8f5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold border border-stone-900 shadow-2xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-stone-900 text-base leading-tight">
                팝콘 취향 월드컵 [R-08]
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">
                {winner ? '최종 우승작 선정 완료!' : `${roundEvents.length}강전 · ${currentMatch + 1} / ${roundEvents.length / 2} 매치`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {!winner && contenderA && contenderB ? (
            <div className="space-y-6">
              <div className="text-center">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-300">
                  더 끌리는 문화 행사를 선택해주세요
                </span>
              </div>

              {/* 1 vs 1 Visual Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contender A */}
                <div
                  onClick={() => handleSelect(contenderA)}
                  className="p-4 rounded-xl border-2 border-stone-900 bg-[#fff5f5] hover:bg-[#ffe4e6] cursor-pointer transition-all shadow-[3px_3px_0px_#1c1917] hover:shadow-[5px_5px_0px_#1c1917] flex flex-col justify-between group"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-900 bg-stone-100 mb-3">
                    <img src={contenderA.imageUrl} alt={contenderA.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-300">
                      {contenderA.categoryName} · {contenderA.location}
                    </span>
                    <h3 className="font-black text-sm text-stone-900 mt-1 line-clamp-1">
                      {contenderA.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {contenderA.desc}
                    </p>
                  </div>
                  <button className="mt-4 w-full py-2.5 rounded-lg bg-stone-900 text-white text-xs font-black group-hover:bg-rose-600 transition-colors">
                    이 행사 선택하기
                  </button>
                </div>

                {/* Contender B */}
                <div
                  onClick={() => handleSelect(contenderB)}
                  className="p-4 rounded-xl border-2 border-stone-900 bg-[#f0fdf4] hover:bg-[#dcfce7] cursor-pointer transition-all shadow-[3px_3px_0px_#1c1917] hover:shadow-[5px_5px_0px_#1c1917] flex flex-col justify-between group"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-900 bg-stone-100 mb-3">
                    <img src={contenderB.imageUrl} alt={contenderB.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-300">
                      {contenderB.categoryName} · {contenderB.location}
                    </span>
                    <h3 className="font-black text-sm text-stone-900 mt-1 line-clamp-1">
                      {contenderB.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {contenderB.desc}
                    </p>
                  </div>
                  <button className="mt-4 w-full py-2.5 rounded-lg bg-stone-900 text-white text-xs font-black group-hover:bg-emerald-600 transition-colors">
                    이 행사 선택하기
                  </button>
                </div>
              </div>
            </div>
          ) : winner ? (
            /* Winner Screen [R-09] */
            <div className="text-center py-6 space-y-4">
              <div className="inline-block p-3 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-2xl animate-bounce">
                👑
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                나의 원픽 문화 행사!
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                취향 분석 결과, <strong>{winner.categoryName}</strong> 및 <strong>{winner.location}</strong> 지역 행사에 가장 높은 선호도를 보였습니다.
              </p>

              <div className="max-w-sm mx-auto p-4 rounded-xl border-2 border-stone-900 bg-stone-50 shadow-[4px_4px_0px_#1c1917] text-left">
                <img src={winner.imageUrl} alt={winner.title} className="w-full aspect-[16/9] object-cover rounded-lg border border-stone-900" />
                <div className="mt-3 space-y-1">
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {winner.categoryName}
                  </span>
                  <h4 className="font-black text-base text-stone-900">{winner.title}</h4>
                  <p className="text-xs text-stone-600">{winner.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenEvent(winner);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-black hover:bg-stone-800"
                >
                  우승 행사 예매하러 가기
                </button>
                <button
                  onClick={handleRestart}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold hover:bg-stone-100 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 다시 하기
                </button>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
