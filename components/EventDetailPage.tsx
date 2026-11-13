'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CultureEvent } from '../types';
import { PopcornCountdownOverlay } from './PopcornCountdownOverlay';
import { 
  ArrowLeft, Calendar, MapPin, Ticket, Users, Clock, 
  Share2, Heart, ShieldCheck, Check, Sparkles, Navigation, 
  Info, AlertCircle, ChevronRight, ChevronDown, ChevronUp, UserCheck, Armchair, 
  BadgePercent, Eye, Bell, Film, Coffee, Music, Compass, 
  CheckCircle2, Flame, Star, Image as ImageIcon, Lock, Zap, ShieldAlert,
  Copy, ExternalLink
} from 'lucide-react';

interface EventDetailPageProps {
  event: CultureEvent;
  onBack: () => void;
  onBookTickets: (event: CultureEvent) => void;
  onGroupBooking: (event: CultureEvent) => void;
  onWaitlistApply: (event: CultureEvent) => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
}

// 1. 홍보 포스터 공식 문구 생성기
function getEventSlogan(event: CultureEvent): string {
  if (event.title.includes('데스노트')) {
    return '“정의의 이름을 건 천재들의 치열한 두뇌 게임 — 홍광호·김준수·고은성, 전석 매진 신화의 압도적 귀환”';
  }
  if (event.category === 'performance') {
    return '“순간의 선택이 영원을 만든다 — 조승우·홍광호·박은태, 20주년 신화의 압도적 무대”';
  }
  if (event.title.includes('산리오')) {
    return '“올겨울 가장 따뜻한 크리스마스 선물 — 헬로키티 50주년 윈터 마켓 & 한정판 에디션”';
  }
  if (event.title.includes('루피')) {
    return '“추위를 녹이는 사랑스러움! 윈터 에디션 굿즈와 실물 크기 포토존으로의 초대”';
  }
  if (event.title.includes('젠틀몬스터')) {
    return '“미래를 마주하는 감각의 확장 — 2027 신규 컬렉션과 키네틱 로봇 아트 쇼룸”';
  }
  if (event.category === 'movie') {
    return '“지금 청춘의 가장 솔직하고 찬란한 호흡 — 스크린에서 감독과 함께 나누는 특별한 GV 대화”';
  }
  if (event.category === 'exhibition') {
    return '“경계 없는 예술의 공간 속으로 — 빛과 소리가 관람객과 상호작용하는 압도적 미디어아트”';
  }
  if (event.category === 'collab_cafe') {
    return '“달콤한 디저트와 함께 펼쳐지는 세계관 — 한정 특전 코스터와 오리지널 테마 메뉴”';
  }
  if (event.category === 'festival') {
    return '“도시 전체가 빛의 캔버스로 변신하는 순간 — 2026 성수의 밤을 수놓는 빛의 축제”';
  }
  return `“${event.title} — 팝콘 공식 제휴 독점 예매 및 패스트트랙 현장 연동”`;
}

// 1-2. 행사 장소 상세 정보 & 지도 좌표 매핑 (오시는 길 구글/카카오 지도 연동)
export interface VenueDetails {
  name: string;
  address: string;
  subway: string;
  parking: string;
  lat: number;
  lng: number;
}

export function getVenueInfo(event: CultureEvent): VenueDetails {
  const spot = event.spot || '';
  const title = event.title || '';

  if (title.includes('데스노트') || spot.includes('디큐브') || spot.includes('링크아트센터')) {
    return {
      name: '디큐브 링크아트센터 대극장',
      address: '서울 구로구 경인로 662 현대백화점 디큐브시티 7층',
      subway: '지하철 1호선·2호선 신도림역 1번 / 5번 출구 지하 연결통로 직결 (도보 2분)',
      parking: '디큐브시티 지하 3F~B7F 주차장 (당일 관람권 소지 시 4시간 4,000원 정산)',
      lat: 37.5089,
      lng: 126.8891,
    };
  }

  if (spot.includes('에스팩토리')) {
    return {
      name: '성수 에스팩토리 D동',
      address: '서울 성동구 연무장15길 11 에스팩토리',
      subway: '지하철 2호선 성수역 3번 출구 (도보 4분, 280m 직진)',
      parking: '건물 내 주차 불가 / 인근 성수2가 공영주차장 이용 권장 (주말 혼잡)',
      lat: 37.5418,
      lng: 127.0583,
    };
  }

  if (spot.includes('샤롯데')) {
    return {
      name: '샤롯데씨어터',
      address: '서울 송파구 올림픽로 240 샤롯데씨어터',
      subway: '지하철 2호선·8호선 잠실역 3번 출구 (도보 5분, 350m 직진)',
      parking: '샤롯데씨어터 지하주차장 (당일 관람객 4시간 4,000원 할인권)',
      lat: 37.5113,
      lng: 127.0998,
    };
  }

  if (spot.includes('그라운드시소')) {
    return {
      name: '그라운드시소 성수',
      address: '서울 성동구 아차산로17길 49 생각공장 데시앙플렉스 B1',
      subway: '지하철 2호선 성수역 2번 출구 (도보 8분) / 7호선 어린이대공원역 4번 출구',
      parking: '생각공장 빌딩 지하주차장 1시간 무료 (이후 10분당 1,000원)',
      lat: 37.5453,
      lng: 127.0655,
    };
  }

  if (spot.includes('더현대')) {
    return {
      name: '더현대 서울 ICONIC ZONE',
      address: '서울 영등포구 여의대로 108 더현대 서울 B2',
      subway: '지하철 5호선·9호선 여의도역 지하 무빙워크 연결 직결 (도보 5분)',
      parking: '더현대 서울 지하주차장 (팝업스토어 영수증 합산 정산)',
      lat: 37.5258,
      lng: 126.9284,
    };
  }

  if (spot.includes('용산아이파크몰') || spot.includes('CGV 용산')) {
    return {
      name: 'CGV 용산아이파크몰 IMAX관',
      address: '서울 용산구 한강대로23길 55 HDC아이파크몰 리빙파크 6층',
      subway: '지하철 1호선·경의중앙선 용산역사 직결 / 4호선 신용산역 3번 출구 (도보 3분)',
      parking: '아이파크몰 달주차장 / 해주차장 (영화 관람 시 3시간 무료 인증)',
      lat: 37.5298,
      lng: 126.9647,
    };
  }

  if (spot.includes('코엑스')) {
    return {
      name: '메가박스 코엑스 Dolby Cinema',
      address: '서울 강남구 봉은사로 524 스타필드 코엑스몰 B2',
      subway: '지하철 2호선 삼성역 5/6번 출구 연결 / 9호선 봉은사역 7번 출구',
      parking: '코엑스몰 지하주차장 (영화 관람 시 4시간 4,800원 할인권)',
      lat: 37.5126,
      lng: 127.0588,
    };
  }

  if (spot.includes('동대문') || spot.includes('DDP')) {
    return {
      name: '동대문디자인플라자(DDP) 뮤지엄',
      address: '서울 중구 을지로 281 DDP 배움터 지하 2층',
      subway: '지하철 2호선·4호선·5호선 동대문역사문화공원역 1번 / 2번 출구 직결',
      parking: 'DDP 지하주차장 (전시 관람 영수증 2만원 이상 1시간 무료)',
      lat: 37.5668,
      lng: 127.0096,
    };
  }

  if (spot.includes('홍대') || spot.includes('애니메이트')) {
    return {
      name: '애니메이트 홍대점 / 콜라보카페',
      address: '서울 마포구 양화로 188 AK PLAZA 홍대 5층·7층',
      subway: '지하철 2호선·공항철도·경의중앙선 홍대입구역 4번 / 5번 출구 바로 앞',
      parking: 'AK PLAZA 홍대 주차타워 (매장 결제 시 1시간 무료)',
      lat: 37.5574,
      lng: 126.9255,
    };
  }

  if (spot.includes('블루스퀘어')) {
    return {
      name: '블루스퀘어 신한카드홀',
      address: '서울 용산구 이태원로 294 블루스퀘어',
      subway: '지하철 6호선 한강진역 2번 출구 연결통로 직결',
      parking: '블루스퀘어 전용 주차장 (공연 관람 시 4시간 5,000원)',
      lat: 37.5408,
      lng: 127.0026,
    };
  }

  return {
    name: spot || '공연 및 행사 장소',
    address: `서울 ${event.location || '중구'} 중심 인근`,
    subway: `지하철 ${event.location || ''}역 인근 출구에서 도보 5~10분`,
    parking: '건물 내 또는 인근 유료/공영주차장 이용 권장 (주말 만차 유의)',
    lat: 37.5665,
    lng: 126.9780,
  };
}

// 2. 범용 날짜 모델 (7일 가로 피커)
interface DateItem {
  id: string;
  dateStr: string;   // "2026.11.15"
  dayStr: string;    // "15"
  weekdayStr: string;// "토"
  isWeekend: boolean;
  label?: string;    // "오늘", "내일"
}

const UPCOMING_DATES: DateItem[] = [
  { id: 'd-1', dateStr: '2026.11.15', dayStr: '15', weekdayStr: '토', isWeekend: true, label: '오늘' },
  { id: 'd-2', dateStr: '2026.11.16', dayStr: '16', weekdayStr: '일', isWeekend: true, label: '내일' },
  { id: 'd-3', dateStr: '2026.11.17', dayStr: '17', weekdayStr: '월', isWeekend: false },
  { id: 'd-4', dateStr: '2026.11.18', dayStr: '18', weekdayStr: '화', isWeekend: false },
  { id: 'd-5', dateStr: '2026.11.19', dayStr: '19', weekdayStr: '수', isWeekend: false },
  { id: 'd-6', dateStr: '2026.11.20', dayStr: '20', weekdayStr: '목', isWeekend: false },
  { id: 'd-7', dateStr: '2026.11.21', dayStr: '21', weekdayStr: '금', isWeekend: false },
];

// 3. 범용 회차 모델
interface SessionSlot {
  id: string;
  time: string;
  roundName: string;
  status: 'available' | 'almost_sold' | 'sold_out';
  statusText: string;
  cast?: { role: string; name: string }[];
  seatsSummary?: { grade: string; remaining: number; price: string; color: string }[];
  perks?: string[];
  durationText?: string;
  screenOrRoom?: string;
  waitingTeams?: number;
}

// 4. 카테고리별 회차 엔진
function getEventSessions(event: CultureEvent, date: DateItem): SessionSlot[] {
  const isPerf = event.category === 'performance';
  const isMovie = event.category === 'movie';
  const isPopup = event.category === 'popup';
  const isExhibition = event.category === 'exhibition';
  const isCafe = event.category === 'collab_cafe';

  if (isPerf) {
    if (date.isWeekend) {
      return [
        {
          id: `${date.id}-slot-1`,
          time: '14:00',
          roundName: '1회차 낮공',
          status: 'available',
          statusText: '잔여 48석',
          cast: [
            { role: '지킬/하이드', name: '조승우' },
            { role: '루시', name: '린아' },
            { role: '엠마', name: '조정은' },
          ],
          seatsSummary: [
            { grade: 'VIP', remaining: 6, price: '₩170,000', color: '#ffe4e6' },
            { grade: 'R', remaining: 18, price: '₩140,000', color: '#e0f2fe' },
            { grade: 'S', remaining: 24, price: '₩90,000', color: '#f3e8ff' },
          ],
          durationText: '170분 (인터미션 20분)',
          screenOrRoom: '샤롯데씨어터 대극장',
        },
        {
          id: `${date.id}-slot-2`,
          time: '19:00',
          roundName: '2회차 밤공',
          status: 'almost_sold',
          statusText: '잔여 9석',
          cast: [
            { role: '지킬/하이드', name: '홍광호' },
            { role: '루시', name: '윤공주' },
            { role: '엠마', name: '최수진' },
          ],
          seatsSummary: [
            { grade: 'VIP', remaining: 1, price: '₩170,000', color: '#ffe4e6' },
            { grade: 'R', remaining: 3, price: '₩140,000', color: '#e0f2fe' },
            { grade: 'S', remaining: 5, price: '₩90,000', color: '#f3e8ff' },
          ],
          durationText: '170분 (인터미션 20분)',
          screenOrRoom: '샤롯데씨어터 대극장',
        },
      ];
    } else {
      return [
        {
          id: `${date.id}-slot-1`,
          time: '19:30',
          roundName: '1회차 평일단독',
          status: 'available',
          statusText: '잔여 72석',
          cast: [
            { role: '지킬/하이드', name: '박은태' },
            { role: '루시', name: '아이비' },
            { role: '엠마', name: '민경아' },
          ],
          seatsSummary: [
            { grade: 'VIP', remaining: 14, price: '₩170,000', color: '#ffe4e6' },
            { grade: 'R', remaining: 26, price: '₩140,000', color: '#e0f2fe' },
            { grade: 'S', remaining: 32, price: '₩90,000', color: '#f3e8ff' },
          ],
          durationText: '170분 (인터미션 20분)',
          screenOrRoom: '샤롯데씨어터 대극장',
        },
      ];
    }
  }

  if (isMovie) {
    return [
      {
        id: `${date.id}-slot-1`,
        time: '13:30',
        roundName: '1회 (GV행사)',
        status: 'almost_sold',
        statusText: '잔여 6석',
        perks: ['감독 & 주연배우 GV 토크 40분', 'A3 포스터 증정'],
        screenOrRoom: '인디 1관 (레이저)',
        durationText: '135분 (영화 95분 + GV)',
      },
      {
        id: `${date.id}-slot-2`,
        time: '16:50',
        roundName: '2회 (일반)',
        status: 'available',
        statusText: '잔여 42석',
        perks: ['오리지널 엽서 증정'],
        screenOrRoom: '인디 2관',
        durationText: '95분',
      },
      {
        id: `${date.id}-slot-3`,
        time: '20:00',
        roundName: '3회 (심야)',
        status: 'available',
        statusText: '잔여 18석',
        perks: ['한정판 핀뱃지 패키지'],
        screenOrRoom: '인디 1관',
        durationText: '95분',
      },
    ];
  }

  if (isPopup) {
    return [
      {
        id: `${date.id}-slot-1`,
        time: '11:00',
        roundName: '1회 (오전)',
        status: 'available',
        statusText: '잔여 24명',
        perks: ['홀로그램 스티커 증정', '대기 0팀'],
        durationText: '45분 회차제',
        screenOrRoom: '센트럴홀 1F',
        waitingTeams: 0,
      },
      {
        id: `${date.id}-slot-2`,
        time: '13:00',
        roundName: '2회 (점심피크)',
        status: 'almost_sold',
        statusText: '잔여 3명',
        perks: ['패스트트랙 바로입장', '대기 18팀'],
        durationText: '45분 회차제',
        screenOrRoom: '센트럴홀 1F',
        waitingTeams: 18,
      },
      {
        id: `${date.id}-slot-3`,
        time: '15:00',
        roundName: '3회 (오후)',
        status: 'available',
        statusText: '잔여 35명',
        perks: ['포토존 여유', '대기 2팀'],
        durationText: '45분 회차제',
        screenOrRoom: '센트럴홀 1F',
        waitingTeams: 2,
      },
      {
        id: `${date.id}-slot-4`,
        time: '17:00',
        roundName: '4회 (이브닝)',
        status: 'sold_out',
        statusText: '예약 매진',
        perks: ['취소표 알림 가능'],
        durationText: '45분 회차제',
        screenOrRoom: '센트럴홀 1F',
        waitingTeams: 42,
      },
      {
        id: `${date.id}-slot-5`,
        time: '19:00',
        roundName: '5회 (나이트)',
        status: 'available',
        statusText: '잔여 11명',
        perks: ['야간 조명 연출'],
        durationText: '45분 회차제',
        screenOrRoom: '센트럴홀 1F',
        waitingTeams: 5,
      },
    ];
  }

  if (isExhibition) {
    return [
      {
        id: `${date.id}-slot-1`,
        time: '10:30',
        roundName: '1회 (도슨트)',
        status: 'available',
        statusText: '잔여 16명',
        perks: ['큐레이터 전문 해설 40분', '오디오 가이드 무상'],
        durationText: '90분',
        screenOrRoom: '본관 전시 1~3홀',
      },
      {
        id: `${date.id}-slot-2`,
        time: '14:00',
        roundName: '2회 (자율)',
        status: 'available',
        statusText: '잔여 55명',
        perks: ['자유 사진 촬영 및 인터랙티브 룸'],
        durationText: '자유 관람',
        screenOrRoom: '본관 전시 1~3홀',
      },
      {
        id: `${date.id}-slot-3`,
        time: '17:30',
        roundName: '3회 (나이트)',
        status: 'almost_sold',
        statusText: '잔여 8명',
        perks: ['야간 감성 조명', '전시 엽서 세트'],
        durationText: '90분',
        screenOrRoom: '본관 전시 1~3홀',
      },
    ];
  }

  if (isCafe) {
    return [
      {
        id: `${date.id}-slot-1`,
        time: '12:00',
        roundName: '1회 (2인석)',
        status: 'available',
        statusText: '잔여 3팀',
        perks: ['특전 코스터 1인 1종', '태블릿 주문'],
        durationText: '60분 테이블제',
        screenOrRoom: '카페 아틀리에 2F',
      },
      {
        id: `${date.id}-slot-2`,
        time: '14:00',
        roundName: '2회 (4인석)',
        status: 'available',
        statusText: '잔여 2팀',
        perks: ['특전 코스터 & 미니 포스터'],
        durationText: '60분 테이블제',
        screenOrRoom: '카페 아틀리에 2F',
      },
      {
        id: `${date.id}-slot-3`,
        time: '16:30',
        roundName: '3회 (2인석)',
        status: 'almost_sold',
        statusText: '잔여 1팀',
        perks: ['특전 코스터 증정'],
        durationText: '60분 테이블제',
        screenOrRoom: '카페 아틀리에 2F',
      },
    ];
  }

  return [
    {
      id: `${date.id}-slot-1`,
      time: '13:00',
      roundName: '전일권 프리패스',
      status: 'available',
      statusText: '예매 가능',
      perks: ['전 구역 자유 입장권', '스탬프 투어 굿즈 증정'],
      durationText: '종일 관람',
      screenOrRoom: '행사장 전 구역',
    },
  ];
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  event,
  onBack,
  onBookTickets,
  onGroupBooking,
  onWaitlistApply,
  isLiked = false,
  onToggleLike,
}) => {
  // 1. 유저 요청: "위에 포스터 사진영역은 그대로두고 아래에 텍스트 영역이변경되야지"
  const [contentTab, setContentTab] = useState<'info' | 'schedule' | 'location'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab === 'schedule' || tab === 'location' || tab === 'info') return tab;
    }
    return 'info';
  });

  // 2. 유저 요청: "포스터 사진 아랫부분에 -v 이런모양 넣어넣고 그거누르면 쫙펼쳐지면서 홍보 포스터 나오게해줘"
  const [isPosterExpanded, setIsPosterExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('poster') === '1' || urlParams.get('poster') === 'expanded') return true;
    }
    return false;
  });

  // 3. 유저 요청: "티켓팅 임박 팝업이나 뮤지컬 하나만들어주고 티켓팅 전용으로 만들어볼래?"
  const isTicketingImminent = Boolean(event.isTicketingImminent || event.id === 99 || event.badge?.includes('티켓팅'));
  const [countdown, setCountdown] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const c = urlParams.get('countdown');
      if (c !== null && !isNaN(Number(c))) return Number(c);
      if (urlParams.get('opened') === '1') return 0;
    }
    return event.openCountdownSeconds || 872;
  });
  const [serverMs, setServerMs] = useState<number>(() => Date.now());
  const [isOpenNow, setIsOpenNow] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('opened') === '1') return true;
    }
    return false;
  });
  const [openSplashVisible, setOpenSplashVisible] = useState<boolean>(false);
  const [notifSubscribed, setNotifSubscribed] = useState<boolean>(false);
  const [speedScore, setSpeedScore] = useState<number | null>(null);

  // 실시간 서버 시계 & 초단위 카운트다운
  useEffect(() => {
    if (!isTicketingImminent) return;
    const interval = setInterval(() => {
      setServerMs(Date.now());
      if (!isOpenNow) {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsOpenNow(true);
            setOpenSplashVisible(true);
            setTimeout(() => setOpenSplashVisible(false), 1600);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTicketingImminent, isOpenNow]);

  // 유저 요청: "시간이 10초 아래로 남게되면 화면에 10 9 8~ 이런 애니메이션이 크게나오게해줘"
  const handleStart10sCountdown = () => {
    setCountdown(10);
    setIsOpenNow(false);
    setOpenSplashVisible(false);
  };

  const pad = (n: number) => String(n).padStart(2, '0');
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;

  const serverTimeStr = useMemo(() => {
    const d = new Date(serverMs);
    const h = pad(d.getHours());
    const m = pad(d.getMinutes());
    const s = pad(d.getSeconds());
    const ms = String(d.getMilliseconds()).padStart(3, '0').slice(0, 1);
    return `${h}:${m}:${s}.${ms}`;
  }, [serverMs]);

  // 2. 날짜 및 회차 상태 (새로고침 시에도 사용자가 선택한 일자 및 회차 유지)
  const [selectedDate, setSelectedDate] = useState<DateItem>(() => {
    if (typeof window !== 'undefined') {
      const savedDateId = sessionStorage.getItem(`popcon_date_${event.id}`);
      if (savedDateId) {
        const found = UPCOMING_DATES.find((d) => d.id === savedDateId);
        if (found) return found;
      }
    }
    return UPCOMING_DATES[0];
  });
  const sessions = useMemo(() => getEventSessions(event, selectedDate), [event, selectedDate]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`popcon_slot_${event.id}`);
      if (saved) return saved;
    }
    return sessions[0]?.id || '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`popcon_date_${event.id}`, selectedDate.id);
      if (selectedSlotId) {
        sessionStorage.setItem(`popcon_slot_${event.id}`, selectedSlotId);
      }
    }
  }, [event.id, selectedDate, selectedSlotId]);

  const activeSlot = useMemo(() => {
    return sessions.find((s) => s.id === selectedSlotId) || sessions[0];
  }, [sessions, selectedSlotId]);

  const [copied, setCopied] = useState(false);
  const slogan = useMemo(() => getEventSlogan(event), [event]);

  const isPerformance = event.category === 'performance';
  const isMovie = event.category === 'movie';
  const isPopup = event.category === 'popup';
  const isExhibition = event.category === 'exhibition';

  const venueInfo = useMemo(() => getVenueInfo(event), [event]);
  const [addrCopied, setAddrCopied] = useState(false);
  const handleCopyAddr = () => {
    navigator.clipboard?.writeText(venueInfo.address);
    setAddrCopied(true);
    setTimeout(() => setAddrCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl mx-auto py-1 space-y-3 select-none animate-in fade-in duration-200">
      
      {/* ================= 유저 요청: 블러 없이 화면에 팝콘 튀기며 10->사라짐->9->사라짐 대형 카운트다운 ================= */}
      {isTicketingImminent && ((countdown > 0 && countdown <= 10) || openSplashVisible) && (
        <PopcornCountdownOverlay
          countdown={countdown}
          isOpenNow={isOpenNow}
          openSplashVisible={openSplashVisible}
          onOpenBooking={() => {
            setOpenSplashVisible(false);
            onBookTickets(event);
          }}
          onClose={() => {
            setCountdown(0);
            setOpenSplashVisible(false);
          }}
          eventTitle={event.title}
          serverTimeStr={serverTimeStr}
        />
      )}

      {/* 1. 상단 미니멀 네비게이션 */}
      <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/80">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-700 hover:text-stone-950 text-xs sm:text-sm font-bold transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>둘러보기로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="행사 링크 복사"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '복사됨' : '공유'}</span>
          </button>

          <button
            onClick={onToggleLike}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs border ${
              isLiked
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-transparent'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span>{isLiked ? '찜 완료' : '찜'}</span>
          </button>
        </div>
      </div>

      {/* ================= 1단계: 상단 대표 포스터 사진 + "-v" 확대 없이 원본 그대로 아래로 촤라락 내려가는 포스터 토글 ================= */}
      <div 
        className={`relative w-full rounded-2xl overflow-hidden bg-stone-950 shadow-md border border-stone-200/80 select-none transition-[max-height] duration-700 ease-in-out ${
          isPosterExpanded ? 'max-h-[1100px] sm:max-h-[1350px]' : 'max-h-48 sm:max-h-56'
        }`}
      >
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-auto object-cover object-top block select-none pointer-events-none"
        />

        {/* Scrims */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm backdrop-blur-xs"
              style={{ backgroundColor: event.badgeBg, color: event.badgeText }}
            >
              {event.categoryName} · {event.badge}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-xs font-bold backdrop-blur-xs">
              {event.dDay}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-mono font-medium backdrop-blur-xs">
            📍 {event.spot}
          </span>
        </div>

        {/* Live Status (접혀있을 때 좌하단 노출) */}
        {!isPosterExpanded && (
          <div className="absolute bottom-3 left-3.5 z-10">
            {event.waitingCount !== undefined && event.waitingCount > 0 ? (
              <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>실시간 현장 대기 <strong className="text-amber-300 font-black">{event.waitingCount}팀</strong></span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>실시간 회차 · 좌석 예매 연동</span>
              </div>
            )}
          </div>
        )}

        {/* 펼쳐졌을 때 나타나는 공식 포스터 정보 바 */}
        {isPosterExpanded && (
          <div className="absolute bottom-12 inset-x-4 z-10 flex flex-col items-center text-center space-y-1 text-white animate-in fade-in duration-300 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL PROMOTIONAL POSTER · 공식 포스터</span>
            </div>
            <p className="text-xs text-white/80 font-medium drop-shadow-md">
              {event.title} · {event.spot}
            </p>
          </div>
        )}

        {/* 유저 요청: "-v 확대되는 식 말고 그대로 아래로 촤라락 내려가게" */}
        <div className="absolute inset-x-0 bottom-2.5 flex justify-center z-20 pointer-events-auto">
          <button
            onClick={() => setIsPosterExpanded(!isPosterExpanded)}
            className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/30 text-[11px] font-bold shadow-lg transition-all cursor-pointer active:scale-95"
            title={isPosterExpanded ? '포스터 접기' : '포스터 전체 촤라락 펼쳐보기'}
          >
            <span className="text-white/40 tracking-wider font-mono text-xs group-hover:text-white/70 transition-colors">──</span>
            {isPosterExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-300 transition-transform group-hover:-translate-y-0.5" />
                <span>포스터 접기</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>공식 포스터 펼쳐보기</span>
              </>
            )}
            <span className="text-white/40 tracking-wider font-mono text-xs group-hover:text-white/70 transition-colors">──</span>
          </button>
        </div>
      </div>

      {/* ================= 2단계: 행사 타이틀 + 슬로건 ================= */}
      <div className="space-y-1 px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>팝콘 공식 검증 제휴 [C-05] · {isPerformance ? '공연별 전석 지정제' : isMovie ? '상영관 좌석제' : '회차 인원제'}</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
          {event.title}
        </h1>

        <div className="relative pl-3 border-l-2 border-amber-500 py-0.5">
          <p className="font-extrabold text-xs sm:text-sm text-stone-800 tracking-tight leading-relaxed">
            {slogan}
          </p>
        </div>
      </div>

      {/* ================= 3단계: 관람 기간, 가격, 러닝타임, 예매방식 그리드 ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 block font-medium">관람 기간</span>
          <span className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5 block">{event.date}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 block font-medium">티켓 가격</span>
          <span className="font-black text-stone-900 font-mono text-xs sm:text-sm mt-0.5 block">{event.price}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 block font-medium">
            {isPerformance ? '러닝타임' : '운영 시간'}
          </span>
          <span className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5 block">
            {activeSlot?.durationText || event.runningTime || '회차별 상이'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-100/90 border border-stone-200/80">
          <span className="text-[10px] text-stone-500 block font-medium">예매 방식</span>
          <span className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5 block">
            {isPerformance ? '좌석 배치도 선택' : isExhibition ? '회차별 자유 입장' : '타임슬롯 지정'}
          </span>
        </div>
      </div>

      {/* ================= [티켓팅 임박 시 상단 워룸 노출] 실시간 카운트다운 + 팝콘 서버시계 + 사전 체크리스트 ================= */}
      {isTicketingImminent && (
        <div className="space-y-3 pt-0.5 animate-in fade-in duration-300">
          
          {/* 1. 실시간 서버 시계 & 티켓팅 카운트다운 전광판 */}
          <div className="relative rounded-2xl bg-stone-950 text-white p-4 sm:p-5 border border-red-500/40 shadow-xl overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/30">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>LIVE TICKETING</span>
                  </span>
                  <span className="text-stone-300 font-bold hidden sm:inline">팝콘 단독 실시간 연동 서버</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-400">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>표준 서버 시각:</span>
                  <strong className="text-emerald-400 font-black tracking-wider text-xs">{serverTimeStr}</strong>
                </div>
              </div>

              {/* Countdown Board */}
              <div className="text-center py-2 space-y-2">
                <div className="text-xs text-stone-400 font-bold flex items-center justify-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-500 animate-bounce" />
                  <span>{isOpenNow ? '전석 티켓팅 오픈 완료!' : '오늘 낮 14:00 전석 티켓 오픈까지'}</span>
                </div>

                {isOpenNow ? (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-600/30 via-emerald-600/30 to-amber-600/30 border border-emerald-500/60 animate-in zoom-in-95 duration-200">
                    <span className="text-xl sm:text-2xl font-black text-emerald-300 block tracking-tight">
                      🎉 14:00 정각 티켓 오픈되었습니다!
                    </span>
                    <span className="text-xs text-stone-300 mt-1 block">
                      현재 실시간 좌석 선점이 진행 중입니다. 아래 버튼을 눌러 바로 좌석을 선택하세요!
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 sm:gap-3 font-mono">
                    <div className="flex flex-col items-center">
                      <div className="w-14 sm:w-18 py-2 rounded-xl bg-stone-900 border border-stone-800 text-2xl sm:text-3xl font-black text-white shadow-inner">
                        {pad(hours)}
                      </div>
                      <span className="text-[10px] text-stone-500 font-bold mt-1">HOURS</span>
                    </div>
                    <span className="text-2xl font-black text-red-500 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <div className="w-14 sm:w-18 py-2 rounded-xl bg-stone-900 border border-stone-800 text-2xl sm:text-3xl font-black text-white shadow-inner">
                        {pad(minutes)}
                      </div>
                      <span className="text-[10px] text-stone-500 font-bold mt-1">MINUTES</span>
                    </div>
                    <span className="text-2xl font-black text-red-500 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <div className="w-14 sm:w-18 py-2 rounded-xl bg-stone-900 border border-red-500/50 text-2xl sm:text-3xl font-black text-red-400 shadow-inner">
                        {pad(seconds)}
                      </div>
                      <span className="text-[10px] text-red-400 font-bold mt-1">SECONDS</span>
                    </div>
                  </div>
                )}

                {/* 10초 미만 초긴장 카운트다운 알림 배너 */}
                {countdown <= 10 && countdown > 0 && (
                  <div className="py-2 px-3 rounded-lg bg-red-500/25 border border-red-400/60 text-red-200 text-xs font-black animate-pulse flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>🚨 티켓팅 10초 이하 진입! 대형 카운트다운 진행 중 ({countdown}초)...</span>
                  </div>
                )}

                {/* Traffic Stats */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[11px] text-stone-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span>접속 대기: <strong className="text-red-300 font-black font-mono">18,492명</strong></span>
                  </span>
                  <span>·</span>
                  <span>오픈 좌석: <strong className="text-white font-black font-mono">1,840석</strong></span>
                  <span>·</span>
                  <span className="text-amber-300 font-bold">예상 매진: 30초 이내</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 티켓팅 100% 성공 필수 사전 준비 체크리스트 */}
          <div className="p-3.5 rounded-xl bg-stone-100 text-xs space-y-2 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <span className="font-black text-stone-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>티켓팅 1초 선점 필수 준비 체크 [준비율 100%]</span>
              </span>
              <span className="text-[10.5px] text-stone-500 font-bold">인증 완료</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold block text-[11px]">본인인증 완료</span>
                  <span className="text-[10px] text-stone-400">PASS 간편인증 연동</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold block text-[11px]">결제수단 등록됨</span>
                  <span className="text-[10px] text-stone-400">팝콘페이 0.5초 결제</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <div className="truncate">
                  <span className="font-bold block text-[11px]">안심예매 통과</span>
                  <span className="text-[10px] text-stone-400">매크로 방지 캡차 통과</span>
                </div>
              </div>
            </div>

            {/* 알림톡 신청 버튼 */}
            <div className="pt-0.5">
              <button
                onClick={() => setNotifSubscribed(!notifSubscribed)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  notifSubscribed
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${notifSubscribed ? 'fill-amber-600 text-amber-600' : 'text-stone-600'}`} />
                <span>{notifSubscribed ? '✅ 오픈 5분 전 카카오 알림톡 신청 완료 (13:55 자동 발송)' : '🔔 오픈 5분 전 카카오 알림톡 받기 신청'}</span>
              </button>
            </div>
          </div>

          {/* 3. 단독 1차 오픈 회차 및 좌석 등급 사전 공개표 */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-black text-stone-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <Flame className="w-4 h-4 text-red-600" />
                <span>오늘 14:00 1차 오픈 회차 & 캐스팅 스케줄</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10.5px]">1인 2매 제한</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-stone-200 text-left text-xs">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 font-bold text-stone-800 text-[11px]">
                    <th className="p-1.5">오픈 일자</th>
                    <th className="p-1.5">회차</th>
                    <th className="p-1.5">야가미 라이토</th>
                    <th className="p-1.5">엘 (L)</th>
                    <th className="p-1.5">류크 / 렘</th>
                    <th className="p-1.5">오픈 시간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-xs">
                  <tr>
                    <td className="p-1.5 font-bold">1.10 (토)</td>
                    <td className="p-1.5 font-mono">14:00 (낮)</td>
                    <td className="p-1.5 font-black text-red-700">홍광호</td>
                    <td className="p-1.5 font-black text-purple-900">김준수</td>
                    <td className="p-1.5">서경수 / 장은아</td>
                    <td className="p-1.5 text-red-600 font-black">14:00 정각</td>
                  </tr>
                  <tr className="bg-stone-50/60">
                    <td className="p-1.5 font-bold">1.10 (토)</td>
                    <td className="p-1.5 font-mono">19:00 (밤)</td>
                    <td className="p-1.5 font-black text-red-700">고은성</td>
                    <td className="p-1.5 font-black text-purple-900">김성철</td>
                    <td className="p-1.5">서경수 / 이영미</td>
                    <td className="p-1.5 text-red-600 font-black">14:00 정각</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">1.11 (일)</td>
                    <td className="p-1.5 font-mono">14:00 (낮)</td>
                    <td className="p-1.5 font-black text-red-700">홍광호</td>
                    <td className="p-1.5 font-black text-purple-900">김준수</td>
                    <td className="p-1.5">서경수 / 장은아</td>
                    <td className="p-1.5 text-red-600 font-black">14:00 정각</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 좌석 등급 & 가격 */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 text-[11px]">
              <span className="font-bold text-stone-500">좌석 등급:</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-900 font-bold border border-rose-200">VIP석 ₩180,000</span>
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-900 font-bold border border-sky-200">R석 ₩150,000</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-900 font-bold border border-purple-200">S석 ₩110,000</span>
                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold border border-stone-200">A석 ₩80,000</span>
              </div>
            </div>

            {/* 팝콘 꿀팁 */}
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-[11px] leading-relaxed">
              💡 <strong>팝콘 단독 팁:</strong> 동행 모임(G-01) 파티를 미리 만들어두면 친구 2명이 각자 다른 구역(1층 VIP열/R열)을 동시 공략하여 선점 확률이 2배로 증가합니다.
            </div>
          </div>

          {/* 4. 티켓팅 광클 반응속도 연습 미니 테스트 */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 text-xs">
            <span className="font-bold text-stone-700">🎯 내 티켓팅 클릭 반응속도:</span>
            <button
              onClick={() => setSpeedScore(Math.floor(Math.random() * 30 + 135))}
              className="px-3 py-1 rounded-lg bg-white border border-stone-300 font-mono font-bold text-stone-900 hover:bg-stone-50 cursor-pointer text-xs"
            >
              {speedScore ? `⚡ ${speedScore}ms (상위 1% 초고수)` : '클릭하여 반응속도 테스트'}
            </button>
          </div>

          {/* 5. 메인 티켓팅 액션 버튼 */}
          <div className="space-y-2 pt-1">
            {isOpenNow ? (
              <button
                onClick={() => onBookTickets(event)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:brightness-110 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl animate-pulse cursor-pointer group transition-all"
              >
                <Ticket className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>🔥 14:00 전석 오픈! 좌석배치도 선택 예매하기 (지금 즉시 입장!)</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <>
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl bg-stone-800 text-stone-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-stone-700"
                >
                  <Lock className="w-4 h-4 text-stone-500" />
                  <span>14:00 정각에 예매 버튼이 자동 활성화됩니다 (대기 중...)</span>
                </button>

                {/* 10초 팝콘 카운트다운 시작 버튼 */}
                <button
                  onClick={handleStart10sCountdown}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white border border-amber-300/40 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-950/20 transition-all cursor-pointer active:scale-99 group"
                >
                  <span className="text-base animate-bounce">🍿</span>
                  <span>🍿 10초 팝콘 카운트다운 시작 (화면에 팝콘 팡팡! 10 ➔ 9 ➔ 8...)</span>
                </button>
              </>
            )}

            {/* Secondary Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onGroupBooking(event)}
                className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-stone-700 flex-shrink-0" />
                <span className="truncate">동행 티켓팅 파티 [G-01]</span>
              </button>

              <button
                onClick={() => onWaitlistApply(event)}
                className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-stone-700 flex-shrink-0" />
                <span className="truncate">취소표 대기 알림 [W-01]</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ================= 4단계: 유저 요청 "티켓팅 준비 페이지에도 기존의 상세정보 오는길 그런건 있어야지" ================= */}
      <div className="space-y-2 pt-0.5">
        
        {/* 텍스트 영역 탭 전환 버튼바 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/60">
            <button
              onClick={() => setContentTab('info')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                contentTab === 'info'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>행사 상세소개</span>
            </button>

            <button
              onClick={() => setContentTab('schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                contentTab === 'schedule'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isPerformance ? '캐스팅 & 스케줄표' : '회차·프로그램 안내'}</span>
            </button>

            <button
              onClick={() => setContentTab('location')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                contentTab === 'location'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>오시는 길</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
            {contentTab === 'info' && '기획 의도 및 관람 상세'}
            {contentTab === 'schedule' && (isPerformance ? '뮤지컬 캐스팅 스케줄' : '회차별 상세 스케줄')}
            {contentTab === 'location' && '오시는 길 및 주차'}
          </span>
        </div>

        {/* 탭에 따라 동적으로 변경되는 텍스트 컨텐츠 박스 */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50/80 border border-stone-200/70 text-stone-800 animate-in fade-in duration-150">
          
          {/* TAB 1: 행사 상세소개 */}
          {contentTab === 'info' && (
            <div className="space-y-3">
              <div className="space-y-1.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p className="font-medium text-stone-900">{event.desc}</p>
                {event.title.includes('데스노트') && (
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                    “이름이 적히면 40초 뒤 심장마비로 사망한다.” 사신 류크가 떨어뜨린 공책을 쥐고 신세계의 신이 되려는 천재 고교생 야가미 라이토와, 베일에 싸인 천재 명탐정 L의 숨막히는 세기의 두뇌 서스펜스!
                    브로드웨이 거장 프랭크 와일드혼의 넘버와 360도 회전 LED 무대의 환상적인 조화로 전석 매진 신화를 이어갑니다.
                  </p>
                )}
                <p className="text-stone-600 text-xs">
                  팝콘(POP-CON) 제휴를 통해 현장 대기열 없이 예약 시간에 즉시 입장 가능하며,
                  동행 예매(G-01) 시 친구와 함께 실시간으로 좌석을 고르고 각자 따로 결제할 수 있습니다.
                </p>
              </div>

              {event.cast && (
                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-1">
                  <span className="font-black text-purple-950 block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>대표 출연진 및 아티스트 라인업:</span>
                  </span>
                  <p className="text-purple-900 font-semibold leading-relaxed">{event.cast}</p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-stone-100 text-xs text-stone-600 space-y-1.5 border border-stone-200/60">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-stone-700" />
                  <span>관람 및 입장 필수 유의사항 [C-10]</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11.5px] text-stone-600 leading-relaxed">
                  <li>관람 당일 예매자 본인 확인을 위해 <strong>신분증</strong>을 반드시 지참해 주세요.</li>
                  <li>입장 10분 전까지 행사장 입구에 도착하여 팝콘 앱 <strong>모바일 티켓 30초 회전 QR</strong>을 제시해 주세요 (캡처본 입장 불가).</li>
                  <li>사전예약 회차 변경은 관람 전날 23:59까지 취소 수수료 없이 가능합니다.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: 회차 & 프로그램 안내 */}
          {contentTab === 'schedule' && (
            <div className="space-y-2">
              {event.title.includes('데스노트') ? (
                <div className="overflow-x-auto">
                  <div className="text-[11px] font-bold text-red-700 pb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>뮤지컬 데스노트 2027 1차 티켓 오픈 캐스팅 일정표 (14:00 정각 전석 오픈)</span>
                    </span>
                    <span className="font-mono text-stone-400 text-[10px]">디큐브 링크아트센터</span>
                  </div>
                  <table className="w-full border-collapse border border-stone-200 text-left text-xs">
                    <thead>
                      <tr className="bg-stone-100 border-b border-stone-200 font-bold text-stone-800 text-[11px]">
                        <th className="p-2">일자</th>
                        <th className="p-2">회차</th>
                        <th className="p-2">야가미 라이토</th>
                        <th className="p-2">엘(L)</th>
                        <th className="p-2">렘 / 류크</th>
                        <th className="p-2">예매 상태</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium text-xs">
                      <tr>
                        <td className="p-2 font-bold">11.15 (토)</td>
                        <td className="p-2 font-mono">14:00 (1회)</td>
                        <td className="p-2 font-black text-red-700">홍광호</td>
                        <td className="p-2 font-black text-purple-900">김준수</td>
                        <td className="p-2">장은아 / 서경수</td>
                        <td className="p-2 text-red-600 font-black">14:00 정각 오픈</td>
                      </tr>
                      <tr className="bg-stone-50/60">
                        <td className="p-2 font-bold">11.15 (토)</td>
                        <td className="p-2 font-mono">19:00 (2회)</td>
                        <td className="p-2 font-black text-red-700">고은성</td>
                        <td className="p-2 font-black text-purple-900">김성철</td>
                        <td className="p-2">장은아 / 서경수</td>
                        <td className="p-2 text-red-600 font-black">14:00 정각 오픈</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">11.16 (일)</td>
                        <td className="p-2 font-mono">14:00 (1회)</td>
                        <td className="p-2 font-black text-red-700">홍광호</td>
                        <td className="p-2 font-black text-purple-900">김준수</td>
                        <td className="p-2">서경수 / 장은아</td>
                        <td className="p-2 text-red-600 font-black">14:00 정각 오픈</td>
                      </tr>
                      <tr className="bg-stone-50/60">
                        <td className="p-2 font-bold">11.16 (일)</td>
                        <td className="p-2 font-mono">19:00 (2회)</td>
                        <td className="p-2 font-black text-red-700">고은성</td>
                        <td className="p-2 font-black text-purple-900">김성철</td>
                        <td className="p-2">서경수 / 장은아</td>
                        <td className="p-2 text-red-600 font-black">14:00 정각 오픈</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">11.18 (화)</td>
                        <td className="p-2 font-mono">19:30 (1회)</td>
                        <td className="p-2 font-black text-red-700">홍광호</td>
                        <td className="p-2 font-black text-purple-900">김성철</td>
                        <td className="p-2">장은아 / 서경수</td>
                        <td className="p-2 text-red-600 font-black">14:00 정각 오픈</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : isPerformance ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-stone-200 text-left text-xs">
                    <thead>
                      <tr className="bg-stone-100 border-b border-stone-200 font-bold text-stone-800 text-[11px]">
                        <th className="p-1.5">일자</th>
                        <th className="p-1.5">회차</th>
                        <th className="p-1.5">지킬 / 하이드</th>
                        <th className="p-1.5">루시</th>
                        <th className="p-1.5">엠마</th>
                        <th className="p-1.5">잔여석</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium text-xs">
                      <tr>
                        <td className="p-1.5 font-bold">11.15 (토)</td>
                        <td className="p-1.5 font-mono">14:00 (1회)</td>
                        <td className="p-1.5 font-black text-purple-900">조승우</td>
                        <td className="p-1.5">린아</td>
                        <td className="p-1.5">조정은</td>
                        <td className="p-1.5 text-emerald-700 font-bold">48석 (예매중)</td>
                      </tr>
                      <tr className="bg-stone-50/60">
                        <td className="p-1.5 font-bold">11.15 (토)</td>
                        <td className="p-1.5 font-mono">19:00 (2회)</td>
                        <td className="p-1.5 font-black text-purple-900">홍광호</td>
                        <td className="p-1.5">윤공주</td>
                        <td className="p-1.5">최수진</td>
                        <td className="p-1.5 text-amber-700 font-bold">9석 (매진임박)</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-bold">11.16 (일)</td>
                        <td className="p-1.5 font-mono">14:00 (1회)</td>
                        <td className="p-1.5 font-black text-purple-900">박은태</td>
                        <td className="p-1.5">아이비</td>
                        <td className="p-1.5">민경아</td>
                        <td className="p-1.5 text-emerald-700 font-bold">56석 (예매중)</td>
                      </tr>
                      <tr className="bg-stone-50/60">
                        <td className="p-1.5 font-bold">11.18 (화)</td>
                        <td className="p-1.5 font-mono">19:30 (1회)</td>
                        <td className="p-1.5 font-black text-purple-900">조승우</td>
                        <td className="p-1.5">린아</td>
                        <td className="p-1.5">조정은</td>
                        <td className="p-1.5 text-emerald-700 font-bold">72석 (예매중)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-100 space-y-1">
                    <span className="font-bold text-stone-900 block">⏰ 일일 5회차 운영 체계</span>
                    <p className="text-stone-600 text-[11.5px]">
                      오전 11시부터 2시간 단위로 총 5회차 운영되며, 회차당 이용 시간은 45분입니다.
                      사전예약자는 전용 패스트트랙 라인으로 현장 대기 없이 즉시 입장합니다.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 space-y-0.5">
                    <span className="font-bold text-amber-950 block">🎁 회차별 특전 안내</span>
                    <p className="text-amber-900 text-[11.5px]">
                      오전 1회차(11:00) 입장객 전원에게 한정 홀로그램 엽서 세트가 증정됩니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 오시는 길 (유저 요청: "오시는길에 위치 지도 구글지도든 카카오지도든 써서 가져와") */}
          {contentTab === 'location' && (
            <div className="space-y-3.5 animate-in fade-in duration-300">
              
              {/* 장소 타이틀 & 주소 복사 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-200/80">
                <div>
                  <div className="font-black text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
                    <span>{venueInfo.name}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {venueInfo.address}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleCopyAddr}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer border border-stone-200 shadow-2xs"
                    title="도로명 주소 클립보드 복사"
                  >
                    {addrCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                    <span>{addrCopied ? '주소 복사됨!' : '주소 복사'}</span>
                  </button>
                </div>
              </div>

              {/* 🌟 실시간 인터랙티브 지도 (Google 지도 + 위성 레이어 + 카카오/네이버 연동) */}
              <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-100">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/venue-map.html?lat=${venueInfo.lat}&lng=${venueInfo.lng}&name=${encodeURIComponent(venueInfo.name)}&addr=${encodeURIComponent(venueInfo.address)}`}
                  className="w-full h-full border-0 block"
                  title={`${venueInfo.name} 위치 지도`}
                  loading="lazy"
                />
              </div>

              {/* 지하철 대중교통 & 주차 할인 안내 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200/80 space-y-1.5">
                  <div className="font-black text-stone-900 flex items-center gap-1.5">
                    <span>🚇 지하철 대중교통 안내</span>
                  </div>
                  <p className="text-stone-700 text-[11.5px] leading-relaxed font-medium">
                    {venueInfo.subway}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200/80 space-y-1.5">
                  <div className="font-black text-stone-900 flex items-center gap-1.5">
                    <span>🚗 주차 및 할인 정산 안내</span>
                  </div>
                  <p className="text-stone-700 text-[11.5px] leading-relaxed font-medium">
                    {venueInfo.parking}
                  </p>
                </div>
              </div>

              {/* 외부 지도 길찾기 앱 원클릭 다이렉트 연동 버튼바 */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-600 font-bold text-xs">
                  <Navigation className="w-3.5 h-3.5 text-stone-900" />
                  <span>실시간 길찾기 앱 바로가기:</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 font-black">
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(venueInfo.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#fee500] hover:bg-[#fdd835] text-stone-950 flex items-center gap-1 transition-all cursor-pointer shadow-2xs border border-amber-300"
                    title="카카오맵에서 장소 및 길찾기 열기"
                  >
                    <span>🟡 카카오맵</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent(venueInfo.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#03c75a] hover:bg-[#02b350] text-white flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    title="네이버 지도에서 장소 및 길찾기 열기"
                  >
                    <span>🟢 네이버 지도</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueInfo.name + ' ' + venueInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    title="Google 지도에서 장소 및 길찾기 열기"
                  >
                    <span>🔴 Google 지도</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <a
                    href={`https://map.kakao.com/link/to/${encodeURIComponent(venueInfo.name)},${venueInfo.lat},${venueInfo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    title="TMAP / 내비게이션 연동 길찾기"
                  >
                    <span>🚗 TMAP 내비</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ================= 5단계: 유저 요청 "그리고 밑에 예매하기 나오는거지" ================= */}
      <div className="space-y-2.5 pt-0.5">
        
        {/* Section Title */}
        <div className="flex items-center justify-between pb-0.5">
          <h2 className="text-base font-black text-stone-900 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-stone-900" />
            <span>
              {isPerformance 
                ? '전석 지정 좌석 예매 [T-06]' 
                : isPopup 
                ? '회차별 사전예약 & 패스트트랙 [T-05]' 
                : isMovie
                ? '상영관 & GV 회차 예매 [T-05]'
                : '티켓 예매 [T-05]'}
            </span>
          </h2>
          <span className="text-xs font-mono text-stone-500 font-bold">
            {selectedDate.dateStr} ({selectedDate.weekdayStr})
          </span>
        </div>

        {/* A. 관람 날짜 선택 바 (7일 가로 필 탭) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>1. 관람 일자 선택:</span>
            <span className="font-mono text-stone-900 font-black">{selectedDate.dayStr}일 ({selectedDate.weekdayStr})</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {UPCOMING_DATES.map((d) => {
              const isSelected = selectedDate.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDate(d)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-12 py-2 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white font-bold shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span className={`text-[9.5px] font-bold ${
                    isSelected ? 'text-stone-300' : d.isWeekend ? 'text-rose-500' : 'text-stone-400'
                  }`}>
                    {d.label || d.weekdayStr}
                  </span>
                  <span className="text-xs font-black font-mono leading-none mt-0.5">
                    {d.dayStr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* B. 회차 및 시간대 선택 (스마트 슬롯 칩) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>2. 회차 및 시간대 선택:</span>
            <span className="text-xs text-stone-400">{sessions.length}개 회차 오픈</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sessions.map((slot) => {
              const isSelected = activeSlot?.id === slot.id;
              const isSoldOut = slot.status === 'sold_out';

              return (
                <button
                  key={slot.id}
                  onClick={() => !isSoldOut && setSelectedSlotId(slot.id)}
                  disabled={isSoldOut}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm'
                      : isSoldOut
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  <span className="font-mono font-black">{slot.time}</span>
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {slot.roundName}
                  </span>
                  
                  {/* 주연 캐스팅 뱃지 */}
                  {isPerformance && slot.cast && slot.cast[0] ? (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-900'
                    }`}>
                      {slot.cast[0].name}
                    </span>
                  ) : null}

                  {/* 상태 텍스트 */}
                  <span className={`text-[10px] font-bold ${
                    isSoldOut
                      ? 'text-stone-400'
                      : slot.status === 'almost_sold'
                      ? isSelected ? 'text-amber-300' : 'text-amber-600'
                      : isSelected ? 'text-emerald-300' : 'text-emerald-600'
                  }`}>
                    {slot.statusText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* C. 선택 회차 실시간 현황 브리핑 */}
        {activeSlot && (
          <div className="py-2.5 px-3.5 rounded-xl bg-stone-100 text-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-black text-stone-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-800" />
                <span>{selectedDate.dayStr}일({selectedDate.weekdayStr}) {activeSlot.time} 상세 현황</span>
              </span>
              <span className="text-[11px] text-stone-600 font-mono">
                {activeSlot.screenOrRoom}
              </span>
            </div>

            {/* 공연: 캐스팅 + 좌석 등급별 잔여석 */}
            {isPerformance && activeSlot.cast && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-stone-500 text-[11px]">👑 주연:</span>
                  <span className="font-bold text-stone-900 truncate">
                    {activeSlot.cast.map((c) => `${c.role} ${c.name}`).join(' · ')}
                  </span>
                </div>
                
                {activeSlot.seatsSummary && (
                  <div className="flex items-center gap-1.5">
                    {activeSlot.seatsSummary.map((s) => (
                      <span key={s.grade} className="px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-white text-stone-800 border border-stone-200">
                        {s.grade} <strong>{s.remaining}석</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 팝업스토어: 대기 및 특전 */}
            {isPopup && (
              <div className="flex items-center justify-between text-stone-700 text-xs pt-0.5">
                <div className="flex items-center gap-2 font-medium truncate">
                  <span className="px-2 py-0.5 rounded bg-white text-stone-900 text-[10.5px] font-bold">
                    {activeSlot.waitingTeams === 0 ? '🟢 대기 0팀' : `🟡 현장대기 ${activeSlot.waitingTeams}팀`}
                  </span>
                  <span className="truncate">{activeSlot.perks?.[0]}</span>
                </div>
                <span className="text-[10.5px] text-stone-400 font-mono flex-shrink-0">30초 회전 QR 입장</span>
              </div>
            )}

            {/* 영화 / 전시 / 카페 */}
            {(isMovie || isExhibition || event.category === 'collab_cafe') && (
              <div className="flex items-center justify-between text-stone-700 text-xs pt-0.5">
                <span className="truncate">{activeSlot.perks?.join(' · ')}</span>
                <span className="font-bold text-stone-900 text-[11px] font-mono">{activeSlot.statusText}</span>
              </div>
            )}
          </div>
        )}

        {/* D. Action Buttons: 예매하기 & 동행/대기 */}
        <div className="space-y-2 pt-1">
          
          {/* Primary Booking Button */}
          <button
            onClick={() => onBookTickets(event)}
            className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer group"
          >
            <Ticket className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>
              {isPerformance
                ? `${selectedDate.dayStr}일(${selectedDate.weekdayStr}) ${activeSlot?.time || ''} 좌석배치도 선택 예매하기 [T-06]`
                : `${selectedDate.dayStr}일(${selectedDate.weekdayStr}) ${activeSlot?.time || ''} 티켓 예매하기`}
            </span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onGroupBooking(event)}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="친구와 함께 실시간으로 좌석/회차를 고르고 각자 따로 결제"
            >
              <Users className="w-3.5 h-3.5 text-stone-700 flex-shrink-0" />
              <span className="truncate">동행 모임 (같이 고르기) [G-01]</span>
            </button>

            <button
              onClick={() => onWaitlistApply(event)}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="매진 회차 취소표 알림 및 30분 우선구매권"
            >
              <Bell className="w-3.5 h-3.5 text-stone-700 flex-shrink-0" />
              <span className="truncate">취소표 대기 신청 [W-01]</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
