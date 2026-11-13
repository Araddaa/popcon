'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  X, 
  ChevronRight, 
  Ticket, 
  ChevronLeft, 
  Sparkles, 
  Sliders,
  Bell,
  BellRing
} from 'lucide-react';

export type PopupShapeType = 'ticket' | 'blob' | 'bubble' | 'stamp' | 'badge';

interface SpecialEventAlert {
  id: number;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  spot: string;
  initialSeconds: number;
  description: string;
  targetEventId: number;
  actionText: string;
  defaultShape: PopupShapeType;
}

interface LiveSpecialEventWidgetProps {
  onOpenEvent: (eventId: number) => void;
}

export const LiveSpecialEventWidget: React.FC<LiveSpecialEventWidgetProps> = ({
  onOpenEvent,
}) => {
  const [alerts] = useState<SpecialEventAlert[]>([
    {
      id: 1,
      badge: '티켓팅 오픈 임박',
      badgeBg: '#fee2e2',
      badgeText: '#991b1b',
      title: '지킬앤하이드 20주년',
      spot: '샤롯데씨어터 대극장',
      initialSeconds: 278, // 04분 38초
      description: '조승우 캐스팅 VIP석 1차 오픈',
      targetEventId: 20,
      actionText: '티켓팅 대기열 입장',
      defaultShape: 'ticket',
    },
    {
      id: 2,
      badge: '취소표 우선구매',
      badgeBg: '#ffe4e6',
      badgeText: '#9f1239',
      title: '잔망루피 윈터 팝업',
      spot: '성수 에스팩토리 D동',
      initialSeconds: 712, // 11분 52초
      description: '주말 14:00 취소표 32석 방출',
      targetEventId: 1,
      actionText: '취소표 신청',
      defaultShape: 'blob',
    },
    {
      id: 3,
      badge: '얼리버드 마감',
      badgeBg: '#dcfce7',
      badgeText: '#166534',
      title: '모네 360° 미디어아트',
      spot: '그라운드시소 성수',
      initialSeconds: 1480, // 24분 40초
      description: '얼리버드 30% 한정 종료 임박',
      targetEventId: 2,
      actionText: '할인 예매',
      defaultShape: 'bubble',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentAlert = alerts[currentIndex];

  // 관리자가 설정할 수 있는 팝업 모양 상태 (티켓 / 젤리 / 말풍선 / 우표 / 배지)
  const [currentShape, setCurrentShape] = useState<PopupShapeType>(alerts[0].defaultShape);
  const [showAdminTool, setShowAdminTool] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(alerts[0].initialSeconds);
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 감지: 처음 화면에서는 숨겨두고, 아래로 드래그(스크롤 300px 이상)해야 보이게 설정
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsVisible(window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state when switching alert item
  useEffect(() => {
    setSecondsLeft(alerts[currentIndex].initialSeconds);
    setCurrentShape(alerts[currentIndex].defaultShape);
    setIsAlertSubscribed(false);
  }, [currentIndex, alerts]);

  // Real-time ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % alerts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
  };

  // 1. 관리자 설정 가능한 불규칙 문양 스타일 매핑
  const getShapeStyles = (shape: PopupShapeType) => {
    switch (shape) {
      case 'ticket':
        // 티켓 펀칭 모양: 좌우 반원형 컷아웃 노치
        return {
          wrapperClass: 'rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] relative bg-white',
          hasTicketNotches: true,
          label: '🎟️ 티켓 펀칭형',
        };
      case 'blob':
        // 비정형 올가닉 젤리/스티커: 4개 모서리 반경이 제각각 다른 불규칙 모양
        return {
          wrapperClass: 'rounded-[30px_10px_26px_8px] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] relative bg-white -rotate-1 hover:rotate-0 transition-transform duration-200',
          hasTicketNotches: false,
          label: '🫧 비정형 젤리형',
        };
      case 'bubble':
        // 팝아트 말풍선 모양: 우하단이 뾰족하게 빠진 스피치버블
        return {
          wrapperClass: 'rounded-[22px_22px_4px_22px] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] relative bg-white',
          hasTicketNotches: false,
          hasBubbleTail: true,
          label: '💬 팝 말풍선형',
        };
      case 'stamp':
        // 우표 / 스탬프 톱니 모양
        return {
          wrapperClass: 'rounded-xl border-2 border-dashed border-stone-900 shadow-[4px_4px_0px_#1c1917] relative bg-white p-0.5',
          hasTicketNotches: false,
          isStamp: true,
          label: '🏷️ 우표 스탬프형',
        };
      case 'badge':
        // 대각선 챔퍼 컷 배지 모양
        return {
          wrapperClass: 'rounded-[26px_4px_26px_4px] border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] relative bg-white',
          hasTicketNotches: false,
          label: '⚡ 챔퍼 배지형',
        };
      default:
        return {
          wrapperClass: 'rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_#1c1917] relative bg-white',
          hasTicketNotches: false,
          label: '기본형',
        };
    }
  };

  const currentStyle = getShapeStyles(currentShape);

  // If user dismissed, show compact pulsing pill
  if (isDismissed) {
    return (
      <aside className={`hidden xl:block fixed right-4 2xl:right-8 top-44 2xl:top-52 z-30 select-none transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}>
        <button
          onClick={() => setIsDismissed(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] hover:scale-105 transition-all text-xs font-black cursor-pointer"
          title="실시간 팝업 알림 펼치기"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-mono text-stone-900 font-black">{minutes}:{seconds}</span>
          <span className="text-[10px] text-stone-500">열기</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className={`hidden xl:block fixed right-3 2xl:right-7 top-44 2xl:top-52 z-30 w-[240px] 2xl:w-[255px] select-none transition-all duration-300 ease-out ${
      isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
    }`}>
      
      {/* 관리자 모양 설정 도구 토글 버튼 */}
      <div className="flex justify-end mb-1">
        <button
          onClick={() => setShowAdminTool(!showAdminTool)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-bold border border-stone-300 cursor-pointer transition-colors"
          title="팝업을 발행하는 관리자가 모양을 커스텀 설정하는 메뉴"
        >
          <Sliders className="w-3 h-3 text-stone-500" />
          <span>관리자 모양 설정</span>
        </button>
      </div>

      {/* 관리자 팝업 모양 선택기 (확장성: 클릭 시 실시간으로 불규칙 모양 즉시 전환) */}
      {showAdminTool && (
        <div className="mb-2 p-2.5 rounded-2xl bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[10px] font-black text-stone-700">
            <span>[관리자 콘솔] 팝업 모양 선택</span>
            <span className="text-stone-400 font-mono text-[9px]">{currentStyle.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10.5px]">
            <button
              onClick={() => setCurrentShape('ticket')}
              className={`px-2 py-1 rounded-lg border font-bold text-left flex items-center gap-1 cursor-pointer transition-all ${
                currentShape === 'ticket' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>🎟️ 티켓 펀칭</span>
            </button>
            <button
              onClick={() => setCurrentShape('blob')}
              className={`px-2 py-1 rounded-lg border font-bold text-left flex items-center gap-1 cursor-pointer transition-all ${
                currentShape === 'blob' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>🫧 젤리 비정형</span>
            </button>
            <button
              onClick={() => setCurrentShape('bubble')}
              className={`px-2 py-1 rounded-lg border font-bold text-left flex items-center gap-1 cursor-pointer transition-all ${
                currentShape === 'bubble' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>💬 팝 말풍선</span>
            </button>
            <button
              onClick={() => setCurrentShape('stamp')}
              className={`px-2 py-1 rounded-lg border font-bold text-left flex items-center gap-1 cursor-pointer transition-all ${
                currentShape === 'stamp' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>🏷️ 우표 스탬프</span>
            </button>
            <button
              onClick={() => setCurrentShape('badge')}
              className={`col-span-2 px-2 py-1 rounded-lg border font-bold text-center flex items-center justify-center gap-1 cursor-pointer transition-all ${
                currentShape === 'badge' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>⚡ 대각선 챔퍼 배지</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. 메인 불규칙 문양 팝업 카드 (작고 개성 있는 형태) */}
      <div className={`${currentStyle.wrapperClass} p-3.5 space-y-2.5`}>
        
        {/* 티켓 펀칭형일 때 좌우 반원 펀칭 노치 */}
        {currentStyle.hasTicketNotches && (
          <>
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#faf9f6] border-r-2 border-stone-900 z-10" />
            <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#faf9f6] border-l-2 border-stone-900 z-10" />
          </>
        )}

        {/* 말풍선형일 때 우하단 꼬리 */}
        {currentStyle.hasBubbleTail && (
          <div className="absolute -bottom-2 right-4 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-stone-900 rotate-45" />
        )}

        {/* Top Header: Live Badge + Carousel controls + Dismiss */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
            </span>
            <span className="text-[10px] font-black tracking-wider text-rose-600 uppercase">
              실시간 오픈
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="w-4 h-4 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-900 flex items-center justify-center cursor-pointer"
              title="이전 이벤트"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="text-[9px] font-mono font-bold text-stone-400">
              {currentIndex + 1}/{alerts.length}
            </span>
            <button
              onClick={handleNext}
              className="w-4 h-4 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-900 flex items-center justify-center cursor-pointer"
              title="다음 이벤트"
            >
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="w-4 h-4 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center ml-0.5 cursor-pointer"
              title="팝업 닫기"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Compact Countdown Bar */}
        <div className="px-2.5 py-1.5 rounded-xl bg-stone-900 text-white flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold">
            <Clock className="w-3 h-3" />
            <span>티켓팅 시작</span>
          </div>
          <div className="font-mono text-xs font-black text-amber-300 tracking-wider">
            {minutes}:{seconds}
          </div>
        </div>

        {/* Event Content (간결하고 핵심적인 정보) */}
        <div className="space-y-0.5 text-left">
          <div className="flex items-center justify-between">
            <span
              className="text-[9px] font-black px-1.5 py-0.2 rounded"
              style={{ backgroundColor: currentAlert.badgeBg, color: currentAlert.badgeText }}
            >
              {currentAlert.badge}
            </span>
            <span className="text-[9.5px] text-stone-400 truncate max-w-[120px] font-medium">
              {currentAlert.spot}
            </span>
          </div>

          <h4 className="text-xs font-black text-stone-900 leading-snug truncate pt-0.5">
            {currentAlert.title}
          </h4>
          <p className="text-[10px] text-stone-500 line-clamp-1">
            {currentAlert.description}
          </p>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => onOpenEvent(currentAlert.targetEventId)}
          className="w-full py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-2xs transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <Ticket className="w-3 h-3 text-amber-300" />
          <span>{currentAlert.actionText} →</span>
        </button>

      </div>

    </aside>
  );
};
