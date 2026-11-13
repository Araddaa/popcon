'use client';

import React, { useState } from 'react';
import { CultureEvent } from '../types';
import { CheckCircle2, Ticket, QrCode, Share2, Check, ArrowRight, Sparkles, X } from 'lucide-react';

interface BookingSuccessModalProps {
  isOpen: boolean;
  event: CultureEvent | null;
  bookingType: 'single' | 'group' | 'raffle';
  seatInfo?: string;
  onClose: () => void;
  onOpenQR: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  event,
  bookingType,
  seatInfo,
  onClose,
  onOpenQR,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `🍿 [POP-CON] ${event.title} 예매 완료!\n일시: ${event.date}\n장소: ${event.spot}\n모바일 티켓: https://popcon.kr/ticket/POP-9921`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHeading = () => {
    if (bookingType === 'group') return '🎉 동행 2인 분할 결제 완료!';
    if (bookingType === 'raffle') return '🎁 팝콘 단독 래플 응모 완료!';
    return '🎉 예매가 성공적으로 완료되었습니다!';
  };

  const getSubheading = () => {
    if (bookingType === 'group') {
      return '두 분 모두 각자 결제를 마쳐 모바일 티켓 2매가 발권되었습니다.';
    }
    if (bookingType === 'raffle') {
      return '추첨 결과 발표일에 카카오 알림톡으로 당첨 여부를 전송해 드립니다.';
    }
    return '티켓이 [내 티켓 주머니]에 쏙 보관되었으며 입장 QR이 즉시 활성화되었습니다.';
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-[#fffbeb] border-b border-amber-200 p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-100 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-300 text-amber-900 flex items-center justify-center mx-auto shadow-xs text-2xl mb-3">
            {bookingType === 'raffle' ? '🎁' : '🎉'}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-stone-900">
            {getHeading()}
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
            {getSubheading()}
          </p>
        </div>

        {/* Ticket Receipt Card */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/90 space-y-3">
            
            <div className="flex items-center gap-3">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-14 h-16 object-cover rounded-xl border border-stone-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {event.categoryName}
                </span>
                <h4 className="text-sm font-bold text-stone-900 truncate mt-1">
                  {event.title}
                </h4>
                <p className="text-[11px] text-stone-500 font-mono">
                  예매번호: POP-20261114-8842
                </p>
              </div>
            </div>

            <div className="border-t border-stone-200/80 pt-2.5 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span className="text-stone-400">일시</span>
                <span className="font-semibold text-stone-800">{event.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">장소</span>
                <span className="font-semibold text-stone-800">{event.spot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">지정 좌석</span>
                <span className="font-bold text-purple-700">
                  {seatInfo || (bookingType === 'group' ? 'C4(민우), C5(지우)' : 'VIP석 C4')}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-dashed border-stone-200">
                <span className="text-stone-400">결제 상태</span>
                <span className="font-bold text-emerald-700">
                  {bookingType === 'raffle' ? '응모 완료 (추첨대기)' : '결제 완료 (발권완료)'}
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {bookingType !== 'raffle' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenQR();
                }}
                className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>모바일 QR 입장권 바로보기 🪄</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                응모 확인 완료
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className="py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨!' : '친구에게 공유'}</span>
              </button>
              <button
                onClick={onClose}
                className="py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold text-xs transition-colors"
              >
                계속 둘러보기
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
