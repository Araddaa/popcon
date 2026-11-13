'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, CreditCard, Ticket, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { CultureEvent } from '../types';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CultureEvent | null;
  onViewMobileTicket: () => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  event,
  onViewMobileTicket,
}) => {
  // Steps: 'queue' -> 'seats' -> 'pay' -> 'complete'
  // 새로고침 및 URL 파라미터 연동으로 단계 유지
  const [step, setStep] = useState<'queue' | 'seats' | 'pay' | 'complete'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlStep = urlParams.get('step');
      if (urlStep && ['queue', 'seats', 'pay', 'complete'].includes(urlStep)) {
        return urlStep as 'queue' | 'seats' | 'pay' | 'complete';
      }
      const saved = sessionStorage.getItem('popcon_booking_step') as 'queue' | 'seats' | 'pay' | 'complete' | null;
      if (saved && ['queue', 'seats', 'pay', 'complete'].includes(saved)) {
        return saved;
      }
    }
    return 'queue';
  });
  const [queueNumber, setQueueNumber] = useState(14);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['B5', 'B6']);
  const [paymentMethod, setPaymentMethod] = useState<'kakaopay' | 'tosspay' | 'card'>('kakaopay');

  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('popcon_booking_step');
      }
      setStep('queue');
      setQueueNumber(14);
      return;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('popcon_booking_step', step);
    }

    // T-18: Fast queue waiting room simulation (reduces queue to 0 in 1.8s)
    if (step === 'queue') {
      const timer = setInterval(() => {
        setQueueNumber((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStep('seats');
            return 0;
          }
          return prev - 4;
        });
      }, 400);
      return () => clearInterval(timer);
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const currentEvent = event || {
    id: 20,
    title: '뮤지컬 지킬앤하이드 20주년',
    categoryName: '공연',
    spot: '샤롯데씨어터',
    date: '2026.12.06 (토) 14:00',
    priceNum: 170000,
    hasSeating: true,
  };

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const soldSeats = ['A3', 'A4', 'A5', 'C1', 'C2', 'D8', 'D9', 'E4'];

  const getSeatPrice = (seatId: string) => {
    if (seatId.startsWith('A') || seatId.startsWith('B')) return 170000; // VIP
    if (seatId.startsWith('C') || seatId.startsWith('D')) return 140000; // R
    return 90000; // S
  };

  const getSeatGradeLabel = (seatId: string) => {
    if (seatId.startsWith('A') || seatId.startsWith('B')) return 'VIP석';
    if (seatId.startsWith('C') || seatId.startsWith('D')) return 'R석';
    return 'S석';
  };

  const toggleSeat = (id: string) => {
    if (soldSeats.includes(id)) return;
    setSelectedSeats((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const totalPrice = selectedSeats.reduce((acc, s) => acc + getSeatPrice(s), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white border-2 border-stone-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-[6px_6px_0px_#1c1917] flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-900 bg-[#faf8f5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-stone-900" />
            <div>
              <h2 className="font-black text-stone-900 text-sm sm:text-base leading-tight">
                {currentEvent.title}
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">
                {currentEvent.spot} · 2026.12.06 (토) 14:00 회차
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body based on step */}
        <div className="p-6 overflow-y-auto">
          {step === 'queue' && (
            /* Step 1: T-18 Queue Waiting Room */
            <div className="py-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-stone-900 mx-auto flex items-center justify-center animate-spin">
                <RefreshCw className="w-7 h-7 text-amber-900" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-300">
                  예매 오픈 대기실 [T-18]
                </span>
                <h3 className="text-2xl font-black text-stone-900">
                  대기 순서: <strong>{queueNumber}</strong>번째
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  접속 순서대로 좌석 배치도로 자동 입장합니다. 새로고침을 누르시면 대기 순번이 초기화됩니다.
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-stone-100 rounded-full h-3 border border-stone-300 overflow-hidden">
                <div
                  className="bg-stone-900 h-full transition-all duration-300"
                  style={{ width: `${Math.max(10, ((14 - queueNumber) / 14) * 100)}%` }}
                />
              </div>

              <button
                onClick={() => setStep('seats')}
                className="text-xs text-stone-400 underline hover:text-stone-700"
              >
                (대기 건너뛰기 테스트)
              </button>
            </div>
          )}

          {step === 'seats' && (
            /* Step 2: T-06 Interactive Seating Map */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="font-black text-xs sm:text-sm text-stone-900">
                  좌석배치도 선택 [T-06]
                </span>
                <span className="text-xs font-bold text-stone-500">
                  최대 2석 선택 가능
                </span>
              </div>

              {/* Stage representation */}
              <div className="w-full py-2 bg-stone-200 border-2 border-stone-900 rounded-lg text-center font-bold text-xs text-stone-800 tracking-widest shadow-2xs">
                STAGE (무대)
              </div>

              {/* Seat Matrix */}
              <div className="py-2 overflow-x-auto">
                <div className="min-w-[340px] space-y-1.5 mx-auto text-center">
                  {rows.map((r) => (
                    <div key={r} className="flex items-center justify-center gap-1.5">
                      <span className="w-4 font-mono font-bold text-xs text-stone-400">{r}</span>
                      {cols.map((c) => {
                        const seatId = `${r}${c}`;
                        const isSold = soldSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        const isVIP = r === 'A' || r === 'B';
                        const isR = r === 'C' || r === 'D';

                        return (
                          <button
                            key={seatId}
                            disabled={isSold}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-6 h-6 rounded-md text-[10px] font-mono font-bold transition-all border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-900 shadow-sm scale-110'
                                : isSold
                                ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                                : isVIP
                                ? 'bg-[#ffe4e6] text-[#9f1239] border-rose-300 hover:border-stone-900'
                                : isR
                                ? 'bg-[#e0f2fe] text-[#0369a1] border-sky-300 hover:border-stone-900'
                                : 'bg-[#f3e8ff] text-[#6b21a8] border-purple-300 hover:border-stone-900'
                            }`}
                            title={`${seatId} (${getSeatGradeLabel(seatId)})`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-stone-600 border-t border-stone-100">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#ffe4e6] border border-rose-300" /> VIP석 (17만)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#e0f2fe] border border-sky-300" /> R석 (14만)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#f3e8ff] border border-purple-300" /> S석 (9만)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-stone-200 border border-stone-300" /> 예매완료
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-indigo-600 text-white" /> 내 선택
                </span>
              </div>

              {/* Selection Summary Box */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block">선택한 좌석:</span>
                  <strong className="text-stone-900 font-mono text-sm">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : '좌석을 선택해주세요'}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 block">총 결제 금액:</span>
                  <strong className="text-stone-900 font-mono text-base">
                    ₩{totalPrice.toLocaleString()}
                  </strong>
                </div>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => setStep('pay')}
                className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-black flex items-center justify-center gap-2 transition-all"
              >
                <span>결제 단계로 이동 [T-07]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'pay' && (
            /* Step 3: T-07 Payment Method & Checkout */
            <div className="space-y-4">
              <div className="pb-2 border-b border-stone-200">
                <span className="font-black text-xs sm:text-sm text-stone-900">
                  결제 수단 선택 [T-07]
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setPaymentMethod('kakaopay')}
                  className={`w-full p-3 rounded-xl border-2 flex items-center justify-between text-xs font-bold transition-all ${
                    paymentMethod === 'kakaopay'
                      ? 'border-stone-900 bg-[#fef01b]/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#fef01b] text-stone-900 font-black text-[10px]">카카오페이</span>
                    <span>카카오페이 간편결제</span>
                  </span>
                  {paymentMethod === 'kakaopay' && <CheckCircle2 className="w-4 h-4 text-stone-900" />}
                </button>

                <button
                  onClick={() => setPaymentMethod('tosspay')}
                  className={`w-full p-3 rounded-xl border-2 flex items-center justify-between text-xs font-bold transition-all ${
                    paymentMethod === 'tosspay'
                      ? 'border-stone-900 bg-blue-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[10px]">토스페이</span>
                    <span>토스페이 간편결제</span>
                  </span>
                  {paymentMethod === 'tosspay' && <CheckCircle2 className="w-4 h-4 text-stone-900" />}
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-3 rounded-xl border-2 flex items-center justify-between text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-stone-900 bg-stone-100 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-stone-700" />
                    <span>일반 신용 / 체크카드</span>
                  </span>
                  {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-stone-900" />}
                </button>
              </div>

              {/* Order Breakdown */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>티켓 ({selectedSeats.length}매)</span>
                  <span className="font-mono">₩{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>예매 수수료 (장당 ₩1,000)</span>
                  <span className="font-mono">₩{(selectedSeats.length * 1000).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-stone-900 text-sm">
                  <span>최종 결제 금액</span>
                  <span className="font-mono text-base">₩{(totalPrice + selectedSeats.length * 1000).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setStep('seats')}
                  className="py-3 px-4 rounded-xl border border-stone-300 text-xs font-bold hover:bg-stone-100"
                >
                  좌석 재선택
                </button>
                <button
                  onClick={() => setStep('complete')}
                  className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black shadow-[2px_2px_0px_#ffffff] transition-all"
                >
                  ₩{(totalPrice + selectedSeats.length * 1000).toLocaleString()} 결제 승인
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            /* Step 4: T-08 Reservation Complete */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-stone-900 text-emerald-800 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  예매 완료 [T-08]
                </span>
                <h3 className="text-xl font-black text-stone-900">
                  예매가 성공적으로 완료되었습니다!
                </h3>
                <p className="text-xs text-stone-500">
                  예약 번호: <strong className="font-mono text-stone-900">POP-20261114-8832</strong>
                </p>
              </div>

              <div className="max-w-sm mx-auto p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">행사명</span>
                  <strong className="text-stone-900">{currentEvent.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">선택 좌석</span>
                  <strong className="text-stone-900 font-mono">{selectedSeats.join(', ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">일시</span>
                  <strong className="text-stone-900">2026.12.06 (토) 14:00</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onViewMobileTicket();
                  }}
                  className="px-6 py-3 rounded-xl bg-stone-900 text-white text-xs font-black shadow-[2px_2px_0px_#ffffff] hover:bg-stone-800 flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>모바일 티켓 열기 [T-16]</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-stone-300 text-xs font-bold hover:bg-stone-100"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
