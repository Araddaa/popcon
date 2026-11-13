'use client';

import React, { useState } from 'react';
import { CultureEvent } from '../types';
import { X, Calendar, MapPin, Ticket, Users, Clock, Share2, Heart, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface EventDetailModalProps {
  event: CultureEvent | null;
  onClose: () => void;
  onSingleBooking: (event: CultureEvent) => void;
  onGroupBooking: (event: CultureEvent) => void;
  onWaitlistApply: (event: CultureEvent) => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onSingleBooking,
  onGroupBooking,
  onWaitlistApply,
  isLiked = false,
  onToggleLike,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026.11.15 (토)');
  const [selectedSlot, setSelectedSlot] = useState('14:00 회차');

  if (!event) return null;

  const isPerformance = event.category === 'performance';
  const isPopup = event.category === 'popup';

  const timeSlots = isPerformance
    ? ['14:00 (잔여 18석)', '18:30 (잔여 4석)', '20:00 (매진임박)']
    : ['11:00 회차', '13:00 회차', '14:00 회차', '16:00 회차', '18:00 회차'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white border-2 border-stone-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-[6px_6px_0px_#1c1917] flex flex-col max-h-[92vh]">
        
        {/* Poster Header */}
        <div className="h-52 sm:h-56 w-full relative bg-stone-100 border-b-2 border-stone-900 flex-shrink-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover object-center"
          />

          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white border-2 border-stone-900 text-stone-900 hover:bg-stone-100 shadow-sm"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-black border-2 border-stone-900 shadow-2xs"
              style={{ backgroundColor: event.badgeBg, color: event.badgeText }}
            >
              {event.categoryName} · {event.badge}
            </span>

            <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-white font-mono text-[11px] font-black shadow-xs">
              {event.dDay}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Title & Spot */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              <span>팝콘 검증 공식 등록 행사 [C-05]</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
              {event.title}
            </h3>
            <p className="text-xs text-stone-600 mt-1 flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-stone-800" />
              <span>{event.spot} ({event.location})</span>
            </p>
          </div>

          {/* Detailed Description */}
          <p className="text-xs text-stone-600 leading-relaxed bg-[#faf8f5] p-3 rounded-xl border border-stone-200">
            {event.desc}
          </p>

          {/* Cast info if available */}
          {event.cast && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-0.5">
              <span className="font-bold text-purple-950">주요 캐스팅:</span>
              <p className="text-purple-900 font-medium">{event.cast}</p>
            </div>
          )}

          {/* Essential Info Meta Table */}
          <div className="bg-white p-3.5 rounded-xl border-2 border-stone-900 shadow-2xs space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-600" /> 행사 기간
              </span>
              <span className="font-bold text-stone-900">{event.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 flex items-center gap-1 font-medium">
                <Ticket className="w-3.5 h-3.5 text-stone-600" /> 티켓 가격
              </span>
              <span className="font-black text-stone-900 font-mono text-sm">{event.price}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-600" /> 관람/운영
              </span>
              <span className="font-bold text-stone-800">{event.runningTime || '상시 운영'}</span>
            </div>
            {event.waitingCount !== undefined && event.waitingCount > 0 && (
              <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                <span className="text-stone-500 font-medium">실시간 대기</span>
                <span className="font-bold text-rose-600">대기 {event.waitingCount}팀</span>
              </div>
            )}
          </div>

          {/* T-05 Schedule Picker */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-black text-stone-800 flex items-center justify-between">
              <span>관람 일시 및 회차 선택 [T-05]</span>
              <span className="text-[11px] text-stone-400 font-mono">2026.11.15 기준</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedSlot === slot
                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: 티켓예매, 동행모임, 취소표대기, 찜하기 */}
          <div className="space-y-2.5 pt-3 border-t-2 border-stone-900/10">
            {/* 1. Main Booking Action */}
            <button
              onClick={() => onSingleBooking(event)}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-[2px_2px_0px_#ffffff] transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <Ticket className="w-4 h-4" />
              <span>{isPerformance ? '좌석배치도 선택 예매하기 [T-06]' : `${selectedSlot} 티켓 예매하기`}</span>
            </button>

            {/* 2. Secondary Group & Waitlist Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onGroupBooking(event)}
                className="py-2.5 px-3 rounded-xl bg-[#f3e8ff] hover:bg-purple-200 border-2 border-stone-900 text-purple-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_#1c1917] active:translate-x-0.5 active:translate-y-0.5"
                title="친구와 함께 좌석을 고르고 각자 결제"
              >
                <Users className="w-3.5 h-3.5 text-purple-800" />
                <span>동행 모임 (같이 고르기) [G-01]</span>
              </button>

              <button
                onClick={() => onWaitlistApply(event)}
                className="py-2.5 px-3 rounded-xl bg-[#fffbeb] hover:bg-amber-200 border-2 border-stone-900 text-amber-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_#1c1917] active:translate-x-0.5 active:translate-y-0.5"
                title="매진 회차 취소표 알림 및 우선구매권"
              >
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>취소표 대기 신청 [W-01]</span>
              </button>
            </div>

            {/* 3. Wishlist Heart Toggle */}
            <button
              onClick={onToggleLike}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
              <span>{isLiked ? '관심 행사 찜 완료 (오픈/취소표 알림 수신중)' : '관심 행사로 찜하기 [C-07]'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
