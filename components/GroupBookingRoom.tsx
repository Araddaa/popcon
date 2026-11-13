'use client';

import React, { useState, useEffect } from 'react';
import { CultureEvent } from '../types';
import { Users, Copy, Check, Clock, CreditCard, Sparkles } from 'lucide-react';

interface GroupBookingRoomProps {
  event?: CultureEvent | null;
  onSuccessComplete: () => void;
}

export const GroupBookingRoom: React.FC<GroupBookingRoomProps> = ({
  event,
  onSuccessComplete,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentActor, setCurrentActor] = useState<'host' | 'guest'>('host');
  const [hostSeat, setHostSeat] = useState<string>('C4');
  const [guestSeat, setGuestSeat] = useState<string>('C5');
  const [hostPaid, setHostPaid] = useState<boolean>(false);
  const [guestPaid, setGuestPaid] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(400);

  const eventTitle = event?.title || '잔망루피 윈터 팝업스토어 in 성수';
  const unitPrice = event?.priceNum && event.priceNum > 0 ? event.priceNum : 15000;
  const totalPrice = unitPrice * 2;
  const splitPrice = unitPrice;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  const soldSeats = ['A1', 'A2', 'D7', 'D8', 'F3', 'F4'];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://popcon.kr/room/POP-7821');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeatClick = (seatId: string) => {
    if (soldSeats.includes(seatId)) return;

    if (currentActor === 'host') {
      if (seatId === guestSeat) {
        alert('동행인(지우)이 이미 선택 중인 좌석입니다.');
        return;
      }
      setHostSeat(seatId);
    } else {
      if (seatId === hostSeat) {
        alert('방장(민우)이 이미 선택 중인 좌석입니다.');
        return;
      }
      setGuestSeat(seatId);
    }
  };

  const handlePay = (who: 'host' | 'guest') => {
    if (who === 'host') {
      setHostPaid(true);
    } else {
      setGuestPaid(true);
    }

    const willBothBePaid = who === 'host' ? guestPaid : hostPaid;
    if (willBothBePaid) {
      setTimeout(() => {
        onSuccessComplete();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Room Info Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              실시간 동행 예매 세션
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              {eventTitle} — 나란히 좌석 선택하기
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              초대 링크로 친구와 동시에 접속해 나란히 앉을 자리를 고르고, 결제는 각자 카드로 따로 진행합니다.
            </p>
          </div>

          {/* Room Link Share Pill */}
          <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-2xl p-3">
            <div>
              <div className="text-[11px] text-stone-400">초대 링크 생성됨</div>
              <div className="text-xs font-mono font-bold text-purple-700">popcon.kr/room/POP-7821</div>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all text-xs font-bold shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '복사'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Seat Map & Dutch Pay Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Seat Selection Area */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-3xl p-6 flex flex-col items-center shadow-sm">
          
          {/* Stage Area */}
          <div className="w-3/4 max-w-md h-9 rounded-t-xl bg-sky-50 border-t-2 border-sky-300 text-sky-800 flex items-center justify-center text-xs font-bold tracking-widest mb-8">
            STAGE / SCREEN
          </div>

          {/* Seat Grid */}
          <div className="grid grid-cols-8 gap-2.5 max-w-lg w-full mb-6">
            {rows.map((r) =>
              cols.map((c) => {
                const seatId = `${r}${c}`;
                const isHost = seatId === hostSeat;
                const isGuest = seatId === guestSeat;
                const isSold = soldSeats.includes(seatId);

                let btnStyles = 'w-full aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center ';
                let label = seatId;

                if (isHost) {
                  btnStyles += 'bg-purple-200 text-purple-900 border border-purple-400 font-extrabold shadow-sm';
                  label = '호';
                } else if (isGuest) {
                  btnStyles += 'bg-emerald-200 text-emerald-900 border border-emerald-400 font-extrabold shadow-sm';
                  label = '동';
                } else if (isSold) {
                  btnStyles += 'bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed';
                } else {
                  btnStyles += 'bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 hover:border-purple-300';
                }

                return (
                  <button
                    key={seatId}
                    disabled={isSold}
                    onClick={() => handleSeatClick(seatId)}
                    className={btnStyles}
                    title={seatId}
                  >
                    {label}
                  </button>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500 pt-4 border-t border-stone-100 w-full">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-purple-200 border border-purple-400" />
              <span>방장 좌석 (민우)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-200 border border-emerald-400" />
              <span>동행인 좌석 (지우)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-white border border-stone-200" />
              <span>선택 가능</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-stone-100 border border-stone-200" />
              <span>예매 완료</span>
            </span>
          </div>

        </div>

        {/* Right 1 Col: Split Payment Status & Role Toggle */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-900">시뮬레이션 조작 시점</span>
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  onClick={() => setCurrentActor('host')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentActor === 'host'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  민우(방장)
                </button>
                <button
                  onClick={() => setCurrentActor('guest')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentActor === 'guest'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  지우(동행)
                </button>
              </div>
            </div>

            {/* Individual Seat & Payment Status Cards */}
            <div className="space-y-3 mt-4">
              
              {/* Host Status Card */}
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center text-xs">
                    민우
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">민우 (방장)</div>
                    <div className="text-xs text-purple-700 font-semibold">
                      좌석: {hostSeat}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-900 font-mono">₩{splitPrice.toLocaleString()}</div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      hostPaid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hostPaid ? '결제 완료 ✅' : '결제 대기중 ⏳'}
                  </span>
                </div>
              </div>

              {/* Guest Status Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">
                    지우
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">지우 (동행인)</div>
                    <div className="text-xs text-emerald-700 font-semibold">
                      좌석: {guestSeat}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-900 font-mono">₩{splitPrice.toLocaleString()}</div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      guestPaid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {guestPaid ? '결제 완료 ✅' : '결제 대기중 ⏳'}
                  </span>
                </div>
              </div>
            </div>

            {/* Holding Timer Alert */}
            <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> 좌석 선점 홀딩 제한 시간
              </span>
              <span className="font-mono font-bold text-sm">{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Dutch Pay Checkout Buttons */}
          <div className="space-y-2 pt-4 border-t border-stone-100">
            <div className="flex justify-between text-xs text-stone-500">
              <span>총 2석 티켓 합계</span>
              <span className="font-bold text-stone-900 font-mono">₩{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-rose-700">
              <span>내가 결제할 분할 금액</span>
              <span className="text-base font-extrabold font-mono">₩{splitPrice.toLocaleString()}</span>
            </div>

            <button
              disabled={hostPaid}
              onClick={() => handlePay('host')}
              className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                hostPaid
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{hostPaid ? '호스트 결제 완료됨 (동행인 대기중)' : `내 좌석(민우) ₩${splitPrice.toLocaleString()} 결제하기`}</span>
            </button>

            <button
              disabled={guestPaid}
              onClick={() => handlePay('guest')}
              className={`w-full py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                guestPaid
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300'
              }`}
            >
              <span>{guestPaid ? '동행인 결제 완료됨 ✅' : `동행인(지우) ₩${splitPrice.toLocaleString()} 결제 시뮬레이션`}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
