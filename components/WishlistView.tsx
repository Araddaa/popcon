'use client';

import React from 'react';
import { CultureEvent } from '../types';
import { EventCard } from './EventCard';
import { Heart, Bell, BellRing, Sparkles, ArrowRight, Compass, Users } from 'lucide-react';

interface WishlistViewProps {
  events: CultureEvent[];
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onOpenEvent: (event: CultureEvent) => void;
  onGoToGroupBooking: (event: CultureEvent) => void;
  onGoToExplore: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  events,
  wishlist,
  onToggleWishlist,
  onOpenEvent,
  onGoToGroupBooking,
  onGoToExplore,
}) => {
  const wishlistedEvents = events.filter((e) => wishlist.includes(e.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
          <span>내 관심 목록</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              내가 찜한 팝업 &amp; 오픈 알림
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              하트를 누른 팝업의 티켓팅 D-Day, 취소표 알림, 래플 추첨 결과를 챙겨드려요.
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-purple-100 text-purple-950 font-bold text-xs self-start sm:self-auto border border-purple-300 font-mono">
            총 {wishlistedEvents.length}개 보관 중
          </div>
        </div>
      </div>

      {/* Notifications Notice Box */}
      {wishlistedEvents.length > 0 && (
        <div className="bg-[#faf5ff] border border-purple-200 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0 shadow-2xs">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-950">
                카카오톡 &amp; 앱 푸시 알림 켜짐
              </div>
              <div className="text-[11px] text-purple-800">
                티켓 오픈 10분 전과 취소표 발생 시 실시간 톡으로 쏘아드립니다 ⚡
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-white border border-purple-200 px-3 py-1 rounded-xl hidden sm:block">
            알림 수신중 ON
          </span>
        </div>
      )}

      {/* Events Grid or Empty State */}
      {wishlistedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              <EventCard
                event={ev}
                onOpenDetail={onOpenEvent}
                isLiked={true}
                onToggleLike={() => onToggleWishlist(ev.id)}
                onBookGroup={() => onGoToGroupBooking(ev)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-white border border-stone-200 text-stone-400 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto text-2xl">
            💔
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-stone-700">아직 찜한 팝업이 없어요!</p>
            <p className="text-xs text-stone-400">
              마음에 드는 팝업 카드의 하트(❤️)를 눌러 오픈 알림을 받아보세요.
            </p>
          </div>
          <button
            onClick={onGoToExplore}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>인기 팝업 구경하러 가기</span>
          </button>
        </div>
      )}

    </div>
  );
};
