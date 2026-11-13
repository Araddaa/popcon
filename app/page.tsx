'use client';

import React, { useState, useMemo } from 'react';
import { Navbar, MainNavTab } from '../components/Navbar';
import { CategoryPills } from '../components/CategoryPills';
import { CategoryRemote } from '../components/CategoryRemote';
import { HeroBanner } from '../components/HeroBanner';
import { EventCard } from '../components/EventCard';
import { EventDetailPage } from '../components/EventDetailPage';
import { SearchView } from '../components/SearchView';
import { LiveSpecialEventWidget } from '../components/LiveSpecialEventWidget';
import { GroupBookingRoom } from '../components/GroupBookingRoom';
import { BookingSuccessModal } from '../components/BookingSuccessModal';
import { BookingFlowModal } from '../components/BookingFlowModal';
import { MobileTicketModal } from '../components/MobileTicketModal';
import { SeatStudio } from '../components/SeatStudio';
import { AdminConsole } from '../components/AdminConsole';
import { CultureRecipe } from '../components/CultureRecipe';
import { AuthModal } from '../components/AuthModal';
import { NearbyView } from '../components/NearbyView';
import { WishlistView } from '../components/WishlistView';
import { CalendarView } from '../components/CalendarView';
import { GatheringsView } from '../components/GatheringsView';
import { WaitlistView } from '../components/WaitlistView';
import { TasteWorldcupModal } from '../components/TasteWorldcupModal';
import { SpecNavDrawer } from '../components/SpecNavDrawer';
import { LuckyDrawRaffle } from '../components/LuckyDrawRaffle';
import { SeongsuCourseGuide } from '../components/SeongsuCourseGuide';
import { PopcornConfetti, PopcornConfettiRef } from '../components/PopcornConfetti';
import { mockEvents, heroBanners } from '../data/mockData';
import { CultureEvent, SpecScreenItem } from '../types';
import { X, ArrowLeft, Sparkles, Ticket, ChevronDown } from 'lucide-react';

export default function Home() {
  const confettiRef = React.useRef<PopcornConfettiRef>(null);
  const triggerConfetti = () => {
    confettiRef.current?.trigger();
  };

  // Global Tab Navigation
  const [activeTab, setActiveTab] = useState<MainNavTab>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // Wishlist State (Default: Loopy #1 & Ghibli #5)
  const [wishlist, setWishlist] = useState<number[]>([1, 5]);

  // Modals & Overlays
  const [selectedEvent, setSelectedEvent] = useState<CultureEvent | null>(null);
  const [groupBookingEvent, setGroupBookingEvent] = useState<CultureEvent | null>(null);
  const [bookingFlowEvent, setBookingFlowEvent] = useState<CultureEvent | null>(null);
  const [mobileTicketEvent, setMobileTicketEvent] = useState<CultureEvent | null>(null);
  const [mobileTicketOpen, setMobileTicketOpen] = useState<boolean>(false);
  const [studioOpen, setStudioOpen] = useState<boolean>(false);
  const [recipeOpen, setRecipeOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('signup');
  const [tasteWorldcupOpen, setTasteWorldcupOpen] = useState<boolean>(false);
  const [specDrawerOpen, setSpecDrawerOpen] = useState<boolean>(false);

  // 유저 요청: "티켓팅 예매 여기선 새로고침해도 그페이지에 머물게해줘"
  // 1) 새로고침 시에도 현재 보고 있던 행사 상세 및 티켓팅 예매 상태 유지 (URL 쿼리 & localStorage 동기화)
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get('event');
      const bookingParam = params.get('booking');
      const tabParam = params.get('tab') as MainNavTab | null;

      // URL 파라미터 우선, 없을 시 localStorage에서 복원
      const savedEventId = eventParam || localStorage.getItem('popcon_last_event_id');
      const savedBooking =
        bookingParam === '1' ||
        bookingParam === 'true' ||
        localStorage.getItem('popcon_booking_flow') === 'true';

      const catParam = params.get('category');
      if (catParam) {
        setSelectedCategory(catParam);
      }

      const authParam = params.get('auth');
      const signupParam = params.get('signup');
      if (signupParam === '1' || authParam === 'signup') {
        setAuthModalTab('signup');
        setAuthModalOpen(true);
      } else if (authParam === 'login' || params.get('login') === '1') {
        setAuthModalTab('login');
        setAuthModalOpen(true);
      }

      if (savedEventId) {
        const found = mockEvents.find((e) => String(e.id) === String(savedEventId));
        if (found) {
          setSelectedEvent(found);
          if (savedBooking) {
            setBookingFlowEvent(found);
          }
        }
      } else if (
        tabParam &&
        ['explore', 'calendar', 'map', 'gatherings', 'ticketbook', 'waitlist', 'wishlist', 'taste', 'search'].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    } catch (e) {
      console.error('URL 또는 상태 복원 중 오류:', e);
    } finally {
      setIsHydrated(true);
    }

    // 브라우저 뒤로가기 / 앞으로가기(popstate) 동기화
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const evId = p.get('event');
      const isBk = p.get('booking') === '1' || p.get('booking') === 'true';
      const tb = p.get('tab') as MainNavTab | null;

      if (evId) {
        const ev = mockEvents.find((e) => String(e.id) === String(evId));
        if (ev) {
          setSelectedEvent(ev);
          setBookingFlowEvent(isBk ? ev : null);
          return;
        }
      }
      setSelectedEvent(null);
      setBookingFlowEvent(null);
      if (tb && ['explore', 'calendar', 'map', 'gatherings', 'ticketbook', 'waitlist', 'wishlist'].includes(tb)) {
        setActiveTab(tb);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2) 행사 선택 / 예매 모달 / 탭 변경 시 실시간으로 URL과 localStorage에 반영
  React.useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams();

      if (selectedEvent) {
        params.set('event', String(selectedEvent.id));
        localStorage.setItem('popcon_last_event_id', String(selectedEvent.id));

        if (bookingFlowEvent) {
          params.set('booking', '1');
          localStorage.setItem('popcon_booking_flow', 'true');
        } else {
          localStorage.removeItem('popcon_booking_flow');
        }
      } else {
        localStorage.removeItem('popcon_last_event_id');
        localStorage.removeItem('popcon_booking_flow');

        if (activeTab !== 'explore') {
          params.set('tab', activeTab);
        }
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
      window.history.replaceState(
        { eventId: selectedEvent?.id, isBooking: Boolean(bookingFlowEvent), tab: activeTab },
        '',
        newUrl
      );
    } catch (e) {
      console.error('URL 동기화 중 오류:', e);
    }
  }, [selectedEvent, bookingFlowEvent, activeTab, isHydrated]);

  // Left Wing Remote Control (유저 요청: 저 영역은 내리면 왼쪽에 리모콘처럼 붙게해보자)
  const [isRemoteVisible, setIsRemoteVisible] = useState<boolean>(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsRemoteVisible(window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // User State
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: 'user' | 'organizer' | 'admin';
  } | null>({
    name: '김민우',
    email: 'minwoo@popcon.kr',
    role: 'user',
  });

  const toggleWishlist = (id: number) => {
    const isAdding = !wishlist.includes(id);
    if (isAdding) {
      setTimeout(() => triggerConfetti(), 0);
    }
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTabChange = (tab: MainNavTab) => {
    setSelectedEvent(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Search-filtered base events
  const searchedEvents = useMemo(() => {
    if (!searchQuery.trim()) return mockEvents;
    const q = searchQuery.toLowerCase();
    return mockEvents.filter(
      (ev) =>
        ev.title.toLowerCase().includes(q) ||
        ev.spot.toLowerCase().includes(q) ||
        ev.categoryName.toLowerCase().includes(q) ||
        ev.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Dynamic filter for Explore tab (Strict 6 Categories separation)
  const filteredEvents = useMemo(() => {
    return searchedEvents.filter((ev) => {
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }
      if (selectedLocation && !ev.location.includes(selectedLocation) && !ev.spot.includes(selectedLocation)) {
        return false;
      }
      return true;
    });
  }, [searchedEvents, selectedCategory, selectedLocation]);

  // Handle Spec Drawer Navigation (Deep links from 75 screens in v1.6 Spec)
  const handleSpecScreenNavigate = (screen: SpecScreenItem) => {
    const url = screen.url.toLowerCase();

    if (url.includes('calendar')) {
      setActiveTab('calendar');
    } else if (url.includes('map')) {
      setActiveTab('map');
    } else if (url.includes('gathering')) {
      setActiveTab('gatherings');
    } else if (url.includes('ticketbook') || url.includes('recap')) {
      setActiveTab('ticketbook');
    } else if (url.includes('worldcup') || url.includes('taste')) {
      setTasteWorldcupOpen(true);
    } else if (url.includes('waitlist')) {
      setActiveTab('waitlist');
    } else if (url.includes('wishlist')) {
      setActiveTab('wishlist');
    } else if (url.includes('layouts') || url.includes('grades') || url.includes('partner/events')) {
      setStudioOpen(true);
    } else if (url.includes('group')) {
      const target = mockEvents.find((e) => e.category === 'performance') || mockEvents[0];
      setGroupBookingEvent(target);
    } else if (url.includes('seats') || url.includes('booking') || url.includes('queue') || url.includes('pay')) {
      const target = mockEvents.find((e) => e.category === 'performance') || mockEvents[0];
      setBookingFlowEvent(target);
    } else if (url.includes('ticket') || url.includes('transfer') || url.includes('checkin')) {
      setMobileTicketEvent(mockEvents[0]);
      setMobileTicketOpen(true);
    } else if (url.includes('events/')) {
      setSelectedEvent(mockEvents[0]);
    } else {
      setActiveTab('explore');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 flex flex-col font-sans selection:bg-stone-200">
      
      {/* Top Navbar (Common Header with S-04 Autocomplete, N-05 SSE Badge, M-10 Banner, Role switcher) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onOpenAuth={(mode = 'signup') => {
          setAuthModalTab(mode);
          setAuthModalOpen(true);
        }}
        onLogout={() => {
          setCurrentUser(null);
          alert('로그아웃 되었습니다.');
        }}
        onOpenOrganizerStudio={() => setStudioOpen(true)}
        onOpenTicketPocket={() => {
          setMobileTicketEvent(mockEvents[0]);
          setMobileTicketOpen(true);
        }}
        onOpenSpecDrawer={() => setSpecDrawerOpen(true)}
        onSelectEventById={(id) => {
          const ev = mockEvents.find((e) => e.id === id);
          if (ev) setSelectedEvent(ev);
        }}
      />

      {/* Side Wing: 우측 여백 공간 활용 실시간 특수 이벤트 알림 위젯 (티켓팅 카운트다운) */}
      <LiveSpecialEventWidget
        onOpenEvent={(id) => {
          const ev = mockEvents.find((e) => e.id === id);
          if (ev) {
            setSelectedEvent(ev);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }}
      />

      {/* Left Wing Remote: 유저 요청 - 두번째사진은 저 영역은 내리면 왼쪽에 리모콘처럼 붙게해보자 */}
      <CategoryRemote
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        isVisible={activeTab === 'explore' && isRemoteVisible && !selectedEvent}
      />

      {/* Main Container (전체 여백을 살짝 더 넓혀 시원하게 배치) */}
      <main className="max-w-5xl w-full mx-auto px-5 sm:px-8 lg:px-10 py-7 sm:py-9 flex-1">
        
        {/* Dedicated Event Detail Page (C-05, C-10, T-05: 모달이 아닌 독립 상세 페이지) */}
        {selectedEvent ? (
          <EventDetailPage
            event={selectedEvent}
            onBack={() => {
              setSelectedEvent(null);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onBookTickets={(ev) => setBookingFlowEvent(ev)}
            onGroupBooking={(ev) => setGroupBookingEvent(ev)}
            onWaitlistApply={(ev) => {
              setSelectedEvent(null);
              setActiveTab('waitlist');
            }}
            isLiked={wishlist.includes(selectedEvent.id)}
            onToggleLike={() => toggleWishlist(selectedEvent.id)}
          />
        ) : (
          <>
            {/* ================= VIEW 1: 둘러보기 (EXPLORE / FEED) ================= */}
            {activeTab === 'explore' && (
              <div className="space-y-10">

                {/* [Fold 1] 첫 화면: 오직 회전하는 카드 배너만 화면 가득 노출 (100vh 뷰포트 분리) */}
                <section className="min-h-[calc(100vh-100px)] flex flex-col justify-between items-center py-2 sm:py-4">
                  <div className="w-full my-auto flex flex-col items-center">
                    <HeroBanner
                      banners={heroBanners}
                      selectedCategory="all"
                      onSelectEvent={(id) => {
                        const target = mockEvents.find((e) => e.id === id) || mockEvents[0];
                        setSelectedEvent(target);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                    />
                  </div>

                  {/* 아래로 스크롤 유도 인디케이터 (드래그나 스크롤 시 둘러보기 목록으로 부드럽게 이동) */}
                  <div 
                    onClick={() => {
                      const feedEl = document.getElementById('explore-feed-section');
                      if (feedEl) {
                        feedEl.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
                      }
                    }}
                    className="pt-2 pb-1 flex flex-col items-center gap-1.5 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors group select-none"
                    title="전체 문화 행사 목록 둘러보기"
                  >
                    <span className="text-[11px] font-bold tracking-tight">아래로 스크롤하여 전체 행사 둘러보기</span>
                    <ChevronDown className="w-4 h-4 text-stone-400 group-hover:text-stone-700 animate-bounce transition-transform" />
                  </div>
                </section>

                {/* [Fold 2] 첫 화면 아래로 스크롤/드래그 시 나타나는 전체 행사 목록 & 필터 피드 */}
                <section id="explore-feed-section" className="space-y-6 pt-10 border-t-2 border-stone-200 scroll-mt-20">
                  {/* 2. C-08: Category & Location Filter Bar (회전 카드 아래 배치되어 아래 피드와 연동) */}
                  <CategoryPills
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    selectedLocation={selectedLocation}
                    onSelectLocation={setSelectedLocation}
                  />

                  {/* Popup Raffle (Only for 팝업스토어) */}
                  {selectedCategory === 'popup' && (
                    <LuckyDrawRaffle onTriggerConfetti={triggerConfetti} />
                  )}

                  {/* Section Header & Sorter */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
                        {selectedCategory === 'all'
                          ? '전체 문화 행사'
                          : selectedCategory === 'performance'
                          ? '공연 (뮤지컬 · 콘서트 · 연극)'
                          : selectedCategory === 'movie'
                          ? '영화 (독립영화 · GV · 기획전)'
                          : selectedCategory === 'exhibition'
                          ? '전시 (미디어아트 · 미술 · 사진)'
                          : selectedCategory === 'popup'
                          ? '팝업스토어 (브랜드 · 캐릭터)'
                          : selectedCategory === 'collab_cafe'
                          ? '콜라보카페 (테마 · 애니)'
                          : '축제 (페스티벌 · 야외축제)'}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">
                        {filteredEvents.length}개의 행사가 실시간 예매 및 회차 예약 중입니다.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <button className="px-3 py-1.5 rounded-lg bg-stone-900 font-bold text-white border border-stone-900">
                        인기순
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-stone-400 font-medium">
                        오픈임박순
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-stone-400 font-medium">
                        최신순
                      </button>
                    </div>
                  </div>

                  {/* Event Cards Grid */}
                  {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredEvents.map((ev) => (
                        <EventCard
                          key={ev.id}
                          event={ev}
                          onOpenDetail={(target) => setSelectedEvent(target)}
                          isLiked={wishlist.includes(ev.id)}
                          onToggleLike={() => toggleWishlist(ev.id)}
                          onBookGroup={() => setGroupBookingEvent(ev)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-16 text-center rounded-2xl bg-white border-2 border-stone-900 text-stone-400">
                      <p className="text-base font-semibold">선택한 조건의 행사가 없습니다.</p>
                      <p className="text-xs mt-1">다른 카테고리나 지역을 선택해보세요.</p>
                    </div>
                  )}

                  {/* Walking Course Guide (Only for 팝업스토어 or all) */}
                  {(selectedCategory === 'popup' || selectedCategory === 'all') && (
                    <SeongsuCourseGuide
                      onSelectEvent={(id) => {
                        const target = mockEvents.find((e) => e.id === id) || mockEvents[0];
                        setSelectedEvent(target);
                      }}
                      onTriggerConfetti={triggerConfetti}
                    />
                  )}

                  {/* Bottom Quick Card: Ticketbook & Recap Banner */}
                  <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#1c1917]">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#fef9c3] text-[#854d0e] border border-amber-300 font-bold text-xs">
                        나의 티켓북 &amp; 연말 결산 [H-01 ~ H-04]
                      </span>
                      <h3 className="text-lg font-black text-stone-900">
                        내가 모은 티켓 스탬프와 1년 문화 레시피 확인하기
                      </h3>
                      <p className="text-xs text-stone-500">
                        방문 완료한 행사 데이터와 모바일 입장 QR 티켓을 열어보세요.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('ticketbook')}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all flex-shrink-0"
                    >
                      내 티켓북 열기
                    </button>
                  </div>
                </section>
              </div>
            )}

        {/* ================= VIEW 2: 일정 캘린더 (CALENDAR) ================= */}
        {activeTab === 'calendar' && (
          <CalendarView
            events={mockEvents}
            onOpenEvent={(ev) => setSelectedEvent(ev)}
          />
        )}

        {/* ================= VIEW 3: 지도 탐색 (MAP / NEARBY) ================= */}
        {activeTab === 'map' && (
          <NearbyView
            events={mockEvents}
            onOpenEvent={(ev) => setSelectedEvent(ev)}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onGoToGroupBooking={(ev) => setGroupBookingEvent(ev)}
          />
        )}

        {/* ================= VIEW 4: 모임 방 (GATHERINGS / 언제 볼래) ================= */}
        {activeTab === 'gatherings' && (
          <GatheringsView
            events={mockEvents}
            onOpenEvent={(ev) => setSelectedEvent(ev)}
          />
        )}

        {/* ================= VIEW 5: 내 티켓북 & 결산 (TICKETBOOK / RECAP) ================= */}
        {activeTab === 'ticketbook' && (
          <CultureRecipe />
        )}

        {/* ================= VIEW 6: 취향 월드컵 (TASTE WORLDCUP) ================= */}
        {activeTab === 'taste' && (
          <div className="py-4">
            <TasteWorldcupModal
              isOpen={true}
              onClose={() => setActiveTab('explore')}
              events={mockEvents}
              onOpenEvent={(ev) => setSelectedEvent(ev)}
            />
          </div>
        )}

        {/* ================= VIEW 7: 취소표 대기 (WAITLIST) ================= */}
        {activeTab === 'waitlist' && (
          <WaitlistView
            events={mockEvents}
            onOpenEvent={(ev) => setSelectedEvent(ev)}
            onInstantBook={() => {
              const jekyll = mockEvents.find((e) => e.id === 20) || mockEvents[0];
              setBookingFlowEvent(jekyll);
            }}
          />
        )}

        {/* ================= VIEW 8: 관심 목록 (WISHLIST) ================= */}
        {activeTab === 'wishlist' && (
          <WishlistView
            events={mockEvents}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onOpenEvent={(ev) => setSelectedEvent(ev)}
            onGoToGroupBooking={(ev) => setGroupBookingEvent(ev)}
            onGoToExplore={() => setActiveTab('explore')}
          />
        )}

        {/* ================= VIEW 9: 통합 검색 (SEARCH - 화면 중앙 전환) ================= */}
        {activeTab === 'search' && (
          <SearchView
            events={mockEvents}
            onOpenDetail={(target) => {
              setSelectedEvent(target);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onBackToExplore={() => setActiveTab('explore')}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            initialQuery={searchQuery}
          />
        )}

          </>
        )}

      </main>

      {/* ================= FULL INTERACTIVE MODALS ================= */}

      {/* 1. End-User Booking Flow: Queue (T-18) -> Seats (T-06) -> Pay (T-07) -> Complete (T-08) */}
      <BookingFlowModal
        isOpen={Boolean(bookingFlowEvent)}
        onClose={() => setBookingFlowEvent(null)}
        event={bookingFlowEvent}
        onViewMobileTicket={() => {
          setBookingFlowEvent(null);
          setMobileTicketEvent(bookingFlowEvent);
          setMobileTicketOpen(true);
        }}
      />

      {/* 3. Group Booking Room (T-20) */}
      {groupBookingEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-stone-900 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setGroupBookingEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <GroupBookingRoom
              event={groupBookingEvent}
              onSuccessComplete={() => {
                setGroupBookingEvent(null);
                setMobileTicketEvent(groupBookingEvent);
                setMobileTicketOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 4. Mobile Ticket Modal with 30s rotating QR (T-16, T-21) */}
      <MobileTicketModal
        isOpen={mobileTicketOpen}
        onClose={() => setMobileTicketOpen(false)}
        event={mobileTicketEvent}
      />

      {/* 5. Organizer & Admin Studio Modal (T-01, T-02) */}
      {studioOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-7xl max-h-[96vh] overflow-y-auto rounded-3xl">
            <AdminConsole onClose={() => setStudioOpen(false)} />
          </div>
        </div>
      )}

      {/* 6. Taste Worldcup Modal (R-08) */}
      <TasteWorldcupModal
        isOpen={tasteWorldcupOpen}
        onClose={() => setTasteWorldcupOpen(false)}
        events={mockEvents}
        onOpenEvent={(ev) => {
          setTasteWorldcupOpen(false);
          setSelectedEvent(ev);
        }}
      />

      {/* 7. Specification Screen Navigator Drawer (All 75 screens in v1.6 spec) */}
      <SpecNavDrawer
        isOpen={specDrawerOpen}
        onClose={() => setSpecDrawerOpen(false)}
        onNavigateToScreen={handleSpecScreenNavigate}
      />

      {/* 8. Auth Modal (회원가입 & 로그인) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        onLoginSuccess={(user) => {
          setCurrentUser({ ...user, role: user.role === 'organizer' ? 'organizer' : 'user' });
          setAuthModalOpen(false);
          triggerConfetti();
        }}
      />

      {/* Confetti Cannon */}
      <PopcornConfetti ref={confettiRef} />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 px-4 text-center text-xs text-stone-500 space-y-1">
        <p className="font-bold text-stone-800">
          팝콘 (POP-CON: Pop &amp; Connect) — C팀_팝콘_기능설계서_v1.6 기반 컬처 플랫폼 목업
        </p>
        <p className="text-[11px] text-stone-400">
          공연 · 영화 · 전시 · 팝업스토어 · 콜라보카페 · 축제 통합 예매 &amp; 실시간 동행
        </p>
      </footer>

    </div>
  );
}
