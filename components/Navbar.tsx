'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Compass, 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  Trophy, 
  Clock, 
  Heart, 
  Bell, 
  User, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  Settings,
  X,
  Sparkles,
  Shield,
  ExternalLink
} from 'lucide-react';
import { PopcornLogo } from './PopcornLogo';
import { mockEvents } from '../data/mockData';

export type MainNavTab = 'explore' | 'calendar' | 'map' | 'gatherings' | 'ticketbook' | 'taste' | 'waitlist' | 'wishlist' | 'search';

interface NavbarProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistCount: number;
  currentUser: { name: string; email: string; role: 'user' | 'organizer' | 'admin' } | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenOrganizerStudio: () => void;
  onOpenTicketPocket: () => void;
  onOpenSpecDrawer?: () => void;
  onSelectEventById: (id: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  wishlistCount,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenOrganizerStudio,
  onOpenTicketPocket,
  onSelectEventById,
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [notiOpen, setNotiOpen] = useState(false);
  const [notiCount, setNotiCount] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notiRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Mouse hover handlers for mega-menu expansion
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 180);
  };

  const handleNavigate = (tab: MainNavTab) => {
    setActiveTab(tab);
    setIsMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Global hotkey Ctrl+K / Cmd+K to navigate to search screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNavigate('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={navContainerRef}
      className="sticky top-0 z-40 bg-white border-b-2 border-stone-900 select-none"
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Main Clean Top Bar */}
      <header className="px-4 lg:px-8 py-3 bg-white relative z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Brand Logo & Interactive Top Navigation (글자 줄바꿈 방지: whitespace-nowrap) */}
          <div className="flex items-center gap-4 sm:gap-7 min-w-0">
            <div 
              onClick={() => handleNavigate('explore')}
              className="cursor-pointer flex-shrink-0 group flex items-center"
              title="팝콘 홈으로 이동"
            >
              <PopcornLogo size="md" />
            </div>

            {/* Top Primary Navigation Links with Expand Trigger on Hover (항상 한 줄 고정) */}
            <nav 
              onMouseEnter={handleMouseEnter}
              className="hidden md:flex items-center gap-1 lg:gap-2 whitespace-nowrap flex-shrink-0 text-xs sm:text-sm font-bold"
            >
              <button
                onClick={() => handleNavigate('explore')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'explore'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                <span className="whitespace-nowrap">둘러보기</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-amber-400' : 'text-stone-400'}`} />
              </button>

              <button
                onClick={() => handleNavigate('calendar')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'calendar'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                <span className="whitespace-nowrap">일정 캘린더</span>
              </button>

              <button
                onClick={() => handleNavigate('map')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'map'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                <span className="whitespace-nowrap">지도 탐색</span>
              </button>

              <button
                onClick={() => handleNavigate('gatherings')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'gatherings'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                <span className="whitespace-nowrap">동행 모임</span>
              </button>

              <button
                onClick={handleMouseEnter}
                className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0"
                title="전체 메뉴 확장"
              >
                <span className="whitespace-nowrap">전체 서비스</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </nav>
          </div>

          {/* Right: Search Button (검색 버튼을 누르면 검색창으로 전환) + 찜 + 알림 + 내 티켓 + 프로필 */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* 돋보기 버튼만 제공 (클릭 시 중앙 화면이 검색창으로 전환) */}
            <button
              onClick={() => handleNavigate('search')}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'search'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                  : 'bg-white border-stone-300 hover:border-stone-900 text-stone-700 hover:bg-stone-50'
              }`}
              aria-label="통합 검색"
              title="통합 검색으로 이동"
            >
              <Search className="w-4 h-4 text-current" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavigate('wishlist')}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-stone-300 hover:border-stone-900 text-stone-700'
              }`}
              title="관심 행사 찜 목록"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
              <span className="hidden sm:inline font-mono">{wishlistCount}</span>
            </button>

            {/* Notification Bell */}
            <div ref={notiRef} className="relative">
              <button
                onClick={() => setNotiOpen(!notiOpen)}
                className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
                aria-label="알림"
              >
                <Bell className="w-4 h-4" />
                {notiCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-black flex items-center justify-center">
                    {notiCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notiOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_#1c1917] p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-bold text-stone-900">실시간 알림</span>
                    <button
                      onClick={() => setNotiCount(0)}
                      className="text-[11px] text-stone-500 hover:underline cursor-pointer"
                    >
                      모두 읽음
                    </button>
                  </div>
                  <div className="space-y-2 pt-2 max-h-60 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                        <span>취소표 알림 발급!</span>
                        <span className="font-mono text-[10px]">방금 전</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        신청하신 뮤지컬 지킬앤하이드 취소표 우선구매권이 발급되었습니다.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                        <span>동행 모임 초대</span>
                        <span className="font-mono text-[10px]">10분 전</span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        민우님이 잔망루피 팝업 일정 맞추기 방에 초대했습니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* My Ticket Button */}
            <button
              onClick={onOpenTicketPocket}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
              title="모바일 QR 티켓 지갑 열기"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">내 티켓</span>
            </button>

            {/* User Profile / Auth Action Buttons */}
            {!currentUser ? (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  로그인
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-all shadow-xs cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-900" />
                  <span>회원가입</span>
                </button>
              </div>
            ) : (
              <div ref={userMenuRef} className="relative flex-shrink-0">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center font-black text-[11px]">
                    {currentUser.name?.[0] || '유'}
                  </div>
                  <span className="hidden sm:inline">{currentUser.name} 님</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_#1c1917] p-2 z-50 text-xs">
                    <div className="p-2 border-b border-stone-100">
                      <p className="font-black text-stone-900">{currentUser.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          handleNavigate('ticketbook');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 font-bold text-stone-700 cursor-pointer"
                      >
                        <Ticket className="w-3.5 h-3.5 text-stone-500" />
                        <span>모바일 티켓북 &amp; 결산</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavigate('wishlist');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-2 font-bold text-stone-700 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>관심 행사 찜 ({wishlistCount})</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAuth('signup');
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-amber-50 flex items-center gap-2 font-bold text-amber-900 cursor-pointer border-t border-stone-100 mt-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>회원가입 폼 열기</span>
                      </button>
                    </div>
                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </header>

      {/* 2. Expanded Mega-Menu Dropdown (마우스 갖다대면 헤더가 아래로 확장되면서 메뉴 선택) */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`absolute left-0 right-0 top-full bg-white border-b-2 border-stone-900 shadow-[0_16px_36px_rgba(0,0,0,0.14)] transition-all duration-300 ease-out overflow-hidden z-20 ${
          isMegaMenuOpen
            ? 'max-h-[500px] opacity-100 py-6'
            : 'max-h-0 opacity-0 py-0 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Column 1: 탐색 & 둘러보기 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-stone-900">
                <Compass className="w-4 h-4 text-stone-900" />
                <h4 className="text-xs font-black tracking-wider uppercase text-stone-900">탐색 &amp; 둘러보기</h4>
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => handleNavigate('explore')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'explore'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      전체 피드 둘러보기
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                    <span className={`text-[11px] ${activeTab === 'explore' ? 'text-stone-300' : 'text-stone-500'}`}>
                      공연 · 전시 · 팝업 실시간 큐레이션
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('map')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'map'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      내 주변 지도 탐색
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                    <span className={`text-[11px] ${activeTab === 'map' ? 'text-stone-300' : 'text-stone-500'}`}>
                      성수 · 잠실 · 홍대 핫스팟 지도
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: 일정 & 예매 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-stone-900">
                <Calendar className="w-4 h-4 text-stone-900" />
                <h4 className="text-xs font-black tracking-wider uppercase text-stone-900">일정 &amp; 예매</h4>
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => handleNavigate('calendar')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'calendar'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      일정 캘린더
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                    <span className={`text-[11px] ${activeTab === 'calendar' ? 'text-stone-300' : 'text-stone-500'}`}>
                      날짜별 전시 &amp; 오픈 D-Day 일정표
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('waitlist')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'waitlist'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      취소표 대기 신청
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">우선권</span>
                    </span>
                    <span className={`text-[11px] ${activeTab === 'waitlist' ? 'text-stone-300' : 'text-stone-500'}`}>
                      매진 회차 실시간 취소표 알림
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: 소셜 & 동행 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-stone-900">
                <Users className="w-4 h-4 text-stone-900" />
                <h4 className="text-xs font-black tracking-wider uppercase text-stone-900">소셜 &amp; 동행</h4>
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => handleNavigate('gatherings')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'gatherings'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      동행 모임 (언제 볼래?)
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                    <span className={`text-[11px] ${activeTab === 'gatherings' ? 'text-stone-300' : 'text-stone-500'}`}>
                      친구 초대 · 날짜 투표 · 연석 분할 결제
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('taste')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'taste'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      컬처 취향 월드컵
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                    <span className={`text-[11px] ${activeTab === 'taste' ? 'text-stone-300' : 'text-stone-500'}`}>
                      나만의 문화 취향 8강 토너먼트
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: 마이 컬처 & 지갑 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-stone-900">
                <Ticket className="w-4 h-4 text-stone-900" />
                <h4 className="text-xs font-black tracking-wider uppercase text-stone-900">마이 컬처</h4>
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => {
                      setIsMegaMenuOpen(false);
                      onOpenTicketPocket();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-800 transition-all flex flex-col cursor-pointer"
                  >
                    <span className="font-bold flex items-center justify-between text-rose-600">
                      모바일 QR 티켓 지갑
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </span>
                    <span className="text-[11px] text-stone-500">
                      30초 안심 캡처방지 입장 QR
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('ticketbook')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'ticketbook'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      내 티켓북 &amp; 연간 결산
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </span>
                    <span className={`text-[11px] ${activeTab === 'ticketbook' ? 'text-stone-300' : 'text-stone-500'}`}>
                      1년 컬처 레시피 (Wrapped) 인포그래픽
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('wishlist')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                      activeTab === 'wishlist'
                        ? 'bg-stone-900 text-white font-bold'
                        : 'hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span className="font-bold flex items-center justify-between">
                      관심 행사 찜 목록
                      <span className="font-mono text-rose-500 font-bold">{wishlistCount}개</span>
                    </span>
                    <span className={`text-[11px] ${activeTab === 'wishlist' ? 'text-stone-300' : 'text-stone-500'}`}>
                      알림 신청 및 빠른 예매
                    </span>
                  </button>
                </li>
                <li className="pt-2 border-t border-stone-200">
                  <button
                    onClick={() => {
                      setIsMegaMenuOpen(false);
                      onOpenOrganizerStudio();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-400 text-stone-900 transition-all flex flex-col cursor-pointer"
                  >
                    <span className="font-black flex items-center justify-between text-amber-950">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-rose-600" />
                        <span>통합 관리자 콘솔</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-300 text-amber-950 font-black">ADMIN</span>
                    </span>
                    <span className="text-[11px] text-amber-800 mt-0.5">
                      회원 이용정지 · 지도 · 좌석배치도 설정
                    </span>
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Dimmed backdrop when mega menu is expanded */}
      {isMegaMenuOpen && (
        <div 
          className="fixed inset-0 top-[65px] bg-black/20 backdrop-blur-[1px] -z-10 transition-opacity duration-200 pointer-events-none" 
        />
      )}
    </div>
  );
};
