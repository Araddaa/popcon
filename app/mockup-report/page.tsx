'use client';

import React from 'react';
import { Sparkles, Flame, Ticket, ShieldCheck, CreditCard, Users, Clock, CheckCircle2, MapPin, Zap, Monitor, ExternalLink, Globe } from 'lucide-react';

interface PCMockupPage {
  pageNo: string;
  screenCode: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
  tabTitle: string;
  pcImg: string;
  pcImg2?: string;
  pcImg2Title?: string;
  bullets: string[];
  tags: string[];
  isCover?: boolean;
}

export default function MockupReportPage() {
  const pages: PCMockupPage[] = [
    {
      pageNo: '01',
      screenCode: 'COVER',
      title: 'POP-CON (팝콘)',
      subtitle: '문화 행사 통합 예매 & 실시간 동행 플랫폼 · PC Desktop 에디션',
      category: 'UI/UX 화면 설계 및 고해상도 PC 목업 보고서',
      url: 'popcon.kr',
      tabTitle: 'POP-CON | 문화 행사 통합 예매',
      pcImg: '/mockups/pc_01_home.png',
      bullets: [],
      tags: [],
      isCover: true,
    },
    {
      pageNo: '02',
      screenCode: 'H-01 / H-02',
      title: 'PC 메인 홈 & 핫플 큐레이션 피드',
      subtitle: '1440px 와이드 데스크탑 큐레이션 배너 및 실시간 대기열 탐색',
      category: 'PART 1. 둘러보기 & 메인 피드',
      url: 'popcon.kr/',
      tabTitle: 'POP-CON | 둘러보기 홈',
      pcImg: '/mockups/pc_01_home.png',
      bullets: [
        '와이드 데스크탑 화면에 최적화된 팝가/팝플 감성 네오 브루탈리즘 테마 & 멀티컬럼 그리드',
        '상단 원형 핫플 카테고리 필터 (공연, 팝업, 전시, 영화, 콜라보 카페) 원클릭 전환',
        '실시간 현장 대기열 순위 뱃지 (실시간 대기 42팀, 대기 18팀 등) 직관적 표시',
        'D-Day 전광판, 즉시 예약 및 동행 파티 모집 숏컷 버튼 완비',
      ],
      tags: ['PC Widescreen', 'Curation Grid', 'Waiting Counter', 'Neo-Brutalism'],
    },
    {
      pageNo: '03',
      screenCode: 'T-10 / T-11',
      title: 'PC 티켓팅 임박 워룸 & 사전 준비 체크리스트',
      subtitle: '뮤지컬 데스노트 2027 1차 전석 티켓 오픈 전광판',
      category: 'PART 2. 티켓팅 임박 & 전광판',
      url: 'popcon.kr/events/99',
      tabTitle: '뮤지컬 데스노트 2027 | 티켓 오픈 워룸',
      pcImg: '/mockups/pc_02_ticketing_overview.png',
      bullets: [
        '밀리초(ms) 단위 동기화 표준 서버 시계 전광판 및 카운트다운 타이머 노출',
        '티켓팅 1초 선점 필수 준비 체크리스트 (본인인증, 팝콘페이 간편결제, 안심 매크로 통과)',
        '14:00 정각 1차 오픈 회차 및 캐스팅 일정표 사전 공개 (홍광호, 김준수 등)',
        '실시간 동시 접속자 수(18,492명) 및 오픈 좌석(1,840석) 트래픽 현황 제공',
      ],
      tags: ['Server Time Clock', '100% Readiness Checklist', 'Casting Schedule', 'Live Traffic'],
    },
    {
      pageNo: '04',
      screenCode: 'T-11 (Unroll)',
      title: 'PC 포스터 촤라락 롤다운 전개 인터랙션',
      subtitle: '확대 없이 원본 비율 그대로 아래로 부드럽게 펼쳐지는 공식 포스터',
      category: 'PART 3. 포스터 롤다운 전개',
      url: 'popcon.kr/events/99?poster=expanded',
      tabTitle: '뮤지컬 데스노트 2027 | 공식 포스터 전체보기',
      pcImg: '/mockups/pc_03_poster_unrolled.png',
      bullets: [
        '유저 요청 완벽 반영: 이미지가 확대/축소되지 않고, 상단 기준점(object-top)을 고정한 채 아래로 촤라락 롤다운',
        'transition-[max-height] duration-700 ease-in-out 부드러운 언롤링 애니메이션 적용',
        '하단 플로팅 캡슐 버튼(-- ⌄ 공식 포스터 펼쳐보기 / -- ⌃ 포스터 접기 --) 원클릭 토글',
        '펼침 시 고화질 세로 공식 포스터 전면 노출 및 하단 컨텐츠의 자연스러운 밀림 스크롤',
      ],
      tags: ['Unroll Animation', 'No Scale Distortion', 'Duration-700', 'Accordion Toggle'],
    },
    {
      pageNo: '05',
      screenCode: 'T-12 / T-13',
      title: 'PC 오시는 길 실시간 위치 지도 & 교통편',
      subtitle: 'Google/Kakao 실시간 지도 연동, 신도림역 연결통로 및 주차 꿀팁',
      category: 'PART 4. 오시는 길 & 지도 연동',
      url: 'popcon.kr/events/99?tab=location',
      tabTitle: '디큐브 링크아트센터 | 오시는 길 & 지도',
      pcImg: '/mockups/pc_05_location_map.png',
      bullets: [
        'Google 지도 실시간 로드맵 & 위성 사진 레이어 전환 스위처 탑재',
        '디큐브 링크아트센터 정확한 위경도 좌표(37.5089, 126.8891)에 펄스 핀 마커 및 중심 복귀 버튼 제공',
        '카카오맵, 네이버 지도, Google 지도, TMAP 1초 다이렉트 길찾기 원클릭 연동',
        '도로명 주소 1초 복사 버튼 및 신도림역 지하연결통로 직결/주차 할인 4시간 가이드 완비',
      ],
      tags: ['Google Maps API', 'Kakao Map Link', 'Address Copy', 'Subway & Parking'],
    },
    {
      pageNo: '06',
      screenCode: 'T-15 / T-16',
      title: 'PC 10초 팝콘 카운트다운 & 0초 정각 티켓 오픈',
      subtitle: '배경 투과 팝콘 팡팡 터짐 애니메이션 및 즉시 예매 활성화',
      category: 'PART 5. 팝콘 카운트다운 연출',
      url: 'popcon.kr/events/99?countdown=5',
      tabTitle: '티켓팅 5초 전! | POP-CON 카운트다운',
      pcImg: '/mockups/pc_06_countdown.png',
      pcImg2: '/mockups/pc_07_ticket_open.png',
      pcImg2Title: '0초 정각 티켓 오픈 축포 화면',
      bullets: [
        '10초 진입 시 화면 뒤 배경 블러 0% 투과로 기존 상세 정보 100% 가독성 유지',
        '10 ➔ 사라짐 ➔ 9 ➔ 사라짐의 통통 튀는 바운스 팝 애니메이션 (Web Audio API 팝콘 팝 사운드)',
        '매 초마다 화면 전방위로 분출되는 귀여운 팝콘 파티클 물리 시뮬레이션',
        '0초 정각 도달 시 대형 팝콘 축포 폭발 & [지금 즉시 좌석 선택 입장하기] 즉시 활성화',
      ],
      tags: ['Popcorn Burst', 'Transparent Overlay', 'Web Audio Synth', 'Instant Booking Entry'],
    },
    {
      pageNo: '07',
      screenCode: 'T-18 / T-20',
      title: 'PC 스마트 안심 대기열 & 대극장 전석 좌석배치도',
      subtitle: '트래픽 분산 큐잉 엔진 및 샤롯데씨어터 대극장 좌석 선점',
      category: 'PART 6. 대기열 & 좌석 선택',
      url: 'popcon.kr/events/99?booking=1&step=seats',
      tabTitle: '좌석 선택 | 디큐브 링크아트센터 대극장',
      pcImg: '/mockups/pc_09_seats.png',
      pcImg2: '/mockups/pc_08_queue.png',
      pcImg2Title: '스마트 트래픽 분산 대기열 화면',
      bullets: [
        '내 대기 순번(14번째), 예상 대기 시간, 순번 감소 게이지 실시간 피드백',
        '1층 VIP석/R석/S석 실시간 좌석배치도 (선점 좌석 즉시 비활성화 & 8분 결제 타이머)',
        '동행 티켓팅 파티(G-01) 연동: 2인 좌석 동시 선택 및 친구에게 좌석 링크 전송',
        '미니맵 네비게이션 및 좌석 등급별 잔여석 실시간 카운터 연동',
      ],
      tags: ['Queueing System', 'Realtime Seat Map', '8-Min Hold Timer', 'Companion Seat Link'],
    },
    {
      pageNo: '08',
      screenCode: 'T-22 / P-01',
      title: 'PC 팝콘페이 간편결제 & 동행 분할 결제 (1/N)',
      subtitle: '원클릭 결제 완료 및 30초 회전 동적 QR 모바일 티켓 발권',
      category: 'PART 7. 결제 & 모바일 티켓',
      url: 'popcon.kr/events/99?booking=1&step=complete',
      tabTitle: '예매 완료! | 모바일 티켓 발권',
      pcImg: '/mockups/pc_10_payment.png',
      pcImg2: '/mockups/pc_11_complete.png',
      pcImg2Title: '예매 완료 & 모바일 티켓 화면',
      bullets: [
        '팝콘페이, 카카오페이, 토스페이, 네이버페이, 신용카드 원클릭 3초 결제 지원',
        '동행 분할 결제(1/N) 엔진: 좌석별 금액 자동 분할 청구 및 카카오톡 결제 알림톡 전송',
        '스크린샷 캡처 및 암표 방지 30초 회전 다이내믹 워터마크 QR 모바일 티켓',
        '캘린더 자동 등록(Google/Apple), 동행자에게 티켓 선물하기 기능 탑재',
      ],
      tags: ['Split Payment 1/N', 'Popcorn Pay', 'Dynamic QR Ticket', 'Anti-Scalping'],
    },
    {
      pageNo: '09',
      screenCode: 'P-05 / C-01',
      title: 'PC 월간 문화 캘린더 & 실시간 동행 파티 모임',
      subtitle: '날짜별 티켓팅 오픈 일정 확인 및 취향 맞는 동행 모집',
      category: 'PART 8. 캘린더 & 동행 커뮤니티',
      url: 'popcon.kr/?tab=calendar',
      tabTitle: 'POP-CON | 월간 티켓팅 캘린더',
      pcImg: '/mockups/pc_14_calendar.png',
      pcImg2: '/mockups/pc_15_gatherings.png',
      pcImg2Title: '실시간 동행 파티 모임 화면',
      bullets: [
        '월간 캘린더 뷰에서 일자별 티켓팅 오픈 및 행사 일정 한눈에 파악',
        '원클릭 알림 신청(D-1 / 10분 전 푸시) 및 개인 캘린더 동기화',
        '실시간 동행 모임 [G-01]: 공연/전시 함께 갈 파티원 모집 및 채팅방 개설',
        '매진 회차 취소표 자동 대기 신청 [W-01] 및 30분 우선구매권 연동',
      ],
      tags: ['Monthly Calendar', 'Ticket Alert', 'Companion Party', 'Cancellation Waitlist'],
    },
    {
      pageNo: '10',
      screenCode: 'E-01 / E-02',
      title: 'PC 장르별 상세 뷰 (뮤지컬 지킬앤하이드 & 미디어아트 전시)',
      subtitle: '공연 좌석배치도 예매 및 전시 타임슬롯 예약 다변화',
      category: 'PART 9. 장르별 상세 페이지',
      url: 'popcon.kr/events/20',
      tabTitle: '뮤지컬 지킬앤하이드 20주년 | 샤롯데씨어터',
      pcImg: '/mockups/pc_12_jekyll.png',
      pcImg2: '/mockups/pc_13_ghibli.png',
      pcImg2Title: '모네 360° 미디어아트 전시 상세',
      bullets: [
        '뮤지컬/연극: 대극장 전석 지정좌석 배치도 연동 및 회차별 캐스팅 스케줄 표기',
        '전시/팝업스토어: 시간대별 회차 지정 및 자유 입장권 다변화 발권 시스템',
        '카테고리별 맞춤형 특전 및 패스트트랙 현장 QR 체크인 연계',
        '각 공연장 및 전시장 고유 특성에 맞춘 교통/주차 상세 가이드 완비',
      ],
      tags: ['Genre Adaptation', 'Timeslot Booking', 'Cast Schedule', 'Venue Optimization'],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-900 font-sans print:bg-white">
      {/* Top Floating Control Bar (화면 상단 고정, 인쇄 시 숨김) */}
      <div className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-6 py-3.5 flex items-center justify-between text-white shadow-xl print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-xl">🍿</span>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
              <span>POP-CON (팝콘) PC 버전 UI/UX 목업 설계서</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-mono text-[10px] font-bold">
                1440px PC Desktop Edition
              </span>
            </h1>
            <p className="text-[11px] text-stone-400">
              총 10개 핵심 화면 고해상도 PC 브라우저 목업 및 기능 설계 명세서
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all"
          >
            ← 서비스 바로가기
          </a>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <span>🖨️ PDF 바로 인쇄 / 다운로드</span>
          </button>
        </div>
      </div>

      {/* A4 Landscape Document Container (297mm x 210mm) */}
      <div className="max-w-[1340px] mx-auto py-8 px-4 space-y-12 print:space-y-0 print:p-0 print:m-0 print:max-w-none">
        
        {pages.map((p) => (
          <div
            key={`page-${p.pageNo}`}
            className="page-slide bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden relative print:rounded-none print:shadow-none print:border-none print:break-after-page print:m-0 print:p-0"
            style={{
              minHeight: '860px',
              pageBreakAfter: 'always',
              breakAfter: 'page',
            }}
          >
            {/* Header Ribbon */}
            <div className="px-8 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-stone-900 text-amber-300 font-mono text-xs font-black">
                  PAGE {p.pageNo}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300">
                  {p.screenCode}
                </span>
                <span className="text-xs font-bold text-stone-500 hidden sm:inline">
                  {p.category}
                </span>
              </div>

              <div className="flex items-center gap-2 text-stone-600 font-mono text-xs font-bold">
                <span className="text-stone-900 font-black">POP-CON</span>
                <span>·</span>
                <span className="text-amber-600">PC Widescreen Edition</span>
              </div>
            </div>

            {/* Page Content */}
            {p.isCover ? (
              /* ================= 표지 (Cover Slide) ================= */
              <div className="p-12 sm:p-16 flex flex-col justify-between min-h-[760px] bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-stone-950 font-black text-xs shadow-lg">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>POP-CON PC DESKTOP DESIGN SPECIFICATION</span>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                      POP-CON
                    </h1>
                    <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                      문화 행사 통합 예매 & 실시간 동행 플랫폼
                    </p>
                    <p className="text-lg font-bold text-stone-300">
                      PC Widescreen (1440 × 900) UI/UX 고해상도 목업 보고서
                    </p>
                  </div>

                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    본 문서는 C팀 팝콘(POP-CON) 기능설계서 v1.6의 핵심 화면을
                    <strong>1440px 와이드 PC 데스크탑 환경</strong>에 최적화하여 구현한 고해상도 브라우저 디자인 목업과
                    상세 기능 인터랙션 명세서입니다.
                  </p>

                  <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-stone-400 block text-[10.5px]">작성 일자</span>
                      <strong className="text-white text-xs">2026. 11. 13</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-stone-400 block text-[10.5px]">해상도 기준</span>
                      <strong className="text-amber-300 text-xs">1440 × 900 (PC Widescreen)</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-stone-400 block text-[10.5px]">주요 스펙</span>
                      <strong className="text-emerald-400 text-xs">포스터 롤다운 & 위치 지도</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-stone-400 block text-[10.5px]">문서 버전</span>
                      <strong className="text-white text-xs">v1.8 PC Edition</strong>
                    </div>
                  </div>
                </div>

                {/* Cover Footer */}
                <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-stone-400 relative z-10">
                  <span>Google DeepMind Agentic Pair Programming · POP-CON Design Studio</span>
                  <span>C팀 팝콘 기획 & 프론트엔드 산출물</span>
                </div>
              </div>
            ) : (
              /* ================= 본문 슬라이드 (Detail Slide) ================= */
              <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-7 min-h-[760px]">
                
                {/* 좌측: 실제 PC 데스크탑 브라우저 프레임 (Widescreen Mockup) */}
                <div className="flex-1 w-full space-y-4">
                  
                  {/* Main Desktop Mockup */}
                  <div className="w-full rounded-2xl bg-stone-950 border-2 border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                    {/* Browser Window Chrome */}
                    <div className="px-4 py-2.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {/* Traffic Lights */}
                        <div className="flex items-center gap-1.5 pr-2">
                          <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-[#e0443e]" />
                          <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-[#dea123]" />
                          <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-[#1aab29]" />
                        </div>
                        {/* Tab Pill */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-stone-800 text-stone-200 text-[11px] font-bold border-t border-x border-stone-700">
                          <span>🍿</span>
                          <span className="truncate max-w-[180px]">{p.tabTitle}</span>
                        </div>
                      </div>

                      {/* URL Bar */}
                      <div className="flex-1 max-w-sm sm:max-w-md mx-2 px-3 py-1 rounded-lg bg-stone-950 border border-stone-700/80 text-[11px] font-mono text-stone-300 flex items-center justify-center gap-1.5 truncate">
                        <span className="text-emerald-400">🔒</span>
                        <span className="text-stone-500">https://</span>
                        <span className="font-bold text-stone-100">{p.url}</span>
                      </div>

                      {/* Viewport Specs */}
                      <div className="flex items-center gap-2 text-stone-400 text-xs">
                        <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-bold hidden sm:inline">
                          1440 × 900
                        </span>
                      </div>
                    </div>

                    {/* Desktop Screen Image */}
                    <div className="w-full aspect-[16/10] bg-stone-100 overflow-hidden relative">
                      <img
                        src={p.pcImg}
                        alt={p.title}
                        className="w-full h-full object-cover object-top block"
                      />
                    </div>
                  </div>

                  {/* Secondary Desktop Mockup (비교 뷰 제공 시 하단 축소 배치) */}
                  {p.pcImg2 && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/90 flex items-center gap-3">
                      <div className="w-40 sm:w-48 aspect-[16/10] rounded-lg overflow-hidden border border-stone-300 flex-shrink-0 shadow-xs">
                        <img src={p.pcImg2} alt={p.pcImg2Title || '서브 화면'} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 text-xs space-y-1">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          연계 화면
                        </span>
                        <h4 className="font-black text-stone-900 text-xs sm:text-sm">
                          {p.pcImg2Title || '상세 연계 화면'}
                        </h4>
                        <p className="text-stone-500 text-[11px] line-clamp-2">
                          사용자 상호작용에 따라 연속적으로 이어지는 PC 데스크탑 화면입니다.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* 우측: 상세 화면 설명 & 핵심 기능 명세 */}
                <div className="w-full lg:w-[410px] space-y-5 flex-shrink-0">
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-amber-600 tracking-wider">
                      PC DESKTOP DESIGN & SPECS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                      {p.title}
                    </h2>
                    <p className="text-sm font-bold text-stone-600">
                      {p.subtitle}
                    </p>
                  </div>

                  {/* Bullets */}
                  <div className="space-y-2.5">
                    {p.bullets?.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {p.tags?.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 font-mono text-[11px] font-bold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
              <span>POP-CON (팝콘) · C팀 기능설계서 v1.8 PC 데스크탑 에디션</span>
              <span className="font-mono font-bold">{p.pageNo} / 10</span>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
