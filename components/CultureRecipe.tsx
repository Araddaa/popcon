'use client';

import React, { useState, useEffect } from 'react';
import { userWrappedData } from '../data/mockData';
import { Sparkles, Share2, ShieldCheck, Check, Gift, UserCheck } from 'lucide-react';

export const CultureRecipe: React.FC = () => {
  const [qrCounter, setQrCounter] = useState<number>(30);
  const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [transferPhone, setTransferPhone] = useState<string>('');
  const [transferDone, setTransferDone] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setQrCounter((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShareCard = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleTransfer = () => {
    if (!transferPhone) {
      alert('받으실 분의 전화번호를 입력해주세요.');
      return;
    }
    setTransferDone(true);
    setTimeout(() => {
      setTransferDone(false);
      setTransferModalOpen(false);
      setTransferPhone('');
      alert('🎁 [양도 링크 발송 완료] 수신자에게 카카오 알림톡으로 본인확인 및 티켓 수령 링크가 전송되었습니다.');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: 1-Year Culture Wrapped Card (Solid Pastel Cream/Lilac - No gradient) */}
        <div className="bg-[#f9f7f5] rounded-3xl p-6 sm:p-8 text-stone-900 border border-stone-200 shadow-sm relative overflow-hidden">
          
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                2026 나의 컬처 레시피 (Wrapped)
              </span>
              <span className="text-xs font-mono text-stone-400">POPCORN YEARBOOK</span>
            </div>

            <div>
              <div className="text-xs text-rose-700 font-semibold mb-1">
                {userWrappedData.userName} 님의 지난 1년 문화 성향
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 leading-tight">
                &ldquo;성수동 골목길의 <br />
                <span className="text-rose-600">
                  트렌드 세터 탐험가 🎖️
                </span>&rdquo;
              </h2>
            </div>

            {/* Stats Triple Bar (Solid Pastel Tiles) */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-amber-100/70 border border-amber-200 rounded-2xl p-3.5 text-center">
                <div className="text-xs text-amber-900 font-medium">총 탐험 횟수</div>
                <div className="text-xl sm:text-2xl font-black text-amber-950 mt-1">
                  {userWrappedData.totalVisits}회
                </div>
                <div className="text-[12px] text-amber-800 mt-0.5 font-semibold">상위 {userWrappedData.topPercent}%</div>
              </div>

              <div className="bg-emerald-100/70 border border-emerald-200 rounded-2xl p-3.5 text-center">
                <div className="text-xs text-emerald-900 font-medium">얼리버드 절약</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
                  {(userWrappedData.savedEarlyBird / 10000).toFixed(1)}만
                </div>
                <div className="text-[12px] text-emerald-800 mt-0.5 font-semibold">원 세이브!</div>
              </div>

              <div className="bg-purple-100/70 border border-purple-200 rounded-2xl p-3.5 text-center">
                <div className="text-xs text-purple-900 font-medium">모은 스탬프</div>
                <div className="text-xl sm:text-2xl font-black text-purple-950 mt-1">
                  {userWrappedData.stampsCollected}개
                </div>
                <div className="text-[12px] text-purple-800 mt-0.5 font-semibold">뱃지 6개 달성</div>
              </div>
            </div>

            {/* Recipe Composition (Solid Pastel Bar) */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-2.5">
              <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span>🧁 1년 요리 레시피 구성비</span>
                <span className="text-rose-600 font-mono">100% 갓생</span>
              </div>

              <div className="w-full bg-stone-100 h-3 rounded-full flex overflow-hidden">
                {userWrappedData.tasteComposition.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    className="h-full"
                    title={`${item.name} ${item.percent}%`}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5 text-[12px] text-stone-600 pt-1">
                {userWrappedData.tasteComposition.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name} {item.percent}%</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Share Card Button (Solid Flat) */}
            <button
              onClick={handleShareCard}
              className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedShare ? '카드 클립보드 복사됨!' : '📸 인스타그램 스토리로 카드 공유하기'}</span>
            </button>

          </div>
        </div>

        {/* Right: Mobile QR Ticket Wallet (Solid White + Pastel Pills) */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-rose-600">보유 모바일 티켓</span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  잔망루피 윈터 팝업스토어
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                입장 대기중
              </span>
            </div>

            {/* Dynamic TOTP QR Code Box */}
            <div className="flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-4">
              
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-stone-200">
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="#1c1917" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="#1c1917" />
                  <rect x="65" y="10" width="25" height="25" fill="#1c1917" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="#1c1917" />
                  <rect x="10" y="65" width="25" height="25" fill="#1c1917" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="#1c1917" />
                  <circle cx="45" cy="20" r="3" fill="#e11d48" />
                  <circle cx="52" cy="30" r="3" fill="#1c1917" />
                  <circle cx="45" cy="50" r="4" fill="#7c3aed" />
                  <circle cx="65" cy="65" r="3" fill="#1c1917" />
                  <circle cx="75" cy="80" r="4" fill="#e11d48" />
                </svg>
              </div>

              {/* Anti-scalp counter */}
              <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>캡처 방지 실시간 갱신:</span>
                <span className="font-mono font-bold text-rose-600 text-sm">{qrCounter}초</span>
              </div>
            </div>

            {/* Ticket Specs */}
            <div className="mt-6 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">일시</span>
                <span className="font-semibold text-stone-800">2026. 11. 15 (토) 14:00 회차</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">장소</span>
                <span className="font-semibold text-stone-800">성수동 에스팩토리 D동</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">지정 구역/좌석</span>
                <span className="font-bold text-purple-700">VIP 구역 C4번 (1인)</span>
              </div>
            </div>

            {/* Ticket Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setTransferModalOpen(true)}
                className="flex-1 py-3 rounded-2xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-stone-700"
              >
                <Gift className="w-3.5 h-3.5 text-rose-600" />
                <span>친구에게 안심 양도 (선물)</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Ticket Transfer Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-rose-600" />
                안심 티켓 선물/양도
              </h4>
              <button
                onClick={() => setTransferModalOpen(false)}
                className="text-xs text-stone-400 hover:text-stone-600"
              >
                닫기
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              받으실 분의 전화번호를 입력하시면 실명 본인인증 후 안전하게 티켓 소유권이 이전됩니다. (암표 방지 1회 제한)
            </p>

            <input
              type="text"
              value={transferPhone}
              onChange={(e) => setTransferPhone(e.target.value)}
              placeholder="받는 사람 휴대폰 번호 (- 제외)"
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-rose-400 outline-none"
            />

            <button
              onClick={handleTransfer}
              disabled={transferDone}
              className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {transferDone ? <Check className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              <span>{transferDone ? '양도 링크 전송 중...' : '안심 양도 링크 발송하기'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
