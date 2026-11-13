'use client';

import React, { useState } from 'react';
import { CultureEvent } from '../types';
import { EventCard } from './EventCard';
import { Sparkles, Heart, Users, Flame, Gift, Clapperboard, Palette, ArrowRight } from 'lucide-react';

interface ThemeViewProps {
  events: CultureEvent[];
  onOpenEvent: (event: CultureEvent) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onGoToGroupBooking: (event: CultureEvent) => void;
}

export const ThemeView: React.FC<ThemeViewProps> = ({
  events,
  onOpenEvent,
  wishlist,
  onToggleWishlist,
  onGoToGroupBooking,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('character');

  const themes = [
    {
      id: 'character',
      title: '겨울 캐릭터 팝업 성지',
      sub: '잔망루피부터 산리오까지 한정판 굿즈!',
      emoji: '🎀',
      color: 'bg-[#fff5f5] border-rose-200 text-rose-950',
      badge: 'HOT 인기 테마',
      badgeColor: 'bg-rose-100 text-rose-800',
      filter: (e: CultureEvent) => e.category === 'popup' || e.tags.includes('굿즈') || e.tags.includes('포토존'),
    },
    {
      id: 'media_art',
      title: '빛과 사운드의 미디어아트',
      sub: '모네 원화부터 몰입형 360° 대형 스크린',
      emoji: '🎨',
      color: 'bg-[#f0fdf4] border-emerald-200 text-emerald-950',
      badge: '인생샷 보장',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      filter: (e: CultureEvent) => e.category === 'exhibition' || e.tags.includes('미디어아트'),
    },
    {
      id: 'indie_cinema',
      title: '청춘 독립영화 & 감독 GV',
      sub: '성수·홍대 시네마에서 만나는 차세대 K-무비',
      emoji: '🎬',
      color: 'bg-[#fffbeb] border-amber-200 text-amber-950',
      badge: '좌석 지정제',
      badgeColor: 'bg-amber-100 text-amber-800',
      filter: (e: CultureEvent) => e.category === 'movie' || e.tags.includes('독립영화'),
    },
    {
      id: 'raffle_goods',
      title: '팝콘 단독 래플 & 한정판',
      sub: '미공개 키링과 전시 굿즈 사전 드로우',
      emoji: '🎁',
      color: 'bg-[#faf5ff] border-purple-200 text-purple-950',
      badge: '추첨 응모중',
      badgeColor: 'bg-purple-100 text-purple-800',
      filter: (e: CultureEvent) => e.badge.includes('래플') || e.tags.includes('래플'),
    },
    {
      id: 'buddy_discount',
      title: '둘이 가면 할인! 동행 기획전',
      sub: '친구와 함께 결제 시 얼리버드 10% 추가할인',
      emoji: '👫',
      color: 'bg-[#eff6ff] border-sky-200 text-sky-950',
      badge: '동행 혜택',
      badgeColor: 'bg-sky-100 text-sky-800',
      filter: (e: CultureEvent) => e.id === 1 || e.id === 5 || e.id === 2,
    },
  ];

  const currentTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const filteredEvents = events.filter(currentTheme.filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Theme Header */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>팝콘 에디터 큐레이션</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          취향별 테마 컬렉션
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          지금 가장 반응 좋은 팝업, 전시, 영화를 테마별로 모아봤어요.
        </p>
      </div>

      {/* Theme Selection Cards (Horizontal Scroll or Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {themes.map((t) => {
          const isSelected = selectedThemeId === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setSelectedThemeId(t.id)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer text-left space-y-2 relative shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.99] ${
                isSelected
                  ? `${t.color} border-stone-900 shadow-md ring-2 ring-stone-900/10`
                  : 'bg-white border-stone-200/90 hover:border-stone-300 text-stone-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{t.emoji}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.badgeColor}`}>
                  {t.badge}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-stone-900 leading-snug">
                  {t.title}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                  {t.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Theme Events Heading */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentTheme.emoji}</span>
          <h3 className="text-base sm:text-lg font-black text-stone-900">
            {currentTheme.title} <span className="text-xs font-semibold text-stone-400 font-mono">({filteredEvents.length}개)</span>
          </h3>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            onOpenDetail={onOpenEvent}
            isLiked={wishlist.includes(ev.id)}
            onToggleLike={() => onToggleWishlist(ev.id)}
            onBookGroup={() => onGoToGroupBooking(ev)}
          />
        ))}
      </div>

    </div>
  );
};
