'use client';

import React, { useState } from 'react';
import { CultureEvent } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Ticket, MapPin, Clock } from 'lucide-react';

interface CalendarViewProps {
  events: CultureEvent[];
  onOpenEvent: (event: CultureEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onOpenEvent }) => {
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [currentMonth, setCurrentMonth] = useState<string>('2026.11');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  // 6 Categories filter
  const categories = [
    { id: 'all', label: '전체' },
    { id: 'performance', label: '공연' },
    { id: 'movie', label: '영화' },
    { id: 'exhibition', label: '전시' },
    { id: 'popup', label: '팝업스토어' },
    { id: 'collab_cafe', label: '콜라보카페' },
    { id: 'festival', label: '축제' },
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedCat !== 'all' && e.category !== selectedCat) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Calendar Header Card */}
      <div className="bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_#1c1917]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-xs font-bold text-stone-800">
              <CalIcon className="w-3.5 h-3.5 text-stone-700" />
              <span>일정 캘린더 [C-04]</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1.5">
              날짜별 문화 일정 모아보기
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              오픈일, 관람 마감일, 주말 특별 회차를 캘린더에서 한눈에 확인하세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth('2026.11')}
              className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100"
              aria-label="이전 달"
            >
              <ChevronLeft className="w-4 h-4 text-stone-700" />
            </button>
            <span className="font-mono font-black text-base px-2">{currentMonth}</span>
            <button
              onClick={() => setCurrentMonth('2026.12')}
              className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100"
              aria-label="다음 달"
            >
              <ChevronRight className="w-4 h-4 text-stone-700" />
            </button>
          </div>
        </div>

        {/* Category Pills inside Calendar */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-stone-200 overflow-x-auto scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                selectedCat === c.id
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid & Selected Day Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Monthly Grid */}
        <div className="lg:col-span-2 bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_#1c1917]">
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-stone-400 pb-2 border-b border-stone-100">
            {daysOfWeek.map((d, i) => (
              <div key={d} className={i === 0 ? 'text-rose-500' : i === 6 ? 'text-blue-500' : ''}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 mt-2">
            {/* Empty offset for Sunday start Nov 2026 starts on Sun */}
            {daysInMonth.map((day) => {
              const isSelected = selectedDay === day;
              const hasEvents = [14, 15, 18, 20, 22, 24, 25, 28].includes(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-16 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                  }`}
                >
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-white' : ''}`}>
                    {day}
                  </span>

                  {hasEvents && (
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-rose-500'}`} />
                      <span className={`text-[10px] font-mono font-bold truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {day === 14 ? '루피오픈' : day === 20 ? '영화제' : '회차'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Events */}
        <div className="bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-stone-900">11월 {selectedDay}일</span>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  추천 일정
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-stone-600">
                {filteredEvents.length}개 행사
              </span>
            </div>

            <div className="divide-y divide-stone-100 mt-2 max-h-[360px] overflow-y-auto space-y-1">
              {filteredEvents.slice(0, 4).map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onOpenEvent(ev)}
                  className="py-2.5 hover:bg-stone-50 rounded-lg p-2 cursor-pointer transition-colors group space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border border-stone-900"
                      style={{ backgroundColor: ev.badgeBg, color: ev.badgeText }}
                    >
                      {ev.categoryName}
                    </span>
                    <span className="text-stone-500 font-mono text-[11px]">{ev.price}</span>
                  </div>

                  <h4 className="font-black text-xs sm:text-sm text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {ev.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin className="w-3 h-3 text-stone-400" /> {ev.spot}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onOpenEvent(filteredEvents[0])}
            className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-black flex items-center justify-center gap-1.5 hover:bg-stone-800 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>이 날짜 일정 바로 예매</span>
          </button>
        </div>

      </div>
    </div>
  );
};
