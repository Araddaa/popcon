'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Flame, Ticket, X, Sparkles, ChevronRight } from 'lucide-react';

interface PopcornParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

interface PopcornCountdownOverlayProps {
  countdown: number; // 10, 9, 8, ... 0
  isOpenNow: boolean;
  openSplashVisible: boolean;
  onOpenBooking: () => void;
  onClose: () => void;
  eventTitle: string;
  serverTimeStr: string;
}

// 팝콘 튀기는 귀여운 사운드 합성기 (Web Audio API)
function playPopcornPopSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // 짧고 통통 튀는 팝콘 팝 사운드
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    // 피치 급상승 및 감쇄 (팝콘 팡! 소리)
    const startFreq = 220 + Math.random() * 80;
    const endFreq = 650 + Math.random() * 200;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // 무음 모드 또는 권한 없을 시 조용히 무시
  }
}

export const PopcornCountdownOverlay: React.FC<PopcornCountdownOverlayProps> = ({
  countdown,
  isOpenNow,
  openSplashVisible,
  onOpenBooking,
  onClose,
  eventTitle,
  serverTimeStr,
}) => {
  const [particles, setParticles] = useState<PopcornParticle[]>([]);
  const prevCountdownRef = useRef<number>(countdown);

  // 1. 매 카운트다운(10, 9, 8... 1)마다 화면 중앙에서 팝콘이 팡! 튀겨져 나오는 물리 연출
  const burstPopcorn = (count: number = 24, isMega: boolean = false) => {
    if (typeof window === 'undefined') return;

    const emojis = isMega 
      ? ['🍿', '🍿', '🍿', '✨', '🎉', '💥', '💛', '🍿']
      : ['🍿', '🍿', '🍿', '🌽', '✨', '🍿', '💥'];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 30;

    const newParticles: PopcornParticle[] = [];

    // 사운드 2~3회 연속 팝
    playPopcornPopSound();
    setTimeout(() => playPopcornPopSound(), 60);
    if (isMega) setTimeout(() => playPopcornPopSound(), 120);

    for (let i = 0; i < count; i++) {
      // 360도 전방위 + 상단 방향으로 더 힘차게 튀어오름
      const angle = Math.random() * Math.PI * 2;
      const speed = isMega ? (14 + Math.random() * 22) : (10 + Math.random() * 18);

      newParticles.push({
        id: Date.now() + Math.random() + i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: centerX + (Math.random() * 60 - 30),
        y: centerY + (Math.random() * 60 - 30),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (8 + Math.random() * 8), // 상단 점프력 부여
        size: isMega ? (28 + Math.random() * 24) : (22 + Math.random() * 20),
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 24,
        opacity: 1,
      });
    }

    setParticles((prev) => [...prev.slice(-60), ...newParticles]);
  };

  // countdown 변경 감지 시 팝콘 버스트 트리거
  useEffect(() => {
    if (countdown > 0 && countdown <= 10 && countdown !== prevCountdownRef.current) {
      burstPopcorn(24, false);
      prevCountdownRef.current = countdown;
    }
  }, [countdown]);

  // 0초 오픈 시 대형 팝콘 축포 폭발
  useEffect(() => {
    if (isOpenNow || openSplashVisible) {
      burstPopcorn(60, true);
    }
  }, [isOpenNow, openSplashVisible]);

  // 팝콘 중력 및 낙하 물리 시뮬레이션 루프
  useEffect(() => {
    if (particles.length === 0) return;

    const gravity = 0.65;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + gravity,
            rotation: p.rotation + p.rotSpeed,
            opacity: p.y > window.innerHeight ? 0 : p.opacity - 0.016,
          }))
          .filter((p) => p.opacity > 0 && p.y < window.innerHeight + 100)
      );
    }, 24);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <>
      {/* 1. 팝콘 파티클 튀는 레이어 (뒤 배경 블러 없이 원본 화면 완벽 투과) */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden select-none">
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              fontSize: `${p.size}px`,
              opacity: p.opacity,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* 2. 카운트다운 숫자 연출 레이어: 
             유저 요청: "블러처리하지말고 화면에 팝콘튀기듯한 연출과 10 나왓다가 사라지고 9 나왓다가사라지고~~ 이런식으로" 
             배경 어둡거나 흐림(blur) 일절 없이 완전 투명하게 유지!
      */}
      <div className="fixed inset-0 pointer-events-none z-[99] flex flex-col items-center justify-center select-none overflow-hidden">
        
        {/* 상단 컨트롤 바 (종료 및 서버시계 안내 - 클릭 가능하도록 pointer-events-auto) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xs border border-amber-300 shadow-lg text-xs font-bold text-stone-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="text-base animate-bounce">🍿</span>
            <span>팝콘 실시간 티켓팅</span>
          </span>
          <span className="text-stone-300">|</span>
          <span className="font-mono text-stone-600 text-[11px]">서버 시계: {serverTimeStr}</span>
          <span className="text-stone-300">|</span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-stone-400 hover:text-stone-800 transition-colors ml-1 cursor-pointer"
            title="카운트다운 닫기"
          >
            <X className="w-3.5 h-3.5" />
            <span className="text-[11px]">닫기</span>
          </button>
        </div>

        {/* 10초 ~ 1초 카운트다운: 매 초마다 팝! 튀어나왔다가 1초가 되기 전 사라짐 */}
        {countdown > 0 && !openSplashVisible ? (
          <div className="relative flex flex-col items-center justify-center">
            
            {/* 귀여운 팝콘 팡! 뱃지 */}
            <div 
              key={`badge-${countdown}`}
              className="mb-2 px-4 py-1.5 rounded-full bg-amber-500/90 text-white text-xs sm:text-sm font-black tracking-wider shadow-md animate-in zoom-in-50 duration-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>POP-CON COUNTDOWN</span>
              <span className="text-amber-200 font-mono">[{countdown}s]</span>
            </div>

            {/* 핵심: 매 초마다 팡! 튀어나왔다가 0.96초 시점에 슉 사라지는 대형 숫자 */}
            <div
              key={`popcorn-num-${countdown}`}
              className="animate-popcorn-number font-black text-8xl sm:text-[150px] md:text-[200px] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 drop-shadow-[0_12px_24px_rgba(217,119,6,0.65)] font-mono select-none"
              style={{
                WebkitTextStroke: '3px #78350f',
              }}
            >
              {countdown}
            </div>

            {/* 하단 팝콘 터짐 강조 문구 */}
            <div 
              key={`subtext-${countdown}`}
              className="mt-3 px-5 py-1.5 rounded-full bg-stone-900/80 text-amber-200 text-xs sm:text-sm font-bold shadow-md animate-in fade-in duration-200"
            >
              🍿 {countdown}초 뒤 전석 티켓 오픈! 준비하세요!
            </div>
          </div>
        ) : (
          /* 0초 도달 시: 팝콘 대폭발 & 즉시 예매 입장 배너 (pointer-events-auto로 버튼 클릭 가능) */
          <div className="relative pointer-events-auto flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white/95 border-3 border-amber-400 shadow-[0_20px_50px_rgba(245,158,11,0.45)] text-center max-w-md w-full mx-4 animate-in zoom-in-75 duration-300 space-y-4">
            
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-300/60 animate-bounce">
                <span className="text-4xl">🍿</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-black animate-ping">
                🔥
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black text-amber-600 tracking-wider">
                POP-CON LIVE TICKET OPEN
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                🍿 티켓이 오픈되었습니다!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                {eventTitle}
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:brightness-105 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 cursor-pointer active:scale-98 transition-all animate-pulse"
            >
              <Ticket className="w-5 h-5" />
              <span>지금 즉시 좌석 선택 입장하기</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="text-xs text-stone-400 hover:text-stone-700 underline font-medium cursor-pointer"
            >
              화면으로 돌아가기
            </button>
          </div>
        )}

      </div>
    </>
  );
};
