'use client';

import React, { useState, useMemo } from 'react';
import { CustomGridSandboxStudio } from './CustomGridSandboxStudio';
import {
  Layers,
  Store,
  ShoppingBag,
  Coffee,
  Image as ImageIcon,
  Tent,
  Music,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  SlidersHorizontal,
  Save,
  RefreshCw,
  Sparkles,
  RotateCcw,
  Compass,
  Scissors,
  Eraser,
  Wand2,
  AlertCircle,
  Calendar,
  Ticket,
  Footprints,
  Camera,
  QrCode,
  DollarSign,
  Eye,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export type SpaceMode = 'theatre' | 'popup' | 'cafe' | 'exhibition' | 'festival' | 'sandbox';
export type CustomSeatGrade = 'op' | 'vip' | 'r' | 's' | 'a' | 'wheelchair' | 'empty';
export type StageStyle = 'proscenium' | 'thrust_t' | 'circular_arena' | 'runway';

// ==========================================
// 1. POPUP STORE MODELS
// ==========================================
export interface PopupZone {
  id: string;
  name: string;
  type: 'entrance' | 'queue' | 'photo' | 'merch' | 'gacha' | 'diy' | 'exit' | 'rest';
  capacity: number; // 동시 체류 가능 인원 (명)
  dwellTimeMin: number; // 권장 체류 시간 (분)
  description: string;
  icon: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badge: string;
  status: 'active' | 'crowded' | 'standby';
  colSpan?: number;
  rowSpan?: number;
}

// ==========================================
// 2. COLLAB CAFÉ MODELS
// ==========================================
export interface CafeTable {
  id: string;
  tableNumber: string;
  type: 'round_2' | 'booth_4' | 'bar_1' | 'terrace_4';
  name: string;
  seats: number;
  zone: '홀 중앙' | '창가 뷰' | '캐릭터 부스존' | '야외 테라스';
  deposit: number; // 테이블 예약금 (원)
  status: 'available' | 'reserved' | 'cleaning';
  perks: string;
  minOrder: string;
}

// ==========================================
// 3. EXHIBITION SECTION MODELS
// ==========================================
export interface ExhibitionSection {
  id: string;
  num: number;
  title: string;
  theme: string;
  type: 'intro' | 'gallery' | 'media_art' | 'atelier' | 'interactive' | 'shop';
  capacity: number;
  avgMinutes: number;
  lighting: string;
  audioGuide: string;
  highlightWorks: string;
  wallColor: string;
}

// ==========================================
// 4. FESTIVAL STANDING MODELS
// ==========================================
export interface FestivalBlock {
  id: string;
  title: string;
  category: 'stage' | 'standing' | 'picnic' | 'food' | 'booth' | 'aid';
  capacity: number;
  entryRule: string;
  colorClass: string;
  desc: string;
}

interface UniversalSpaceStudioProps {
  venueName?: string;
  eventCategory?: 'performance' | 'popup' | 'exhibition' | 'movie' | 'collab_cafe' | 'festival';
  onShowToast: (msg: string) => void;
}

export const UniversalSpaceStudio: React.FC<UniversalSpaceStudioProps> = ({
  venueName = '디큐브 링크아트센터 대극장',
  eventCategory = 'performance',
  onShowToast,
}) => {
  const [currentMode, setCurrentMode] = useState<SpaceMode>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const m = p.get('spaceMode') as SpaceMode;
      if (m && ['theatre', 'popup', 'cafe', 'exhibition', 'festival', 'sandbox'].includes(m)) {
        return m;
      }
    }
    if (eventCategory === 'popup') return 'popup';
    if (eventCategory === 'collab_cafe') return 'cafe';
    if (eventCategory === 'exhibition') return 'exhibition';
    if (eventCategory === 'festival') return 'festival';
    return 'theatre';
  });

  // Read URL query parameter for direct tab/mode linking
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const m = p.get('spaceMode') as SpaceMode;
      if (m && ['theatre', 'popup', 'cafe', 'exhibition', 'festival', 'sandbox'].includes(m)) {
        setCurrentMode(m);
      }
    }
  }, []);

  // Sync mode if eventCategory changes from parent
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('spaceMode')) return; // Explicit URL param has highest priority
    }
    if (eventCategory === 'popup') setCurrentMode('popup');
    else if (eventCategory === 'collab_cafe') setCurrentMode('cafe');
    else if (eventCategory === 'exhibition') setCurrentMode('exhibition');
    else if (eventCategory === 'festival') setCurrentMode('festival');
    else if (eventCategory === 'performance' || eventCategory === 'movie') setCurrentMode('theatre');
  }, [eventCategory]);

  // =========================================================================
  // [MODE 1] 🛍️ POP-UP STORE & BOOTH FLOW STATE
  // =========================================================================
  const initialPopupZones: PopupZone[] = [
    {
      id: 'pz-entry',
      name: '입구 & QR 체크인',
      type: 'entrance',
      capacity: 20,
      dwellTimeMin: 2,
      description: '사전예약 모바일 QR 태그 및 대기표 발급 키오스크 2대 운영',
      icon: '🚪',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-500',
      textClass: 'text-emerald-800',
      badge: 'GATE 01',
      status: 'active',
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 'pz-queue',
      name: '웨이팅 차단봉 라인',
      type: 'queue',
      capacity: 35,
      dwellTimeMin: 8,
      description: '지그재그 안전 차단봉 동선. 인원 과밀 시 완충 대기열',
      icon: '🚶',
      bgClass: 'bg-stone-50',
      borderClass: 'border-stone-400',
      textClass: 'text-stone-700',
      badge: '대기 완충',
      status: 'active',
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 'pz-photo-main',
      name: '메인 자이언트 포토존',
      type: 'photo',
      capacity: 15,
      dwellTimeMin: 5,
      description: '3.5m 초대형 시그니처 캐릭터 조형물 & 네온 포토월 (동시 2팀)',
      icon: '📸',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-500',
      textClass: 'text-amber-900',
      badge: 'HOT PHOTO',
      status: 'crowded',
      colSpan: 2,
      rowSpan: 2,
    },
    {
      id: 'pz-diy',
      name: '커스텀 DIY 키링 체험존',
      type: 'diy',
      capacity: 14,
      dwellTimeMin: 15,
      description: '나만의 와펜/자수 패치 키링 및 에코백 커스텀 제작 테이블',
      icon: '🎨',
      bgClass: 'bg-indigo-50',
      borderClass: 'border-indigo-500',
      textClass: 'text-indigo-800',
      badge: '체험존',
      status: 'active',
      colSpan: 2,
      rowSpan: 2,
    },
    {
      id: 'pz-merch',
      name: '한정판 MD 굿즈 스토어',
      type: 'merch',
      capacity: 35,
      dwellTimeMin: 15,
      description: '시즌 한정 피규어, 인형, 의류 쇼룸 및 멀티 POS 계산대 4기',
      icon: '🛍️',
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-500',
      textClass: 'text-rose-900',
      badge: 'MAIN STORE',
      status: 'crowded',
      colSpan: 2,
      rowSpan: 2,
    },
    {
      id: 'pz-photo-booth',
      name: '인생네컷 셀프 포토부스',
      type: 'photo',
      capacity: 8,
      dwellTimeMin: 5,
      description: '팝업 한정 캐릭터 프레임 스티커 사진기 2대 (선착순 이용)',
      icon: '✨',
      bgClass: 'bg-purple-50',
      borderClass: 'border-purple-500',
      textClass: 'text-purple-900',
      badge: 'PHOTO BOX',
      status: 'active',
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 'pz-gacha',
      name: '럭키드로우 & 캡슐 가챠',
      type: 'gacha',
      capacity: 15,
      dwellTimeMin: 4,
      description: '1인 3회 한정 캡슐 머신 6기 및 1등 당첨 스크래치 쿠폰 존',
      icon: '🎁',
      bgClass: 'bg-yellow-50',
      borderClass: 'border-yellow-500',
      textClass: 'text-yellow-900',
      badge: 'LUCKY DRAW',
      status: 'active',
      colSpan: 2,
      rowSpan: 1,
    },
    {
      id: 'pz-exit',
      name: '퇴장 게이트 & 사은품 수령',
      type: 'exit',
      capacity: 15,
      dwellTimeMin: 3,
      description: '영수증 5만원 이상 구매 고객 사은품 증정 & 퇴장 게이트',
      icon: '🚪',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-600',
      textClass: 'text-emerald-900',
      badge: 'EXIT & GIFT',
      status: 'active',
      colSpan: 2,
      rowSpan: 1,
    },
  ];

  const [popupZones, setPopupZones] = useState<PopupZone[]>(initialPopupZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('pz-merch');
  const [popupSlotInterval, setPopupSlotInterval] = useState<number>(30); // 30분 or 60분
  const [popupSlotCapacity, setPopupSlotCapacity] = useState<number>(45); // 회차당 온라인 예약 정원
  const [popupWalkinRatio, setPopupWalkinRatio] = useState<number>(25); // 현장 웨이팅 비율 (%)
  const [popupShowFlow, setPopupShowFlow] = useState<boolean>(true);
  const [popupMaxPurchase, setPopupMaxPurchase] = useState<string>(
    '1인당 동일 품목 최대 2개 (한정판 피규어 1인 1개 한정)'
  );

  const selectedZone = useMemo(() => {
    return popupZones.find((z) => z.id === selectedZoneId) || popupZones[0];
  }, [popupZones, selectedZoneId]);

  // Popup Daily Capacity calculations
  const popupStats = useMemo(() => {
    const dailySlots = popupSlotInterval === 30 ? 20 : 10; // 10:30 ~ 20:30
    const onlineDaily = popupSlotCapacity * dailySlots;
    const walkinDaily = Math.round(onlineDaily * (popupWalkinRatio / 100));
    const totalDaily = onlineDaily + walkinDaily;
    const maxStoreOccupancy = popupZones.reduce((sum, z) => sum + z.capacity, 0);
    const avgBasket = 35000;
    const estimatedDailyRev = totalDaily * avgBasket;

    return {
      dailySlots,
      onlineDaily,
      walkinDaily,
      totalDaily,
      maxStoreOccupancy,
      estimatedDailyRev,
    };
  }, [popupSlotInterval, popupSlotCapacity, popupWalkinRatio, popupZones]);

  // =========================================================================
  // [MODE 2] ☕ COLLAB CAFÉ & TABLE FLOORPLAN STATE
  // =========================================================================
  const initialCafeTables: CafeTable[] = [
    {
      id: 'ct-01',
      tableNumber: 'T-01',
      type: 'round_2',
      name: '홀 중앙 2인석 A',
      seats: 2,
      zone: '홀 중앙',
      deposit: 10000,
      status: 'available',
      perks: '아크릴 코스터 2종 (랜덤)',
      minOrder: '1인 1음료 필수',
    },
    {
      id: 'ct-02',
      tableNumber: 'T-02',
      type: 'round_2',
      name: '홀 중앙 2인석 B',
      seats: 2,
      zone: '홀 중앙',
      deposit: 10000,
      status: 'reserved',
      perks: '아크릴 코스터 2종 (랜덤)',
      minOrder: '1인 1음료 필수',
    },
    {
      id: 'ct-03',
      tableNumber: 'T-03',
      type: 'round_2',
      name: '홀 중앙 2인석 C',
      seats: 2,
      zone: '홀 중앙',
      deposit: 10000,
      status: 'available',
      perks: '아크릴 코스터 2종 (랜덤)',
      minOrder: '1인 1음료 필수',
    },
    {
      id: 'ct-04',
      tableNumber: 'T-04',
      type: 'round_2',
      name: '창가 뷰 2인석 A',
      seats: 2,
      zone: '창가 뷰',
      deposit: 12000,
      status: 'reserved',
      perks: '아크릴 코스터 + 창가 전용 엽서',
      minOrder: '1인 1음료 필수',
    },
    {
      id: 'ct-05',
      tableNumber: 'T-05',
      type: 'round_2',
      name: '창가 뷰 2인석 B',
      seats: 2,
      zone: '창가 뷰',
      deposit: 12000,
      status: 'available',
      perks: '아크릴 코스터 + 창가 전용 엽서',
      minOrder: '1인 1음료 필수',
    },
    {
      id: 'cb-01',
      tableNumber: 'B-01',
      type: 'booth_4',
      name: '캐릭터 테마 부스석 A',
      seats: 4,
      zone: '캐릭터 부스존',
      deposit: 20000,
      status: 'reserved',
      perks: '특전 엽서 4매 세트 + 코스터 4종 풀세트',
      minOrder: '디저트 세트 1개 이상 필수',
    },
    {
      id: 'cb-02',
      tableNumber: 'B-02',
      type: 'booth_4',
      name: '캐릭터 테마 부스석 B',
      seats: 4,
      zone: '캐릭터 부스존',
      deposit: 20000,
      status: 'available',
      perks: '특전 엽서 4매 세트 + 코스터 4종 풀세트',
      minOrder: '디저트 세트 1개 이상 필수',
    },
    {
      id: 'cb-03',
      tableNumber: 'B-03',
      type: 'booth_4',
      name: '캐릭터 테마 부스석 C',
      seats: 4,
      zone: '캐릭터 부스존',
      deposit: 20000,
      status: 'cleaning',
      perks: '특전 엽서 4매 세트 + 코스터 4종 풀세트',
      minOrder: '디저트 세트 1개 이상 필수',
    },
    {
      id: 'cc-01',
      tableNumber: 'C-01',
      type: 'bar_1',
      name: '바 카운터 솔로석 1',
      seats: 1,
      zone: '홀 중앙',
      deposit: 5000,
      status: 'available',
      perks: '1인 방문 특전 홀로그램 스티커',
      minOrder: '음료 1잔',
    },
    {
      id: 'cc-02',
      tableNumber: 'C-02',
      type: 'bar_1',
      name: '바 카운터 솔로석 2',
      seats: 1,
      zone: '홀 중앙',
      deposit: 5000,
      status: 'reserved',
      perks: '1인 방문 특전 홀로그램 스티커',
      minOrder: '음료 1잔',
    },
    {
      id: 'cc-03',
      tableNumber: 'C-03',
      type: 'bar_1',
      name: '바 카운터 솔로석 3',
      seats: 1,
      zone: '홀 중앙',
      deposit: 5000,
      status: 'available',
      perks: '1인 방문 특전 홀로그램 스티커',
      minOrder: '음료 1잔',
    },
    {
      id: 'ctr-01',
      tableNumber: 'TR-01',
      type: 'terrace_4',
      name: '루프탑 테라스 4인석',
      seats: 4,
      zone: '야외 테라스',
      deposit: 24000,
      status: 'available',
      perks: '테라스 전용 블랭킷 & 풀세트 특전 (반려동물 가능)',
      minOrder: '1인 1메뉴',
    },
  ];

  const [cafeTables, setCafeTables] = useState<CafeTable[]>(initialCafeTables);
  const [selectedTableId, setSelectedTableId] = useState<string>('cb-01');
  const [cafeSessionTime, setCafeSessionTime] = useState<number>(70); // 70분 이용제
  const [cafeCleaningBuffer, setCafeCleaningBuffer] = useState<number>(10); // 10분 정리
  const cafeTimeSlots = [
    '1회차 (11:00 ~ 12:10)',
    '2회차 (12:20 ~ 13:30)',
    '3회차 (13:40 ~ 14:50)',
    '4회차 (15:00 ~ 16:10)',
    '5회차 (16:20 ~ 17:30)',
    '6회차 (17:40 ~ 18:50)',
    '7회차 (19:00 ~ 20:10)',
  ];

  const selectedTable = useMemo(() => {
    return cafeTables.find((t) => t.id === selectedTableId) || cafeTables[0];
  }, [cafeTables, selectedTableId]);

  const cafeStats = useMemo(() => {
    const totalTables = cafeTables.length;
    const totalSeats = cafeTables.reduce((sum, t) => sum + t.seats, 0);
    const availableTables = cafeTables.filter((t) => t.status === 'available').length;
    const reservedTables = cafeTables.filter((t) => t.status === 'reserved').length;
    const sessionRev = cafeTables.reduce((sum, t) => sum + t.deposit, 0);
    const dailyEstRev = sessionRev * cafeTimeSlots.length;
    return {
      totalTables,
      totalSeats,
      availableTables,
      reservedTables,
      sessionRev,
      dailyEstRev,
    };
  }, [cafeTables, cafeTimeSlots.length]);

  // =========================================================================
  // [MODE 3] 🖼️ EXHIBITION SECTIONS & DOCENT FLOW STATE
  // =========================================================================
  const initialSections: ExhibitionSection[] = [
    {
      id: 'ex-01',
      num: 1,
      title: 'Room 1: 빛의 서막 (Prologue)',
      theme: '작가의 초기 생애와 영감의 원천',
      type: 'intro',
      capacity: 35,
      avgMinutes: 10,
      lighting: '어두운 몰입 핀조명 (3000K)',
      audioGuide: 'Track 01: 빛을 마주하다 (해설: 배우 한소희)',
      highlightWorks: '초기 유화 스케치북, 1890년대 미공개 습작 14점',
      wallColor: 'bg-stone-900 text-stone-100',
    },
    {
      id: 'ex-02',
      num: 2,
      title: 'Room 2: 마스터피스 오리지널 갤러리',
      theme: '세계 유수 미술관 소장 오리지널 원화',
      type: 'gallery',
      capacity: 50,
      avgMinutes: 25,
      lighting: '박물관 전용 광학 연색성 98Ra 웜화이트',
      audioGuide: 'Track 02~04: 걸작들의 탄생 비화',
      highlightWorks: '대표작 <푸른 밤의 정원>, <자화상 1904>',
      wallColor: 'bg-amber-950/90 text-amber-50',
    },
    {
      id: 'ex-03',
      num: 3,
      title: 'Room 3: 360° 몰입형 미디어아트관',
      theme: '초고화질 프로젝션 맵핑 & 공간 입체 음향',
      type: 'media_art',
      capacity: 65,
      avgMinutes: 20,
      lighting: '바닥/벽면 전방위 영상 맵핑 (Dark Room)',
      audioGuide: 'Track 05: 살아 숨쉬는 붓터치와 교향악',
      highlightWorks: '12K 해상도 360도 인터랙티브 캔버스',
      wallColor: 'bg-purple-950 text-purple-50',
    },
    {
      id: 'ex-04',
      num: 4,
      title: 'Room 4: 아티스트 아틀리에 재현 & 포토존',
      theme: '실제 파리 몽마르트르 작업실 고증',
      type: 'atelier',
      capacity: 30,
      avgMinutes: 15,
      lighting: '따뜻한 작업실 백열등 & 자연 채광 연출',
      audioGuide: 'Track 06: 물감 냄새 가득했던 아침',
      highlightWorks: '실제 사용했던 팔레트, 이젤, 편지 원본',
      wallColor: 'bg-stone-800 text-stone-100',
    },
    {
      id: 'ex-05',
      num: 5,
      title: 'Room 5: 뮤지엄 아트샵 & 도록 쇼룸',
      theme: '전시 한정 에디션 굿즈 & 도록',
      type: 'shop',
      capacity: 70,
      avgMinutes: 20,
      lighting: '모던 갤러리 브라이트 화이트 (4000K)',
      audioGuide: 'Track 07: 전시를 기억하며 (에필로그)',
      highlightWorks: '고급 패브릭 포스터, 마그넷 세트, 한정 도록',
      wallColor: 'bg-stone-100 text-stone-900',
    },
  ];

  const [sections, setSections] = useState<ExhibitionSection[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('ex-02');
  const [exhibitionFlowMode, setExhibitionFlowMode] = useState<'one_way' | 'free_flow'>('one_way');
  const [hourlyCapacity, setHourlyCapacity] = useState<number>(140);
  const [docentTimes, setDocentTimes] = useState<string[]>(['11:00 (오전 해설)', '14:30 (오후 특별)', '17:00 (석양 큐레이팅)']);

  const selectedSection = useMemo(() => {
    return sections.find((s) => s.id === selectedSectionId) || sections[0];
  }, [sections, selectedSectionId]);

  // =========================================================================
  // [MODE 4] 🎪 AUDITORIUM & THEATRE SEATING STATE (기존 비정형 좌석 엔진 통합)
  // =========================================================================
  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const seatCols = Array.from({ length: 18 }, (_, i) => i + 1);

  const [stageStyle, setStageStyle] = useState<StageStyle>('proscenium');
  const [fanCurvature, setFanCurvature] = useState<number>(45);
  const [wingAngle, setWingAngle] = useState<number>(15);
  const [isStaggered, setIsStaggered] = useState<boolean>(true);
  const [activeFloor, setActiveFloor] = useState<'1F' | '2F'>('1F');
  const [selectedSeatTool, setSelectedSeatTool] = useState<CustomSeatGrade>('vip');
  const [seatPrices, setSeatPrices] = useState({
    op: 190000,
    vip: 170000,
    r: 140000,
    s: 110000,
    a: 80000,
    wheelchair: 85000,
  });

  // Presets for theatre
  const generateCurvedFanPreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        if (c === 6 || c === 13) {
          layout[id] = 'empty';
          return;
        }
        if (rIdx === 0) {
          if (c >= 8 && c <= 11) layout[id] = 'op';
          else layout[id] = 'empty';
          return;
        }
        if (rIdx === 1) {
          if (c >= 7 && c <= 12) layout[id] = 'op';
          else layout[id] = 'empty';
          return;
        }
        if (rIdx === 2 && (c <= 2 || c >= 17)) { layout[id] = 'empty'; return; }
        if (rIdx === 3 && (c <= 1 || c >= 18)) { layout[id] = 'empty'; return; }

        if (rIdx >= 2 && rIdx <= 4) layout[id] = 'vip';
        else if (rIdx >= 5 && rIdx <= 8) layout[id] = 'r';
        else if (rIdx >= 9 && rIdx <= 10) layout[id] = 's';
        else layout[id] = 'a';
      });
    });
    layout['L1'] = 'wheelchair';
    layout['L2'] = 'wheelchair';
    layout['L17'] = 'wheelchair';
    layout['L18'] = 'wheelchair';
    return layout;
  };

  const generateTStagePreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        if (rIdx <= 5 && c >= 8 && c <= 11) {
          layout[id] = 'empty';
          return;
        }
        if (rIdx >= 1 && rIdx <= 5) {
          if (c >= 2 && c <= 6) { layout[id] = 'op'; return; }
          if (c >= 13 && c <= 17) { layout[id] = 'op'; return; }
          layout[id] = 'empty';
          return;
        }
        if (rIdx === 6) {
          if (c >= 6 && c <= 13) layout[id] = 'vip';
          else layout[id] = 'empty';
          return;
        }
        if (rIdx >= 7 && rIdx <= 9) {
          if (c === 6 || c === 13) layout[id] = 'empty';
          else layout[id] = 'r';
          return;
        }
        if (rIdx >= 10) {
          if (c === 6 || c === 13) layout[id] = 'empty';
          else layout[id] = 's';
          return;
        }
        layout[id] = 'empty';
      });
    });
    return layout;
  };

  const generateBalconyPreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        if ((c <= 2 || c >= 17) && rIdx <= 4) {
          layout[id] = 'vip';
          return;
        }
        if (rIdx >= 4 && rIdx <= 11) {
          if (c >= 4 && c <= 15) {
            if (c === 6 || c === 13) layout[id] = 'empty';
            else if (rIdx <= 6) layout[id] = 'r';
            else if (rIdx <= 9) layout[id] = 's';
            else layout[id] = 'a';
            return;
          }
        }
        layout[id] = 'empty';
      });
    });
    return layout;
  };

  const [seatLayout1F, setSeatLayout1F] = useState<Record<string, CustomSeatGrade>>(generateCurvedFanPreset);
  const [seatLayout2F, setSeatLayout2F] = useState<Record<string, CustomSeatGrade>>(generateBalconyPreset);

  const currentSeatLayout = activeFloor === '1F' ? seatLayout1F : seatLayout2F;
  const setCurrentSeatLayout = activeFloor === '1F' ? setSeatLayout1F : setSeatLayout2F;

  const handleSeatClick = (id: string) => {
    setCurrentSeatLayout((prev) => {
      const current = prev[id] || 'empty';
      const next = current === selectedSeatTool ? 'empty' : selectedSeatTool;
      return { ...prev, [id]: next };
    });
  };

  const seatCounts = useMemo(() => {
    let op = 0, vip = 0, r = 0, s = 0, a = 0, wheelchair = 0;
    Object.values(currentSeatLayout).forEach((grade) => {
      if (grade === 'op') op++;
      else if (grade === 'vip') vip++;
      else if (grade === 'r') r++;
      else if (grade === 's') s++;
      else if (grade === 'a') a++;
      else if (grade === 'wheelchair') wheelchair++;
    });
    const totalValid = op + vip + r + s + a + wheelchair;
    const totalRev =
      op * seatPrices.op +
      vip * seatPrices.vip +
      r * seatPrices.r +
      s * seatPrices.s +
      a * seatPrices.a +
      wheelchair * seatPrices.wheelchair;
    return { op, vip, r, s, a, wheelchair, totalValid, totalRev };
  }, [currentSeatLayout, seatPrices]);

  // =========================================================================
  // [MODE 5] 🏕️ OUTDOOR FESTIVAL & STANDING STATE
  // =========================================================================
  const initialFestivalBlocks: FestivalBlock[] = [
    {
      id: 'fb-stage',
      title: '메인 헤드라이너 스테이지 (Main Stage)',
      category: 'stage',
      capacity: 0,
      entryRule: '아티스트 및 테크니컬 크루 전용',
      colorClass: 'bg-stone-900 text-amber-300 border-amber-400',
      desc: '대형 4K LED 스크린, 레이저 트러스 & 라인 어레이 음향 타워',
    },
    {
      id: 'fb-standing-a',
      title: '스탠딩 ZONE A (무대 좌측 펜스)',
      category: 'standing',
      capacity: 800,
      entryRule: '입장 번호 001~800번 순차 입장 (공연 2시간 전 대기열)',
      colorClass: 'bg-rose-500 text-white border-stone-900',
      desc: '무대 최전방 좌측 펜스 스탠딩 구역 (열광적인 호응 구역)',
    },
    {
      id: 'fb-standing-b',
      title: '스탠딩 ZONE B (무대 우측 펜스)',
      category: 'standing',
      capacity: 800,
      entryRule: '입장 번호 801~1600번 순차 입장 (공연 2시간 전 대기열)',
      colorClass: 'bg-purple-600 text-white border-stone-900',
      desc: '무대 최전방 우측 펜스 스탠딩 구역',
    },
    {
      id: 'fb-vip-pit',
      title: 'VIP 프론트 피트 (Front Pit)',
      category: 'standing',
      capacity: 200,
      entryRule: 'VIP 티켓 소지자 전용 우선 패스트트랙 입장',
      colorClass: 'bg-amber-400 text-stone-950 border-stone-900',
      desc: '아티스트와 아이컨택 가능한 0열 돌출 무대 밀착 구역',
    },
    {
      id: 'fb-picnic',
      title: '피크닉 잔디 돗자리 존 (Picnic Lawn)',
      category: 'picnic',
      capacity: 120, // 120팀 (약 480명)
      entryRule: '팀당 2m×2m 규격 돗자리 허용 (선착순 구역 배정)',
      colorClass: 'bg-emerald-500 text-white border-stone-900',
      desc: '캠핑 체어 불가, 피크닉 매트 전용 여유로운 잔디 힐링 구역',
    },
    {
      id: 'fb-food',
      title: 'F&B 푸드트럭 빌리지 & 비어가든',
      category: 'food',
      capacity: 350,
      entryRule: '자유 이용 (다회용기 반납 필수)',
      colorClass: 'bg-orange-500 text-white border-stone-900',
      desc: '인기 수제버거, 닭강정, 맥주 탭 등 푸드트럭 12대 & 스탠딩 테이블',
    },
    {
      id: 'fb-booth',
      title: '공식 MD 머치 스토어 & 스폰서 부스',
      category: 'booth',
      capacity: 250,
      entryRule: '당일 관람객 자유 입장',
      colorClass: 'bg-sky-500 text-white border-stone-900',
      desc: '페스티벌 공식 티셔츠, 슬로건 타월 및 브랜드 이벤트 존',
    },
    {
      id: 'fb-aid',
      title: '응급 의무실 & 분실물 / 안내 센터',
      category: 'aid',
      capacity: 20,
      entryRule: '상시 운영 (전문 간호사 및 구급차 대기)',
      colorClass: 'bg-rose-100 text-rose-800 border-rose-400',
      desc: '온열 질환 완화 쿨링 쉼터 및 무료 식수대 제공',
    },
  ];

  const [festivalBlocks, setFestivalBlocks] = useState<FestivalBlock[]>(initialFestivalBlocks);
  const [selectedFestivalBlockId, setSelectedFestivalBlockId] = useState<string>('fb-standing-a');

  const selectedFestivalBlock = useMemo(() => {
    return festivalBlocks.find((b) => b.id === selectedFestivalBlockId) || festivalBlocks[1];
  }, [festivalBlocks, selectedFestivalBlockId]);

  const festivalTotalCapacity = useMemo(() => {
    return festivalBlocks.reduce((sum, b) => sum + b.capacity, 0);
  }, [festivalBlocks]);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. UNIVERSAL SPACE MODE SWITCHER BAR */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#1c1917] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-stone-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full mb-1.5 border border-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin" />
              <span>POP-CON 유니버설 공간 &amp; 배치 엔진 (5대 문화 포맷 완벽 지원)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>문화 행사 유형별 맞춤형 공간 설계기</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-400 font-mono font-bold">
                Universal Studio
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              공연 좌석뿐 아니라 <strong>팝업스토어 부스·동선, 콜라보 카페 테이블, 전시회 섹션, 야외 페스티벌</strong>까지 모든 공간을 드래그·클릭으로 자유롭게 설계합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                onShowToast(`💾 [${currentMode.toUpperCase()}] 공간 구성 및 운영 설정이 정상 저장되었습니다!`);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-black text-xs sm:text-sm rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_#f59e0b] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Save className="w-4 h-4" />
              <span>현재 공간 저장</span>
            </button>
          </div>
        </div>

        {/* 5-Mode Switcher Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {/* Card 1: 팝업스토어 */}
          <button
            onClick={() => {
              setCurrentMode('popup');
              onShowToast('🛍️ [팝업스토어 부스 & 동선 설계기]로 전환되었습니다.');
            }}
            className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              currentMode === 'popup'
                ? 'bg-rose-50 border-rose-500 shadow-[3px_3px_0px_#e11d48] ring-2 ring-rose-400'
                : 'bg-stone-50 border-stone-300 hover:border-stone-900 hover:bg-white text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🛍️</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                currentMode === 'popup' ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                HOT 팝업
              </span>
            </div>
            <div className="font-black text-sm text-stone-900">팝업스토어</div>
            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
              포토존 · MD매대 · 가챠 · 타임정원
            </div>
            {currentMode === 'popup' && (
              <div className="mt-2 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> 활성 모드
              </div>
            )}
          </button>

          {/* Card 2: 공연 / 뮤지컬 */}
          <button
            onClick={() => {
              setCurrentMode('theatre');
              onShowToast('🎪 [공연 · 뮤지컬 비정형 좌석 스튜디오]로 전환되었습니다.');
            }}
            className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              currentMode === 'theatre'
                ? 'bg-purple-50 border-purple-600 shadow-[3px_3px_0px_#9333ea] ring-2 ring-purple-400'
                : 'bg-stone-50 border-stone-300 hover:border-stone-900 hover:bg-white text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🎪</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                currentMode === 'theatre' ? 'bg-purple-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                지정 좌석
              </span>
            </div>
            <div className="font-black text-sm text-stone-900">공연 · 뮤지컬</div>
            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
              부채꼴 · T자무대 · VIP/R/S/A
            </div>
            {currentMode === 'theatre' && (
              <div className="mt-2 text-[10px] font-bold text-purple-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> 활성 모드
              </div>
            )}
          </button>

          {/* Card 3: 콜라보 카페 */}
          <button
            onClick={() => {
              setCurrentMode('cafe');
              onShowToast('☕ [콜라보 카페 테이블 배치기]로 전환되었습니다.');
            }}
            className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              currentMode === 'cafe'
                ? 'bg-amber-50 border-amber-600 shadow-[3px_3px_0px_#d97706] ring-2 ring-amber-400'
                : 'bg-stone-50 border-stone-300 hover:border-stone-900 hover:bg-white text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">☕</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                currentMode === 'cafe' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-200 text-stone-600'
              }`}>
                테이블 타임제
              </span>
            </div>
            <div className="font-black text-sm text-stone-900">콜라보 카페</div>
            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
              2인석 · 부스석 · 바 · 70분제
            </div>
            {currentMode === 'cafe' && (
              <div className="mt-2 text-[10px] font-bold text-amber-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> 활성 모드
              </div>
            )}
          </button>

          {/* Card 4: 전시회 / 갤러리 */}
          <button
            onClick={() => {
              setCurrentMode('exhibition');
              onShowToast('🖼️ [전시회 섹션 & 도슨트 동선기]로 전환되었습니다.');
            }}
            className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              currentMode === 'exhibition'
                ? 'bg-sky-50 border-sky-600 shadow-[3px_3px_0px_#0284c7] ring-2 ring-sky-400'
                : 'bg-stone-50 border-stone-300 hover:border-stone-900 hover:bg-white text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🖼️</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                currentMode === 'exhibition' ? 'bg-sky-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                관람 섹션
              </span>
            </div>
            <div className="font-black text-sm text-stone-900">전시회 · 갤러리</div>
            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
              1~5룸 · 동선제어 · 도슨트
            </div>
            {currentMode === 'exhibition' && (
              <div className="mt-2 text-[10px] font-bold text-sky-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> 활성 모드
              </div>
            )}
          </button>

          {/* Card 5: 야외 페스티벌 */}
          <button
            onClick={() => {
              setCurrentMode('festival');
              onShowToast('🏕️ [야외 페스티벌 & 스탠딩 구역 블록]으로 전환되었습니다.');
            }}
            className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              currentMode === 'festival'
                ? 'bg-emerald-50 border-emerald-600 shadow-[3px_3px_0px_#059669] ring-2 ring-emerald-400'
                : 'bg-stone-50 border-stone-300 hover:border-stone-900 hover:bg-white text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🏕️</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                currentMode === 'festival' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                스탠딩/구역
              </span>
            </div>
            <div className="font-black text-sm text-stone-900">야외 페스티벌</div>
            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
              스탠딩A/B · 돗자리 · 푸드트럭
            </div>
            {currentMode === 'festival' && (
              <div className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> 활성 모드
              </div>
            )}
          </button>

          {/* Card 6: 완전 자유 샌드박스 빌더 */}
          <button
            onClick={() => {
              setCurrentMode('sandbox');
              onShowToast('🛠️ [완전 자유 샌드박스: 블록 & 길 만들기 스튜디오]로 전환되었습니다.');
            }}
            className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
              currentMode === 'sandbox'
                ? 'bg-amber-100 border-stone-900 shadow-[3px_3px_0px_#1c1917] ring-3 ring-amber-400'
                : 'bg-stone-50 border-stone-300 hover:border-stone-900 hover:bg-white text-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🛠️</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                currentMode === 'sandbox' ? 'bg-stone-950 text-amber-300 font-bold' : 'bg-stone-200 text-stone-600'
              }`}>
                100% 커스텀
              </span>
            </div>
            <div className="font-black text-sm text-stone-900">블록 &amp; 길 샌드박스</div>
            <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
              좌석 · 부스 · 통로길 100% 직접 그리기
            </div>
            {currentMode === 'sandbox' && (
              <div className="mt-2 text-[10px] font-bold text-stone-950 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> 활성 모드
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE-SPECIFIC CANVAS & STUDIO */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* [MODE 1] 🛍️ POP-UP STORE & BOOTH FLOW BUILDER */}
      {/* ------------------------------------------------------------------------- */}
      {currentMode === 'popup' && (
        <div className="space-y-6">
          {/* Top KPI Bar for Pop-up */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-rose-500" />
                <span>동시 매장 총 수용 정원</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {popupStats.maxStoreOccupancy}명
              </div>
              <div className="text-[10px] text-rose-600 font-bold mt-0.5">안전 과밀 방지 한계선</div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>타임슬롯당 예약 정원</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {popupSlotCapacity}명 <span className="text-xs font-normal text-stone-500">/ {popupSlotInterval}분</span>
              </div>
              <div className="text-[10px] text-indigo-600 font-bold mt-0.5">
                일일 총 {popupStats.dailySlots}개 타임슬롯
              </div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-amber-500" />
                <span>일일 총 수용 관람객</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {popupStats.totalDaily.toLocaleString()}명
              </div>
              <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                온라인 {popupStats.onlineDaily} + 현장 {popupStats.walkinDaily}
              </div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>예상 일일 굿즈 매출</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono mt-0.5">
                ₩{(popupStats.estimatedDailyRev / 10000).toLocaleString()}만원
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">객단가 ₩35,000 산정</div>
            </div>
          </div>

          {/* Main Visual Floorplan & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Floor Canvas */}
            <div className="lg:col-span-2 bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#1c1917] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-rose-500" />
                  <h3 className="font-black text-stone-900 text-base">
                    성수동 플래그십 매장 평면도 (Floor Plan)
                  </h3>
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                    60평 오픈스페이스
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPopupShowFlow(!popupShowFlow)}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      popupShowFlow
                        ? 'bg-rose-100 text-rose-900 border-rose-400 font-black'
                        : 'bg-stone-100 text-stone-600 border-stone-300'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>동선 안내선 {popupShowFlow ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const newId = `pz-custom-${Date.now()}`;
                      const newZone: PopupZone = {
                        id: newId,
                        name: '새 이벤트 부스',
                        type: 'rest',
                        capacity: 10,
                        dwellTimeMin: 5,
                        description: '커스텀 추가된 팝업 이벤트 부스',
                        icon: '🎪',
                        bgClass: 'bg-yellow-50',
                        borderClass: 'border-yellow-500',
                        textClass: 'text-yellow-900',
                        badge: 'NEW ZONE',
                        status: 'active',
                        colSpan: 2,
                        rowSpan: 1,
                      };
                      setPopupZones([...popupZones, newZone]);
                      setSelectedZoneId(newId);
                      onShowToast('✨ 새로운 팝업 부스가 매장에 추가되었습니다.');
                    }}
                    className="flex items-center gap-1 text-xs font-black bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-xl border border-stone-900 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>부스 추가</span>
                  </button>
                </div>
              </div>

              {/* Flow Path Guide Banner */}
              {popupShowFlow && (
                <div className="bg-stone-900 text-white px-3.5 py-2 rounded-2xl flex items-center justify-between text-[11px] overflow-x-auto gap-2">
                  <div className="flex items-center gap-1.5 shrink-0 font-bold text-amber-300">
                    <Footprints className="w-3.5 h-3.5 text-amber-400" />
                    <span>권장 관람 동선:</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-300 shrink-0 font-medium">
                    <span className="text-white font-bold">1. 체크인 입구</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                    <span>2. 대기열</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-300 font-bold">3. 시그니처 포토존</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                    <span>4. DIY 체험</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                    <span className="text-rose-400 font-bold">5. MD 스토어</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                    <span>6. 럭키 가챠</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                    <span className="text-emerald-400 font-bold">7. 사은품 수령 &amp; 퇴장</span>
                  </div>
                </div>
              )}

              {/* Interactive Floor Grid */}
              <div className="p-4 bg-stone-100 rounded-2xl border-2 border-stone-300 min-h-[420px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {popupZones.map((zone) => {
                    const isSelected = zone.id === selectedZoneId;
                    return (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                          zone.bgClass
                        } ${zone.borderClass} ${
                          isSelected
                            ? 'ring-4 ring-rose-400 shadow-[4px_4px_0px_#1c1917] scale-[1.02]'
                            : 'hover:shadow-[2px_2px_0px_#1c1917]'
                        }`}
                      >
                        {/* Zone Header */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xl">{zone.icon}</span>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                zone.status === 'crowded'
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : zone.status === 'standby'
                                  ? 'bg-stone-500 text-white'
                                  : 'bg-stone-900 text-white'
                              }`}
                            >
                              {zone.status === 'crowded' ? '혼잡' : zone.status === 'standby' ? '점검' : '정상'}
                            </span>
                          </div>

                          <div className={`font-black text-xs sm:text-sm ${zone.textClass}`}>
                            {zone.name}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                            {zone.description}
                          </div>
                        </div>

                        {/* Zone Footer Specs */}
                        <div className="mt-3 pt-2 border-t border-stone-300/60 flex items-center justify-between text-[10px] font-mono font-bold text-stone-700">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-stone-500" />
                            <span>최대 {zone.capacity}명</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-500" />
                            <span>체류 {zone.dwellTimeMin}분</span>
                          </span>
                        </div>

                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-stone-900 text-white p-1 rounded-full shadow-md">
                            <Check className="w-3 h-3 text-amber-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Zone Inspector & Slot Policies Panel */}
            <div className="space-y-5">
              {/* Selected Zone Editor */}
              <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedZone.icon}</span>
                    <h4 className="font-black text-sm text-stone-900">선택 부스 상세 설정</h4>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300">
                    {selectedZone.badge}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">부스 공식 명칭</label>
                    <input
                      type="text"
                      value={selectedZone.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setPopupZones(
                          popupZones.map((z) => (z.id === selectedZone.id ? { ...z, name: newName } : z))
                        );
                      }}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-bold focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">동시 체류 정원 (명)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={selectedZone.capacity}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 1;
                          setPopupZones(
                            popupZones.map((z) => (z.id === selectedZone.id ? { ...z, capacity: val } : z))
                          );
                        }}
                        className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">권장 체류 시간 (분)</label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={selectedZone.dwellTimeMin}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 1;
                          setPopupZones(
                            popupZones.map((z) =>
                              z.id === selectedZone.id ? { ...z, dwellTimeMin: val } : z
                            )
                          );
                        }}
                        className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">실시간 운영 상태</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['active', 'crowded', 'standby'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setPopupZones(
                              popupZones.map((z) =>
                                z.id === selectedZone.id ? { ...z, status: st } : z
                              )
                            );
                            onShowToast(`상태 변경: [${selectedZone.name}] ➔ ${st.toUpperCase()}`);
                          }}
                          className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            selectedZone.status === st
                              ? 'bg-stone-900 text-white border-stone-900 font-black'
                              : 'bg-stone-100 text-stone-600 border-stone-300'
                          }`}
                        >
                          {st === 'active' ? '🟢 정상' : st === 'crowded' ? '🟡 혼잡' : '🔴 점검'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">부스 안내 및 유의사항</label>
                    <textarea
                      rows={2}
                      value={selectedZone.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPopupZones(
                          popupZones.map((z) =>
                            z.id === selectedZone.id ? { ...z, description: val } : z
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-400 focus:outline-hidden"
                    />
                  </div>

                  {popupZones.length > 3 && (
                    <button
                      onClick={() => {
                        if (!confirm(`[${selectedZone.name}] 부스를 매장에서 삭제하시겠습니까?`)) return;
                        const filtered = popupZones.filter((z) => z.id !== selectedZone.id);
                        setPopupZones(filtered);
                        setSelectedZoneId(filtered[0]?.id || '');
                        onShowToast('🗑️ 부스가 삭제되었습니다.');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold border border-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>이 부스 삭제</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Slot & CatchTable Policy Config */}
              <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-stone-100 pb-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-black text-sm text-stone-900">타임슬롯 &amp; 웨이팅 정책</h4>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-700">회차별 타임 간격</span>
                      <span className="font-mono font-black text-indigo-600">{popupSlotInterval}분 단위</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPopupSlotInterval(30)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          popupSlotInterval === 30
                            ? 'bg-indigo-600 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        ⚡ 30분 단위 (추천)
                      </button>
                      <button
                        onClick={() => setPopupSlotInterval(60)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          popupSlotInterval === 60
                            ? 'bg-indigo-600 text-white border-stone-900 shadow-xs'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        🕒 60분 단위
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-700">회차당 온라인 사전예약 정원</span>
                      <span className="font-mono font-black text-rose-600">{popupSlotCapacity}명</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={popupSlotCapacity}
                      onChange={(e) => setPopupSlotCapacity(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>10명 (여유)</span>
                      <span>50명 (쾌적)</span>
                      <span>100명 (과밀)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-700">현장 워크인 (캐치테이블) 배분율</span>
                      <span className="font-mono font-black text-amber-600">{popupWalkinRatio}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={popupWalkinRatio}
                      onChange={(e) => setPopupWalkinRatio(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">1인당 굿즈 구매 제한 룰</label>
                    <input
                      type="text"
                      value={popupMaxPurchase}
                      onChange={(e) => setPopupMaxPurchase(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [MODE 2] ☕ COLLAB CAFÉ & TABLE FLOORPLAN */}
      {/* ------------------------------------------------------------------------- */}
      {currentMode === 'cafe' && (
        <div className="space-y-6">
          {/* Top KPI Bar for Cafe */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>총 테이블 / 동시 수용석</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {cafeStats.totalTables}개 <span className="text-xs font-normal text-stone-500">/ {cafeStats.totalSeats}석</span>
              </div>
              <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                2인석 · 4인 부스 · 바 1인석 완비
              </div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>회차당 이용 시간</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {cafeSessionTime}분 <span className="text-xs font-normal text-stone-500">(+10분 소독)</span>
              </div>
              <div className="text-[10px] text-purple-600 font-bold mt-0.5">
                1일 총 {cafeTimeSlots.length}타임 운영
              </div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                <span>현재 실시간 예약 현황</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {cafeStats.reservedTables} / {cafeStats.totalTables} <span className="text-xs font-normal text-stone-500">완료</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                잔여 {cafeStats.availableTables}개 예약 가능
              </div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-rose-600" />
                <span>회차당 예약금 매출</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono mt-0.5">
                ₩{cafeStats.sessionRev.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                일일 누적 ₩{cafeStats.dailyEstRev.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Café Floor Grid & Table Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#1c1917] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-stone-900 text-base">
                    콜라보 카페 테이블 배치 평면도
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Table Map
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> 예약가능
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-300">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> 예약완료
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-300">
                    <span className="w-2 h-2 rounded-full bg-stone-400" /> 방역/점검
                  </span>
                </div>
              </div>

              {/* Floor Canvas with Tables */}
              <div className="p-5 bg-amber-950/5 rounded-2xl border-2 border-amber-900/20 min-h-[400px]">
                <div className="mb-4 bg-amber-900/10 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>☕ 카운터 &amp; 픽업 바 (Beverage POS &amp; Goods Redemption)</span>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-mono text-amber-900 font-bold">
                    ORDER HERE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {cafeTables.map((table) => {
                    const isSelected = table.id === selectedTableId;
                    return (
                      <div
                        key={table.id}
                        onClick={() => setSelectedTableId(table.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                          table.status === 'reserved'
                            ? 'bg-purple-50 border-purple-400 text-purple-950'
                            : table.status === 'cleaning'
                            ? 'bg-stone-100 border-stone-300 text-stone-400 opacity-60'
                            : 'bg-white border-stone-900 text-stone-900'
                        } ${
                          isSelected
                            ? 'ring-4 ring-amber-400 shadow-[4px_4px_0px_#1c1917] scale-[1.02]'
                            : 'hover:shadow-[2px_2px_0px_#1c1917]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono font-black text-sm bg-stone-900 text-amber-300 px-2 py-0.5 rounded-lg">
                              {table.tableNumber}
                            </span>
                            <span className="text-[10px] font-bold text-stone-500 font-mono">
                              {table.seats}인석
                            </span>
                          </div>
                          <div className="font-bold text-xs line-clamp-1">{table.name}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5">{table.zone}</div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-bold">
                          <span className="font-mono text-rose-600">₩{table.deposit.toLocaleString()}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                              table.status === 'reserved'
                                ? 'bg-purple-200 text-purple-800'
                                : table.status === 'cleaning'
                                ? 'bg-stone-200 text-stone-600'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {table.status === 'reserved'
                              ? '예약됨'
                              : table.status === 'cleaning'
                              ? '방역'
                              : '가능'}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 p-1 rounded-full shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Table Inspector & Session Times Panel */}
            <div className="space-y-5">
              <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base bg-stone-900 text-amber-400 px-2 py-0.5 rounded-lg">
                      {selectedTable.tableNumber}
                    </span>
                    <h4 className="font-black text-sm text-stone-900">테이블 세부 설정</h4>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 font-mono">
                    {selectedTable.seats}인 전용
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">테이블 명칭</label>
                    <input
                      type="text"
                      value={selectedTable.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCafeTables(
                          cafeTables.map((t) => (t.id === selectedTable.id ? { ...t, name: val } : t))
                        );
                      }}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">좌석 수 (인)</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={selectedTable.seats}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 1;
                          setCafeTables(
                            cafeTables.map((t) => (t.id === selectedTable.id ? { ...t, seats: val } : t))
                          );
                        }}
                        className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">테이블 예약금 (원)</label>
                      <input
                        type="number"
                        step={1000}
                        value={selectedTable.deposit}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setCafeTables(
                            cafeTables.map((t) => (t.id === selectedTable.id ? { ...t, deposit: val } : t))
                          );
                        }}
                        className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold text-rose-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">예약 상태 변경</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['available', 'reserved', 'cleaning'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            setCafeTables(
                              cafeTables.map((t) => (t.id === selectedTable.id ? { ...t, status: st } : t))
                            );
                            onShowToast(`테이블 상태: [${selectedTable.tableNumber}] ➔ ${st.toUpperCase()}`);
                          }}
                          className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            selectedTable.status === st
                              ? 'bg-stone-900 text-white border-stone-900 font-black'
                              : 'bg-stone-100 text-stone-600 border-stone-300'
                          }`}
                        >
                          {st === 'available' ? '예약가능' : st === 'reserved' ? '예약완료' : '소독중'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">콜라보 방문 특전 굿즈</label>
                    <input
                      type="text"
                      value={selectedTable.perks}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCafeTables(
                          cafeTables.map((t) => (t.id === selectedTable.id ? { ...t, perks: val } : t))
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">주문 유의사항</label>
                    <input
                      type="text"
                      value={selectedTable.minOrder}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCafeTables(
                          cafeTables.map((t) => (t.id === selectedTable.id ? { ...t, minOrder: val } : t))
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Time Slots Preview */}
              <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>회차별 타임테이블 (70분 타임제)</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono font-bold">7회차 운영</span>
                </div>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                  {cafeTimeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-stone-800">{slot}</span>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                        예약 오픈
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [MODE 3] 🖼️ EXHIBITION SECTIONS & DOCENT FLOW */}
      {/* ------------------------------------------------------------------------- */}
      {currentMode === 'exhibition' && (
        <div className="space-y-6">
          {/* Top KPI Bar for Exhibition */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>총 전시 섹션 룸</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {sections.length}개 전시관
              </div>
              <div className="text-[10px] text-sky-700 font-bold mt-0.5">
                프롤로그 ➔ 원화 ➔ 미디어아트 ➔ 샵
              </div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>시간당 입장 수용 정원</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {hourlyCapacity}명 <span className="text-xs font-normal text-stone-500">/ 시간</span>
              </div>
              <div className="text-[10px] text-indigo-600 font-bold mt-0.5">쾌적한 갤러리 감상 유지</div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>평균 총 관람 소요 시간</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                약 90분
              </div>
              <div className="text-[10px] text-amber-700 font-bold mt-0.5">체류 시간 권장 기준</div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>도슨트 해설 투어</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono mt-0.5">
                1일 3회차
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">회차당 25명 한정</div>
            </div>
          </div>

          {/* Exhibition Flow Blocks & Room Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#1c1917] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-sky-600" />
                  <h3 className="font-black text-stone-900 text-base">전시 섹션 &amp; 관람 동선 맵</h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300">
                    <button
                      onClick={() => {
                        setExhibitionFlowMode('one_way');
                        onShowToast('🚶 [일방통행 강제 동선]으로 설정되었습니다.');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        exhibitionFlowMode === 'one_way'
                          ? 'bg-sky-600 text-white font-black shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      🚶 일방통행 동선
                    </button>
                    <button
                      onClick={() => {
                        setExhibitionFlowMode('free_flow');
                        onShowToast('🔄 [자유 관람 동선]으로 설정되었습니다.');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        exhibitionFlowMode === 'free_flow'
                          ? 'bg-sky-600 text-white font-black shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      🔄 자유 관람
                    </button>
                  </div>
                </div>
              </div>

              {/* Sections Flow List */}
              <div className="space-y-3">
                {sections.map((sec, idx) => {
                  const isSelected = sec.id === selectedSectionId;
                  return (
                    <div key={sec.id} className="relative">
                      <div
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-sky-50 border-sky-600 shadow-[4px_4px_0px_#1c1917] ring-2 ring-sky-400'
                            : 'bg-white border-stone-900 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-black font-mono text-sm shrink-0">
                            0{sec.num}
                          </div>
                          <div>
                            <div className="font-black text-sm text-stone-900 flex items-center gap-2">
                              <span>{sec.title}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                                {sec.type.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-stone-500 mt-0.5">{sec.theme}</div>
                            <div className="text-[11px] text-sky-800 font-bold mt-1 line-clamp-1">
                              ✨ 대표작: {sec.highlightWorks}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200 text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-stone-800">
                            최대 {sec.capacity}명 / {sec.avgMinutes}분
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">{sec.lighting}</div>
                        </div>
                      </div>

                      {/* Direction Arrow between rooms */}
                      {idx < sections.length - 1 && (
                        <div className="flex justify-center py-1">
                          <div className="bg-stone-200 text-stone-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowRight className="w-3 h-3 rotate-90" />
                            <span>다음 관람 섹션</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Inspector & Docent Config */}
            <div className="space-y-5">
              <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 font-black font-mono text-xs flex items-center justify-center">
                      0{selectedSection.num}
                    </div>
                    <h4 className="font-black text-sm text-stone-900">전시관 상세 설정</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                    Room Inspector
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">전시실 타이틀</label>
                    <input
                      type="text"
                      value={selectedSection.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(
                          sections.map((s) => (s.id === selectedSection.id ? { ...s, title: val } : s))
                        );
                      }}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">전시 테마 설명</label>
                    <input
                      type="text"
                      value={selectedSection.theme}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(
                          sections.map((s) => (s.id === selectedSection.id ? { ...s, theme: val } : s))
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">룸 수용 한도 (명)</label>
                      <input
                        type="number"
                        min={10}
                        max={200}
                        value={selectedSection.capacity}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 10;
                          setSections(
                            sections.map((s) => (s.id === selectedSection.id ? { ...s, capacity: val } : s))
                          );
                        }}
                        className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">권장 체류 (분)</label>
                      <input
                        type="number"
                        min={5}
                        max={60}
                        value={selectedSection.avgMinutes}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 5;
                          setSections(
                            sections.map((s) => (s.id === selectedSection.id ? { ...s, avgMinutes: val } : s))
                          );
                        }}
                        className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">조명 및 연출 무드</label>
                    <input
                      type="text"
                      value={selectedSection.lighting}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(
                          sections.map((s) => (s.id === selectedSection.id ? { ...s, lighting: val } : s))
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">오디오 가이드 트랙 정보</label>
                    <input
                      type="text"
                      value={selectedSection.audioGuide}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(
                          sections.map((s) => (s.id === selectedSection.id ? { ...s, audioGuide: val } : s))
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">대표 마스터피스 작품명</label>
                    <textarea
                      rows={2}
                      value={selectedSection.highlightWorks}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections(
                          sections.map((s) => (s.id === selectedSection.id ? { ...s, highlightWorks: val } : s))
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Docent Schedule */}
              <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-stone-900">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>도슨트 투어 타임테이블</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">회당 25명</span>
                </div>
                <div className="space-y-1.5">
                  {docentTimes.map((time, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-stone-800">{time}</span>
                      <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-300">
                        전문 큐레이터 동행
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [MODE 4] 🎪 AUDITORIUM & THEATRE SEATING BUILDER (Full Curved Fan & Balcony) */}
      {/* ------------------------------------------------------------------------- */}
      {currentMode === 'theatre' && (
        <div className="space-y-6">
          {/* Header & Presets */}
          <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#1c1917] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full mb-1 border border-purple-300">
                  <Layers className="w-3.5 h-3.5 text-purple-700" />
                  실제 극장 건축 기반 — 자유 비정형 좌석 배치 &amp; 매출 시뮬레이터
                </div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <span>{venueName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-normal">
                    {stageStyle === 'thrust_t' ? 'T자 돌출무대형' : stageStyle === 'runway' ? '패션쇼 런웨이형' : '부채꼴 대극장형'}
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Floor Tabs */}
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300">
                  <button
                    onClick={() => setActiveFloor('1F')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeFloor === '1F'
                        ? 'bg-purple-600 text-white font-black shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    1층 (Orchestra)
                  </button>
                  <button
                    onClick={() => setActiveFloor('2F')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeFloor === '2F'
                        ? 'bg-purple-600 text-white font-black shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    2층 (Balcony)
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-bold text-stone-500">
                    {activeFloor} 유효 좌석 / 예상 매출
                  </div>
                  <div className="text-base font-black text-rose-600 font-mono">
                    {seatCounts.totalValid}석 / ₩{seatCounts.totalRev.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Presets Button Row */}
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-600" />
                <span>국내 대표 대형 공연장 실제 건축 프리셋 즉시 로드:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <button
                  onClick={() => {
                    setStageStyle('proscenium');
                    setFanCurvature(50);
                    setWingAngle(18);
                    setIsStaggered(true);
                    setCurrentSeatLayout(generateCurvedFanPreset());
                    onShowToast('🏛️ [샤롯데씨어터] 3구역 부채꼴 대극장 프리셋이 적용되었습니다.');
                  }}
                  className="px-3 py-2 bg-stone-50 hover:bg-purple-50 hover:border-purple-500 border border-stone-300 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-black text-stone-900 group-hover:text-purple-700">
                    🏛️ 샤롯데 부채꼴
                  </div>
                  <div className="text-[10px] text-stone-500">부채꼴 아치 3구역</div>
                </button>

                <button
                  onClick={() => {
                    setStageStyle('thrust_t');
                    setFanCurvature(20);
                    setWingAngle(0);
                    setIsStaggered(false);
                    setCurrentSeatLayout(generateTStagePreset());
                    onShowToast('🏟️ [KSPO DOME] T자 돌출무대 & 스탠딩 펜스 프리셋이 적용되었습니다.');
                  }}
                  className="px-3 py-2 bg-stone-50 hover:bg-amber-50 hover:border-amber-500 border border-stone-300 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-black text-stone-900 group-hover:text-amber-700">
                    🏟️ KSPO DOME T자
                  </div>
                  <div className="text-[10px] text-stone-500">돌출무대 밀착 아레나</div>
                </button>

                <button
                  onClick={() => {
                    setStageStyle('proscenium');
                    setFanCurvature(35);
                    setWingAngle(22);
                    setCurrentSeatLayout(generateBalconyPreset());
                    onShowToast('🎭 [예술의전당] 오페라극장 다층 발코니 박스석 프리셋이 적용되었습니다.');
                  }}
                  className="px-3 py-2 bg-stone-50 hover:bg-sky-50 hover:border-sky-500 border border-stone-300 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-black text-stone-900 group-hover:text-sky-700">
                    🎭 오페라 다층 발코니
                  </div>
                  <div className="text-[10px] text-stone-500">좌우 박스석 특화</div>
                </button>

                <button
                  onClick={() => {
                    setStageStyle('circular_arena');
                    setFanCurvature(60);
                    setWingAngle(12);
                    onShowToast('🎪 [성수 에스팩토리] 비정형 아일랜드 런웨이 구조가 적용되었습니다.');
                  }}
                  className="px-3 py-2 bg-stone-50 hover:bg-rose-50 hover:border-rose-500 border border-stone-300 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-black text-stone-900 group-hover:text-rose-700">
                    🎪 성수 비정형 아일랜드
                  </div>
                  <div className="text-[10px] text-stone-500">런웨이 캣워크</div>
                </button>

                <button
                  onClick={() => {
                    setStageStyle('proscenium');
                    setFanCurvature(10);
                    setWingAngle(5);
                    setIsStaggered(true);
                    onShowToast('🎬 [대학로 소극장] 지그재그 시야각 배치가 적용되었습니다.');
                  }}
                  className="px-3 py-2 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-500 border border-stone-300 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-black text-stone-900 group-hover:text-emerald-700">
                    🎬 소극장 지그재그
                  </div>
                  <div className="text-[10px] text-stone-500">단차 시야각 오프셋</div>
                </button>
              </div>
            </div>
          </div>

          {/* Seat Layout Studio Main */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Visual Stage & Seating Canvas */}
            <div className="lg:col-span-3 bg-stone-900 rounded-3xl p-6 sm:p-8 text-white border-2 border-stone-900 shadow-[6px_6px_0px_#1c1917] flex flex-col items-center relative overflow-hidden">
              {/* Stage Visual */}
              <div className="w-full max-w-xl mb-8 flex flex-col items-center">
                <div className="w-3/4 h-12 bg-linear-to-b from-purple-500/20 to-purple-600/60 border-2 border-purple-400 rounded-t-3xl flex items-center justify-center font-black text-sm text-purple-100 tracking-widest shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                  ★ STAGE (메인 무대) ★
                </div>
                {stageStyle === 'thrust_t' && (
                  <div className="w-24 h-20 bg-linear-to-b from-purple-600/60 to-purple-800/80 border-x-2 border-b-2 border-purple-400 rounded-b-xl flex items-center justify-center text-[11px] font-bold text-purple-200">
                    T자 돌출 무대
                  </div>
                )}
              </div>

              {/* Seating Grid with fan curve offset */}
              <div className="w-full overflow-x-auto pb-6">
                <div className="min-w-[650px] mx-auto space-y-2">
                  {seatRows.map((row, rIdx) => {
                    const curveOffset = Math.sin((rIdx / (seatRows.length - 1)) * Math.PI) * (fanCurvature * 0.15);
                    const staggerOffset = isStaggered && rIdx % 2 === 1 ? 12 : 0;

                    return (
                      <div
                        key={row}
                        className="flex items-center justify-center gap-1 transition-transform"
                        style={{
                          transform: `translateY(${curveOffset}px) translateX(${staggerOffset}px)`,
                        }}
                      >
                        <span className="w-5 text-right font-mono font-bold text-xs text-stone-400 mr-2">
                          {row}
                        </span>

                        {seatCols.map((col) => {
                          const id = `${row}${col}`;
                          const grade = currentSeatLayout[id] || 'empty';

                          let colorClass = 'bg-stone-800/60 border-stone-700/50 hover:bg-stone-700';
                          if (grade === 'op') colorClass = 'bg-amber-400 border-amber-300 text-stone-950 font-black shadow-[0_0_8px_rgba(251,191,36,0.6)]';
                          else if (grade === 'vip') colorClass = 'bg-amber-500 border-amber-400 text-stone-950 font-black shadow-[0_0_6px_rgba(245,158,11,0.5)]';
                          else if (grade === 'r') colorClass = 'bg-purple-500 border-purple-400 text-white font-bold';
                          else if (grade === 's') colorClass = 'bg-sky-500 border-sky-400 text-white font-bold';
                          else if (grade === 'a') colorClass = 'bg-emerald-500 border-emerald-400 text-white font-bold';
                          else if (grade === 'wheelchair') colorClass = 'bg-pink-500 border-pink-400 text-white font-bold';

                          return (
                            <button
                              key={id}
                              onClick={() => handleSeatClick(id)}
                              title={`${id}석 [${grade.toUpperCase()}]`}
                              className={`w-6 h-6 rounded-md border text-[9px] flex items-center justify-center transition-all cursor-pointer ${colorClass} ${
                                grade === 'empty' ? 'opacity-30' : 'opacity-100 hover:scale-110'
                              }`}
                            >
                              {grade !== 'empty' && (grade === 'wheelchair' ? '♿' : col)}
                            </button>
                          );
                        })}

                        <span className="w-5 text-left font-mono font-bold text-xs text-stone-400 ml-2">
                          {row}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Theatre Tool Palette & Controls */}
            <div className="space-y-4">
              {/* Brush Tools */}
              <div className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[4px_4px_0px_#1c1917] space-y-3">
                <div className="font-black text-xs text-stone-900 flex items-center gap-1.5 border-b pb-2">
                  <Wand2 className="w-4 h-4 text-purple-600" />
                  <span>좌석 등급 브러시 팔레트</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(['op', 'vip', 'r', 's', 'a', 'wheelchair', 'empty'] as const).map((grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedSeatTool(grade)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        selectedSeatTool === grade
                          ? 'border-2 border-stone-900 ring-2 ring-purple-400 font-black shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="uppercase">{grade === 'wheelchair' ? '♿ 휠체어' : grade === 'empty' ? '🧹 지우개' : `${grade}석`}</span>
                      <span className="font-mono text-[10px] text-stone-500">
                        {grade === 'empty' ? '-' : `₩${(seatPrices[grade as keyof typeof seatPrices] / 10000).toLocaleString()}만`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Architectural Sliders */}
              <div className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[4px_4px_0px_#1c1917] space-y-3">
                <div className="font-black text-xs text-stone-900 flex items-center gap-1.5 border-b pb-2">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>건축 곡률 &amp; 시야각 정밀 조정</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>부채꼴 아치 곡률</span>
                    <span className="font-mono text-purple-600">{fanCurvature}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={fanCurvature}
                    onChange={(e) => setFanCurvature(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>날개석 안쪽 경사각</span>
                    <span className="font-mono text-purple-600">{wingAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={wingAngle}
                    onChange={(e) => setWingAngle(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-stone-700">단차 지그재그 시야각</span>
                  <input
                    type="checkbox"
                    checked={isStaggered}
                    onChange={(e) => setIsStaggered(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [MODE 5] 🏕️ OUTDOOR FESTIVAL & STANDING FIELD BUILDER */}
      {/* ------------------------------------------------------------------------- */}
      {currentMode === 'festival' && (
        <div className="space-y-6">
          {/* Top KPI Bar for Festival */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Tent className="w-3.5 h-3.5 text-emerald-600" />
                <span>페스티벌 총 수용 정원</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                {festivalTotalCapacity.toLocaleString()}명
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">대규모 야외 페스티벌</div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-purple-600" />
                <span>스탠딩 펜스 수용 인원</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                1,800명 <span className="text-xs font-normal text-stone-500">(A/B/VIP)</span>
              </div>
              <div className="text-[10px] text-purple-600 font-bold mt-0.5">번호순 순차 입장</div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>피크닉 잔디 돗자리 존</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                120팀 <span className="text-xs font-normal text-stone-500">(약 480명)</span>
              </div>
              <div className="text-[10px] text-amber-700 font-bold mt-0.5">2m×2m 돗자리 규격</div>
            </div>

            <div className="bg-white border-2 border-stone-900 p-4 rounded-2xl shadow-[3px_3px_0px_#1c1917]">
              <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-orange-600" />
                <span>푸드트럭 &amp; 스폰서 부스</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-orange-600 font-mono mt-0.5">
                18개 부스
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">비어가든 &amp; MD 텐트</div>
            </div>
          </div>

          {/* Festival Map & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-6 shadow-[5px_5px_0px_#1c1917] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Tent className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-stone-900 text-base">야외 페스티벌 블록 배치도</h3>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  난지한강공원 / 올림픽 잔디마당 규격
                </span>
              </div>

              {/* Outdoor Visual Layout */}
              <div className="p-5 bg-stone-900 rounded-2xl border-2 border-stone-900 text-white min-h-[420px] space-y-4">
                {/* Main Stage */}
                <div className="bg-linear-to-r from-purple-900 via-amber-800 to-purple-900 p-4 rounded-2xl border-2 border-amber-400 text-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                  <div className="text-sm font-black text-amber-300 tracking-wider">
                    ★ HEADLINER MAIN STAGE (음향 타워 &amp; LED 월) ★
                  </div>
                </div>

                {/* Standing Blocks Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {festivalBlocks
                    .filter((b) => b.category === 'standing')
                    .map((block) => {
                      const isSelected = block.id === selectedFestivalBlockId;
                      return (
                        <div
                          key={block.id}
                          onClick={() => setSelectedFestivalBlockId(block.id)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                            block.colorClass
                          } ${
                            isSelected
                              ? 'ring-4 ring-amber-400 scale-[1.02] shadow-[3px_3px_0px_#fff]'
                              : 'opacity-90 hover:opacity-100'
                          }`}
                        >
                          <div className="font-black text-xs">{block.title}</div>
                          <div className="text-xl font-black font-mono mt-1">{block.capacity}명</div>
                          <div className="text-[10px] opacity-80 mt-1 line-clamp-1">{block.entryRule}</div>
                        </div>
                      );
                    })}
                </div>

                {/* Picnic Lawn & F&B Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {festivalBlocks
                    .filter((b) => ['picnic', 'food'].includes(b.category))
                    .map((block) => {
                      const isSelected = block.id === selectedFestivalBlockId;
                      return (
                        <div
                          key={block.id}
                          onClick={() => setSelectedFestivalBlockId(block.id)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            block.colorClass
                          } ${
                            isSelected
                              ? 'ring-4 ring-amber-400 scale-[1.02] shadow-[3px_3px_0px_#fff]'
                              : 'opacity-90 hover:opacity-100'
                          }`}
                        >
                          <div className="font-black text-xs">{block.title}</div>
                          <div className="text-lg font-black font-mono mt-1">수용: {block.capacity}명</div>
                          <div className="text-[10px] opacity-80 mt-1">{block.desc}</div>
                        </div>
                      );
                    })}
                </div>

                {/* Support Facilities Row */}
                <div className="grid grid-cols-2 gap-3">
                  {festivalBlocks
                    .filter((b) => ['booth', 'aid'].includes(b.category))
                    .map((block) => {
                      const isSelected = block.id === selectedFestivalBlockId;
                      return (
                        <div
                          key={block.id}
                          onClick={() => setSelectedFestivalBlockId(block.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            block.colorClass
                          } ${isSelected ? 'ring-2 ring-white font-black' : ''}`}
                        >
                          <div className="text-xs font-bold">{block.title}</div>
                          <div className="text-[10px] opacity-80">{block.desc}</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Festival Inspector Panel */}
            <div className="space-y-5">
              <div className="bg-white border-2 border-stone-900 rounded-3xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-stone-100 pb-2.5">
                  <h4 className="font-black text-sm text-stone-900">구역 상세 정책</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Zone Inspector
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">구역 타이틀</label>
                    <input
                      type="text"
                      value={selectedFestivalBlock.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFestivalBlocks(
                          festivalBlocks.map((b) =>
                            b.id === selectedFestivalBlock.id ? { ...b, title: val } : b
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">수용 정원 (명 / 팀)</label>
                    <input
                      type="number"
                      step={50}
                      value={selectedFestivalBlock.capacity}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setFestivalBlocks(
                          festivalBlocks.map((b) =>
                            b.id === selectedFestivalBlock.id ? { ...b, capacity: val } : b
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">입장 순서 및 게이트 룰</label>
                    <textarea
                      rows={2}
                      value={selectedFestivalBlock.entryRule}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFestivalBlocks(
                          festivalBlocks.map((b) =>
                            b.id === selectedFestivalBlock.id ? { ...b, entryRule: val } : b
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">구역 특이사항</label>
                    <textarea
                      rows={2}
                      value={selectedFestivalBlock.desc}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFestivalBlocks(
                          festivalBlocks.map((b) =>
                            b.id === selectedFestivalBlock.id ? { ...b, desc: val } : b
                          )
                        );
                      }}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* [MODE 6] 🛠️ FREEFORM CUSTOM GRID SANDBOX STUDIO (블록 & 길 샌드박스) */}
      {/* ------------------------------------------------------------------------- */}
      {currentMode === 'sandbox' && (
        <CustomGridSandboxStudio
          venueName={venueName}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
