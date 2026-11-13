'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle, Ticket, ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import { CultureEvent } from '../types';

interface WaitlistViewProps {
  events: CultureEvent[];
  onOpenEvent: (event: CultureEvent) => void;
  onInstantBook: () => void;
}

export const WaitlistView: React.FC<WaitlistViewProps> = ({ events, onOpenEvent, onInstantBook }) => {
  const [hasOffer, setHasOffer] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(1785); // 29m 45s

  useEffect(() => {
    if (!hasOffer) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [hasOffer]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Info */}
      <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-[4px_4px_0px_#1c1917]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900">
              <Clock className="w-3.5 h-3.5 text-amber-800" />
              <span>취소표 대기 시스템 [W-01 ~ W-09]</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1.5">
              취소표 실시간 대기 현황
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              매진된 회차에 취소표가 발생하면 대기 순번에 따라 30분간 우선 구매권이 부여됩니다.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-stone-500">대기 중인 티켓: 2건</span>
          </div>
        </div>
      </div>

      {/* 30-min Priority Purchase Offer Banner (W-03) */}
      {hasOffer && (
        <div className="bg-[#fffbeb] border-2 border-amber-500 rounded-2xl p-6 shadow-[4px_4px_0px_#1c1917] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-900 text-xs font-black">
                <Bell className="w-3.5 h-3.5" />
                <span>우선 구매권 발급 완료! [W-03]</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                뮤지컬 지킬앤하이드 20주년 — VIP석 취소표 2매
              </h3>
              <p className="text-xs text-stone-600">
                2026.12.06 (토) 14:00 회차 · 1층 B열 14번, 15번 (연석)
              </p>
            </div>

            {/* Live Countdown */}
            <div className="bg-white border-2 border-stone-900 rounded-xl p-3 text-center min-w-[140px] shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">남은 구매 시간</span>
              <span className="text-2xl font-black font-mono text-rose-600 tracking-wider">
                {formatTimer(secondsLeft)}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">초과 시 다음 대기자에게 양도</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200">
            <button
              onClick={onInstantBook}
              className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black shadow-[2px_2px_0px_#ffffff] transition-all flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Ticket className="w-4 h-4" />
              <span>우선 구매권으로 즉시 예매 확정</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (confirm('우선 구매권을 포기하시겠습니까? 다음 대기 순번 고객에게 순서가 넘어갑니다.')) {
                  setHasOffer(false);
                }
              }}
              className="px-4 py-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold transition-all"
            >
              다음 대기자에게 양보하기
            </button>
          </div>
        </div>
      )}

      {/* Active Waitlists Table */}
      <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-[4px_4px_0px_#1c1917] space-y-4">
        <h3 className="font-black text-base text-stone-900 pb-2 border-b border-stone-200">
          내가 신청한 취소표 대기 목록
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-stone-300 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[10px] font-bold">
                공연 · 뮤지컬
              </span>
              <h4 className="font-black text-sm text-stone-900">
                뮤지컬 지킬앤하이드 20주년
              </h4>
              <p className="text-xs text-stone-500">
                신청 회차: 2026.12.06 (토) 14:00 · 희망 등급: VIP석 (최대 2매)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">내 대기 순번</span>
                <span className="text-base font-black font-mono text-emerald-700">1순위 (구매권 발급됨)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 text-[10px] font-bold">
                팝업스토어
              </span>
              <h4 className="font-black text-sm text-stone-900">
                잔망루피 윈터 팝업스토어
              </h4>
              <p className="text-xs text-stone-500">
                신청 회차: 2026.11.15 (토) 15:00 회차 · 성인 2명
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">내 대기 순번</span>
                <span className="text-base font-black font-mono text-stone-900">대기 14번</span>
              </div>
              <button
                onClick={() => alert('취소표 대기 신청이 취소되었습니다.')}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-600 hover:bg-stone-100"
              >
                신청 취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
