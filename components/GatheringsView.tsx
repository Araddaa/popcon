'use client';

import React, { useState } from 'react';
import { Users, Clock, Calendar, Check, Copy, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { CultureEvent } from '../types';

interface GatheringsViewProps {
  events: CultureEvent[];
  onOpenEvent: (event: CultureEvent) => void;
}

export const GatheringsView: React.FC<GatheringsViewProps> = ({ events, onOpenEvent }) => {
  const [groupTitle, setGroupTitle] = useState('성수 주말 팝업 & 뮤지컬 원정대');
  const [copied, setCopied] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number>(1);

  // M-06: 가능 시간대 7x4 그리드 (월~일 x 오전/낮/오후/저녁)
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const times = ['오전 (10-13)', '낮 (13-17)', '오후 (17-20)', '야간 (20-23)'];

  // Toggle user's free slots (key: `${dayIdx}-${timeIdx}`)
  const [mySlots, setMySlots] = useState<Set<string>>(new Set(['4-2', '4-3', '5-1', '5-2', '5-3', '6-1', '6-2']));

  const toggleSlot = (dIdx: number, tIdx: number) => {
    const key = `${dIdx}-${tIdx}`;
    setMySlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const members = [
    { name: '김민우 (나)', role: '방장', ready: true, avatar: '🥑' },
    { name: '이지우', role: '동행', ready: true, avatar: '🎀' },
    { name: '박서준', role: '동행', ready: true, avatar: '🎸' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://popcon.kr/gatherings/meet-7721');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Info */}
      <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-[4px_4px_0px_#1c1917]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3e8ff] border border-purple-300 text-xs font-bold text-purple-900">
              <Users className="w-3.5 h-3.5 text-purple-800" />
              <span>모임 방 · 언제 볼래? [G-01 ~ G-06]</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1.5">
              {groupTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              친구들과 빈 시간대를 맞추고, 함께 갈 행사와 좌석을 실시간으로 결정하세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-stone-900 text-stone-900 text-xs font-bold shadow-[2px_2px_0px_#1c1917] hover:bg-stone-50 active:translate-x-0.5 active:translate-y-0.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? '초대 링크 복사됨!' : '친구 초대 링크'}</span>
            </button>
          </div>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stone-200">
          <span className="text-xs font-bold text-stone-600">참여 멤버 (3명):</span>
          <div className="flex items-center gap-2">
            {members.map((m) => (
              <span key={m.name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-300 text-xs font-bold text-stone-800">
                <span>{m.avatar}</span>
                <span>{m.name}</span>
                <span className="text-[10px] text-stone-400 font-normal">({m.role})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: M-06 Availability (7x4) + Selected Event Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: 7x4 Availability Matrix */}
        <div className="lg:col-span-2 bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-stone-900">
                내 가능 시간대 체크 [M-06]
              </h3>
              <p className="text-xs text-stone-500">
                가능한 시간대를 클릭하세요. 진한 색일수록 모든 멤버가 가능한 시간대입니다.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
              <span className="inline-block w-3 h-3 bg-stone-100 border border-stone-300 rounded"></span> 불가능
              <span className="inline-block w-3 h-3 bg-emerald-200 border border-emerald-400 rounded"></span> 2명 가능
              <span className="inline-block w-3 h-3 bg-emerald-500 border border-emerald-600 rounded"></span> 전원 가능
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div className="grid grid-cols-8 gap-1.5 text-center text-xs font-bold text-stone-600 pb-2 border-b border-stone-200">
                <div>시간대</div>
                {days.map((d, i) => (
                  <div key={d} className={i >= 5 ? 'text-rose-600' : ''}>{d}</div>
                ))}
              </div>

              <div className="space-y-1.5 mt-2">
                {times.map((tLabel, tIdx) => (
                  <div key={tLabel} className="grid grid-cols-8 gap-1.5 items-center">
                    <div className="text-[11px] font-bold text-stone-500 truncate">{tLabel}</div>
                    {days.map((_, dIdx) => {
                      const isMine = mySlots.has(`${dIdx}-${tIdx}`);
                      // Simulated group overlap
                      const isEveryone = (dIdx === 5 && (tIdx === 1 || tIdx === 2)) || (dIdx === 4 && tIdx === 2);
                      const isPartial = isMine || (dIdx >= 4 && tIdx >= 1);

                      return (
                        <button
                          key={`${dIdx}-${tIdx}`}
                          onClick={() => toggleSlot(dIdx, tIdx)}
                          className={`h-11 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                            isEveryone
                              ? 'bg-emerald-500 text-white border-emerald-700 shadow-2xs'
                              : isPartial
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-300 border-stone-200'
                          }`}
                        >
                          <span>{isEveryone ? '3명' : isPartial ? '2명' : '-'}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#f0fdf4] border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span><strong>추천 확정 시간:</strong> 이번 주 토요일(11.15) 낮 13:00~17:00에 3명 모두 가능합니다!</span>
            </div>
          </div>
        </div>

        {/* Right: Target Event Card for Group Booking */}
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-base text-stone-900 pb-2 border-b border-stone-200">
              함께 갈 행사 선택
            </h3>

            <div className="mt-3 space-y-2">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                    selectedEventId === ev.id
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <img src={ev.imageUrl} alt={ev.title} className="w-12 h-12 rounded-lg object-cover border border-stone-900 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-stone-500">{ev.categoryName}</span>
                    <h4 className="font-black text-xs text-stone-900 truncate">{ev.title}</h4>
                    <span className="text-[11px] font-mono text-stone-600">{ev.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenEvent(selectedEvent)}
            className="w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-stone-800 transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>이 행사로 동행 예매 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
