'use client';

import React from 'react';
import { CultureEvent } from '../types';
import { Heart, Users, MapPin, Ticket, Clock } from 'lucide-react';

interface EventCardProps {
  event: CultureEvent;
  onOpenDetail: (event: CultureEvent) => void;
  isLiked?: boolean;
  onToggleLike?: (e: React.MouseEvent) => void;
  onBookGroup?: (e: React.MouseEvent) => void;
  walkingDistance?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onOpenDetail,
  isLiked = false,
  onToggleLike,
  onBookGroup,
  walkingDistance,
}) => {
  return (
    <div
      onClick={() => onOpenDetail(event)}
      className="group bg-white border-2 border-stone-900 rounded-2xl overflow-hidden cursor-pointer shadow-[3px_3px_0px_#1c1917] hover:shadow-[5px_5px_0px_#1c1917] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative select-none"
    >
      <div>
        {/* Poster Container */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative border-b-2 border-stone-900">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Solid Pastel Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20">
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-black border border-stone-900 shadow-2xs"
              style={{ backgroundColor: event.dDayBg, color: event.dDayText }}
            >
              {event.dDay}
            </span>
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-stone-900 shadow-2xs"
              style={{ backgroundColor: event.badgeBg, color: event.badgeText }}
            >
              {event.badge}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.(e);
            }}
            title={isLiked ? '찜 목록에서 해제' : '찜 목록에 추가'}
            className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white text-stone-700 shadow-sm border border-stone-900 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400 hover:text-rose-500'
              }`}
            />
          </button>

          {/* Ranking if present */}
          {event.ranking && (
            <div className="absolute bottom-2 left-2.5 font-black text-xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] font-mono z-10 leading-none">
              0{event.ranking}
            </div>
          )}

          {walkingDistance && (
            <div className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-bold flex items-center gap-1 z-10">
              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
              <span>{walkingDistance}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-[11px]">
              {event.categoryName} · {event.location}
            </span>
            <span className="font-black text-stone-900 text-xs">
              {event.price}
            </span>
          </div>

          <h3 className="font-black text-sm sm:text-base text-stone-900 leading-snug group-hover:text-stone-700 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1">
            {event.desc}
          </p>

          <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
            <span className="truncate">📍 {event.spot}</span>
            {event.waitingCount !== undefined && event.waitingCount > 0 && (
              <span className="flex items-center gap-0.5 text-rose-600 font-bold flex-shrink-0">
                <Clock className="w-3 h-3" /> 대기 {event.waitingCount}팀
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Perforated Action Footer */}
      <div className="px-4 pb-3 pt-2 border-t border-dashed border-stone-200 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(event);
          }}
          className="flex-1 py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>{event.hasSeating ? '좌석예매' : '예약·신청'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookGroup?.(e);
          }}
          title="친구와 함께 좌석을 고르고 각자 결제"
          className="py-2 px-2.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-stone-900 text-xs font-bold flex items-center gap-1 transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Users className="w-3.5 h-3.5 text-purple-600" />
          <span>동행</span>
        </button>
      </div>
    </div>
  );
};
