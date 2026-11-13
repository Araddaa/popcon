'use client';

import React, { useState } from 'react';
import { CultureEvent } from '../types';
import { EventCard } from './EventCard';
import { MapPin, Navigation, Compass, Footprints, Clock, Sparkles } from 'lucide-react';

interface NearbyViewProps {
  events: CultureEvent[];
  onOpenEvent: (event: CultureEvent) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onGoToGroupBooking: (event: CultureEvent) => void;
}

export const NearbyView: React.FC<NearbyViewProps> = ({
  events,
  onOpenEvent,
  wishlist,
  onToggleWishlist,
  onGoToGroupBooking,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<string>('성수');

  const spots = [
    { id: '성수', name: '성수동 / 서울숲', emoji: '🍓', count: 4, desc: '에스팩토리, 그라운드시소, 연무장길' },
    { id: '더현대', name: '더현대 서울', emoji: '🏬', count: 2, desc: '여의도 6F ALT.1 및 지하 2층 팝업' },
    { id: '홍대', name: '홍대 / 연남', emoji: '🍊', count: 2, desc: '상상마당 시네마, 와우산로 인디홀' },
    { id: '한남', name: '한남 / 이태원', emoji: '🥑', count: 1, desc: '한남 플래그십 쇼룸' },
  ];

  // Walking distance helper per event
  const getWalkingDistance = (ev: CultureEvent): string => {
    if (ev.location.includes('성수')) {
      if (ev.id === 1) return '도보 3분 (240m)';
      if (ev.id === 2) return '도보 7분 (510m)';
      return '도보 11분 (820m)';
    }
    if (ev.location.includes('더현대')) return '지하철 15분';
    if (ev.location.includes('홍대')) return '지하철 22분';
    return '차량 20분';
  };

  const filteredEvents = events.filter((e) => e.location.includes(selectedSpot));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Location Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>실시간 위치 기반 추천</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-2">
              내 주변 핫플 팝업 &amp; 컬처
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              현재 계신 곳에서 가장 가깝고 웨이팅이 적은 팝업을 골라보세요.
            </p>
          </div>

          {/* Current GPS simulation badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 self-start sm:self-auto">
            <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
            <div className="text-xs">
              <div className="font-extrabold">서울 성동구 성수동 2가</div>
              <div className="text-[10px] text-emerald-700">도보 15분 반경 탐색 중</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotspot Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {spots.map((s) => {
          const isSelected = selectedSpot === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSpot(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-md scale-105'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'
              }`}>
                {s.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cute Interactive Radar Map Card */}
      <div className="bg-[#f0fdf4] border border-emerald-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
          <div className="flex items-center gap-1.5">
            <Footprints className="w-4 h-4 text-emerald-700" />
            <span>성수동 팝업 산책 코스 레이더</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono">GPS 실시간 갱신됨</span>
        </div>

        {/* Cute Pin Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div 
            onClick={() => onOpenEvent(events[0])}
            className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs hover:shadow-sm cursor-pointer transition-all hover:scale-102 text-left space-y-1"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-rose-600">🍓 잔망루피 윈터 팝업</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">도보 3분</span>
            </div>
            <div className="text-xs text-stone-600">성수동 에스팩토리 D동 (240m)</div>
            <div className="text-[10px] text-stone-400">실시간 대기 42팀 · 래플 응모중</div>
          </div>

          <div 
            onClick={() => onOpenEvent(events[1])}
            className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs hover:shadow-sm cursor-pointer transition-all hover:scale-102 text-left space-y-1"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-emerald-700">🎨 모네 미디어아트</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">도보 7분</span>
            </div>
            <div className="text-xs text-stone-600">그라운드시소 성수 (510m)</div>
            <div className="text-[10px] text-stone-400">얼리버드 30% · 바로 입장 가능</div>
          </div>

          <div 
            onClick={() => onOpenEvent(events[3])}
            className="p-3.5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs hover:shadow-sm cursor-pointer transition-all hover:scale-102 text-left space-y-1"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-sky-700">🕶️ 젠틀몬스터 팝업</span>
              <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">도보 11분</span>
            </div>
            <div className="text-xs text-stone-600">성수 연무장길 플래그십 (820m)</div>
            <div className="text-[10px] text-stone-400">현장 대기 등록 가능</div>
          </div>
        </div>
      </div>

      {/* Events List for this Spot */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-1.5">
          <span>{spots.find(s => s.id === selectedSpot)?.name}의 팝업</span>
          <span className="text-xs font-semibold text-stone-400 font-mono">({filteredEvents.length}개)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onOpenDetail={onOpenEvent}
              isLiked={wishlist.includes(ev.id)}
              onToggleLike={() => onToggleWishlist(ev.id)}
              onBookGroup={() => onGoToGroupBooking(ev)}
              walkingDistance={getWalkingDistance(ev)}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
