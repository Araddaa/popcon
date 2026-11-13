'use client';

import React, { useState, useEffect } from 'react';
import { X, QrCode, RefreshCw, Send, CheckCircle2, ShieldCheck, Ticket, Users, AlertCircle } from 'lucide-react';
import { CultureEvent } from '../types';

interface MobileTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CultureEvent | null;
}

export const MobileTicketModal: React.FC<MobileTicketModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [seconds, setSeconds] = useState(30);
  const [isScanned, setIsScanned] = useState(false);
  const [transferMode, setTransferMode] = useState(false);
  const [transferSent, setTransferSent] = useState(false);

  // T-16: 30초마다 회전하는 다이내믹 QR
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) return 30;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEvent = event || {
    id: 1,
    title: '잔망루피 윈터 팝업스토어',
    categoryName: '팝업스토어',
    spot: '성수 에스팩토리 D동',
    date: '2026.11.15 (토) 14:00 회차',
    price: '예약 완료 (무료)',
    priceNum: 0,
    imageUrl: '/images/loopy_winter.jpg',
  };

  const handleSimulateCheckin = () => {
    setIsScanned(true);
    setTimeout(() => {
      setIsScanned(false);
      alert('현장 검표원 태블릿에서 정상 인증되었습니다! 입장 가능합니다. [T-16]');
    }, 800);
  };

  const handleSendTransfer = (toWhom: 'queue' | 'friend') => {
    setTransferSent(true);
    setTimeout(() => {
      setTransferSent(false);
      setTransferMode(false);
      alert(toWhom === 'queue' ? '취소표 대기 1번 고객에게 양도 완료되었습니다. [T-21]' : '친구에게 양도 수락 링크가 전송되었습니다. [T-21]');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm bg-white border-2 border-stone-900 rounded-3xl shadow-[6px_6px_0px_#1c1917] overflow-hidden flex flex-col relative">
        
        {/* Ticket Header */}
        <div className="p-4 bg-[#faf8f5] border-b-2 border-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-stone-900" />
            <span className="font-black text-xs text-stone-900 tracking-wider">POP-CON MOBILE PASS [T-16]</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket Main Card */}
        <div className="p-5 space-y-4 text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {currentEvent.categoryName} · 모바일 검표용
            </span>
            <h3 className="font-black text-base text-stone-900 leading-tight">
              {currentEvent.title}
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              {currentEvent.spot} · {currentEvent.date}
            </p>
          </div>

          {/* Dynamic 30s Rotating QR Frame */}
          <div className="relative p-5 rounded-2xl bg-stone-50 border-2 border-stone-900 inline-block shadow-inner">
            <div className="w-36 h-36 mx-auto bg-white border border-stone-300 rounded-xl p-2 flex flex-col items-center justify-center relative">
              {/* Simulated QR Pattern */}
              <div className="w-28 h-28 grid grid-cols-6 gap-1 p-1 bg-stone-900 rounded-lg">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      (i * 7 + seconds) % 3 === 0 ? 'bg-white' : 'bg-stone-900'
                    }`}
                  />
                ))}
              </div>
              {isScanned && (
                <div className="absolute inset-0 bg-emerald-500/90 rounded-xl flex items-center justify-center text-white font-black text-xs">
                  검표 완료!
                </div>
              )}
            </div>

            {/* Countdown Badge */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-stone-700 font-mono font-bold">
              <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${seconds <= 5 ? 'animate-spin text-rose-500' : ''}`} />
              <span>30초 회전 QR: <strong>{seconds}초</strong></span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400">
            캡처본은 입장이 불가하며 30초마다 보안 코드가 자동 갱신됩니다.
          </p>

          {/* Perforation Line with Side Notches */}
          <div className="relative flex items-center justify-between -mx-5 py-1">
            <div className="w-4 h-6 rounded-r-full bg-stone-300 border-y-2 border-r-2 border-stone-900" />
            <div className="flex-1 border-b-2 border-dashed border-stone-300 mx-2" />
            <div className="w-4 h-6 rounded-l-full bg-stone-300 border-y-2 border-l-2 border-stone-900" />
          </div>

          {/* Action Buttons (Checkin Simulator & Transfer) */}
          {!transferMode ? (
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSimulateCheckin}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>현장 검표원 QR 스캔 시뮬레이션 [T-16]</span>
              </button>

              <button
                onClick={() => setTransferMode(true)}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-stone-600" />
                <span>티켓 양도 보내기 [T-21]</span>
              </button>
            </div>
          ) : (
            /* T-21 Ticket Transfer Options */
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-900">티켓 양도 방식 선택 [T-21]</span>
                <button
                  onClick={() => setTransferMode(false)}
                  className="text-[10px] text-stone-400 hover:underline"
                >
                  취소
                </button>
              </div>

              <button
                onClick={() => handleSendTransfer('queue')}
                className="w-full py-2 px-3 rounded-lg bg-white border border-stone-300 hover:border-stone-900 text-xs font-bold text-stone-800 flex items-center justify-between"
              >
                <span>대기열 1순위 고객에게 자동 양도</span>
                <span className="text-[10px] text-emerald-700 font-mono">즉시 매칭</span>
              </button>

              <button
                onClick={() => handleSendTransfer('friend')}
                className="w-full py-2 px-3 rounded-lg bg-white border border-stone-300 hover:border-stone-900 text-xs font-bold text-stone-800 flex items-center justify-between"
              >
                <span>친구 지정 양도 (카카오톡/링크)</span>
                <span className="text-[10px] text-indigo-700 font-mono">링크 생성</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
