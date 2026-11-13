'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Grid,
  Footprints,
  Compass,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Save,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Store,
  Camera,
  Coffee,
  Mic2,
  Gift,
  HelpCircle,
  Maximize2,
  Sliders,
  DollarSign,
  Users,
  Eye,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  DoorOpen,
  LogOut,
  Eraser,
  Wand2,
  Plus,
  X,
  Palette,
  Tag,
  Box,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronLeft,
  Undo2,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';

export type SandboxTileType =
  | 'empty'
  | 'path'
  | 'path_arrow_r'
  | 'path_arrow_d'
  | 'path_arrow_l'
  | 'path_arrow_u'
  | 'queue'
  | 'wall'
  | 'entrance'
  | 'exit'
  | 'seat_vip'
  | 'seat_r'
  | 'seat_s'
  | 'seat_std'
  | 'seat_wheelchair'
  | 'booth_merch'
  | 'booth_photo'
  | 'booth_kiosk'
  | 'cafe_table'
  | 'stage'
  | 'booth_gacha'
  | 'restroom';

export interface SandboxTile {
  id: string;
  x: number;
  y: number;
  type: SandboxTileType;
  label?: string;
  price?: number;
  capacity?: number;
  note?: string;

  // Custom & Multi-tile block attributes
  isCustom?: boolean;
  customDefId?: string;
  width?: number; // width in tiles (1~4)
  height?: number; // height in tiles (1~4)
  isOrigin?: boolean; // true if top-left cell, false if child covered cell
  parentOriginId?: string;
  emoji?: string;
  customBg?: string;
  customBorder?: string;
  customColor?: string;
  isSeat?: boolean;
  seatGrade?: string;
}

export interface CustomBlockDefinition {
  id: string;
  name: string;
  category: 'seat' | 'booth' | 'facility';
  width: number; // 1 ~ 4
  height: number; // 1 ~ 4
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  price?: number;
  capacity?: number;
  isSeat?: boolean;
  seatGrade?: string;
  description?: string;
}

export interface CustomGridSandboxStudioProps {
  venueName?: string;
  onSaveLayout?: (data: { tiles: SandboxTile[]; stats: any }) => void;
  onShowToast?: (msg: string) => void;
}

// 20 columns x 12 rows
const DEFAULT_GRID_COLS = 20;
const DEFAULT_GRID_ROWS = 12;

interface ToolMeta {
  type: SandboxTileType | 'eraser' | 'inspect';
  label: string;
  category: 'path' | 'seat' | 'booth' | 'tool';
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  badge?: string;
  description: string;
  defaultPrice?: number;
  defaultCapacity?: number;
}

const TOOLS_CONFIG: ToolMeta[] = [
  // --- Tools ---
  {
    type: 'inspect',
    label: '선택 및 검사',
    category: 'tool',
    icon: Eye,
    color: 'text-stone-800',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-400',
    description: '타일을 클릭하여 이름, 크기, 가격을 확인하고 편집합니다.',
  },
  {
    type: 'eraser',
    label: '지우개 (바닥 복원)',
    category: 'tool',
    icon: Eraser,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-400',
    description: '드래그하여 블록을 빈 바닥으로 지웁니다.',
  },

  // --- Paths & Flow ---
  {
    type: 'entrance',
    label: '입구 게이트 (IN)',
    category: 'path',
    icon: DoorOpen,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-500',
    badge: '시작점',
    description: '관람객이 입장하는 첫 관문 게이트입니다.',
    defaultCapacity: 50,
  },
  {
    type: 'exit',
    label: '출구 게이트 (OUT)',
    category: 'path',
    icon: LogOut,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    badge: '도착점',
    description: '관람을 마치고 퇴장하는 출구입니다.',
  },
  {
    type: 'path',
    label: '보행로 / 길 타일',
    category: 'path',
    icon: Footprints,
    color: 'text-stone-700',
    bgColor: 'bg-stone-200',
    borderColor: 'border-stone-400',
    description: '관람객이 자유롭게 걸어 다니는 일반 보행 통로입니다.',
  },
  {
    type: 'path_arrow_r',
    label: '동선 화살표 (➔)',
    category: 'path',
    icon: ArrowRight,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    description: '우측 방향으로 관람 동선을 유도합니다.',
  },
  {
    type: 'path_arrow_d',
    label: '동선 화살표 (⬇)',
    category: 'path',
    icon: ArrowDown,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    description: '아래쪽 방향으로 관람 동선을 유도합니다.',
  },
  {
    type: 'queue',
    label: '대기열 / 펜스 라인',
    category: 'path',
    icon: Compass,
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-500',
    badge: '줄서기',
    description: '인기 부스 앞 혼잡을 방지하기 위한 대기 라인입니다.',
  },
  {
    type: 'wall',
    label: '가벽 / 파티션 (차단)',
    category: 'path',
    icon: ShieldCheck,
    color: 'text-stone-200',
    bgColor: 'bg-stone-800',
    borderColor: 'border-stone-900',
    description: '관람객 통행을 차단하는 2.4m 방음 및 디스플레이 가벽입니다.',
  },

  // --- Standard Seats ---
  {
    type: 'seat_vip',
    label: '👑 VIP석 (골드)',
    category: 'seat',
    icon: Sparkles,
    color: 'text-amber-900',
    bgColor: 'bg-amber-400',
    borderColor: 'border-amber-600',
    badge: '₩170,000',
    description: '최고급 시야 및 웰컴 기프트가 포함된 VIP 지정 좌석입니다.',
    defaultPrice: 170000,
    defaultCapacity: 1,
  },
  {
    type: 'seat_r',
    label: '💎 R석 (퍼플)',
    category: 'seat',
    icon: Layers,
    color: 'text-purple-900',
    bgColor: 'bg-purple-300',
    borderColor: 'border-purple-500',
    badge: '₩140,000',
    description: '무대 및 부스와 인접한 로열 R석입니다.',
    defaultPrice: 140000,
    defaultCapacity: 1,
  },
  {
    type: 'seat_s',
    label: '🎫 S석 (에메랄드)',
    category: 'seat',
    icon: CheckCircle2,
    color: 'text-emerald-900',
    bgColor: 'bg-emerald-300',
    borderColor: 'border-emerald-500',
    badge: '₩100,000',
    description: '가성비가 뛰어난 표준 S석입니다.',
    defaultPrice: 100000,
    defaultCapacity: 1,
  },
  {
    type: 'seat_std',
    label: '🪑 일반 지정석 (블루)',
    category: 'seat',
    icon: Users,
    color: 'text-blue-900',
    bgColor: 'bg-blue-200',
    borderColor: 'border-blue-400',
    badge: '₩70,000',
    description: '기본 관람석 및 자유 좌석입니다.',
    defaultPrice: 70000,
    defaultCapacity: 1,
  },
  {
    type: 'seat_wheelchair',
    label: '♿ 휠체어 배려석',
    category: 'seat',
    icon: Users,
    color: 'text-cyan-900',
    bgColor: 'bg-cyan-200',
    borderColor: 'border-cyan-400',
    badge: '₩50,000',
    description: '경사로 접근이 용이한 장애인/휠체어 전용석입니다.',
    defaultPrice: 50000,
    defaultCapacity: 1,
  },

  // --- Booths & Facilities ---
  {
    type: 'booth_merch',
    label: '🛍️ MD 굿즈 판매대',
    category: 'booth',
    icon: Store,
    color: 'text-rose-900',
    bgColor: 'bg-rose-200',
    borderColor: 'border-rose-500',
    badge: '부스',
    description: '공식 굿즈, 아크릴, 피규어 판매 전용 부스입니다.',
    defaultCapacity: 15,
  },
  {
    type: 'booth_photo',
    label: '📸 대형 포토존',
    category: 'booth',
    icon: Camera,
    color: 'text-yellow-900',
    bgColor: 'bg-yellow-300',
    borderColor: 'border-yellow-600',
    badge: '체험',
    description: '인증샷 촬영용 캐릭터 등신대 및 조형물 구역입니다.',
    defaultCapacity: 8,
  },
  {
    type: 'booth_kiosk',
    label: '🎟️ 키오스크 / 발권기',
    category: 'booth',
    icon: Sliders,
    color: 'text-indigo-900',
    bgColor: 'bg-indigo-200',
    borderColor: 'border-indigo-500',
    description: '모바일 티켓 발권 및 번호표 출력기입니다.',
    defaultCapacity: 4,
  },
  {
    type: 'cafe_table',
    label: '☕ 카페 테이블 (2~4인)',
    category: 'booth',
    icon: Coffee,
    color: 'text-amber-900',
    bgColor: 'bg-amber-200',
    borderColor: 'border-amber-700',
    description: '음료와 디저트를 취식할 수 있는 테이블 공간입니다.',
    defaultCapacity: 4,
    defaultPrice: 15000,
  },
  {
    type: 'stage',
    label: '🎤 무대 / 스테이지 단상',
    category: 'booth',
    icon: Mic2,
    color: 'text-purple-100',
    bgColor: 'bg-purple-950',
    borderColor: 'border-amber-400',
    badge: 'STAGE',
    description: '공연, 아티스트 토크, DJ 부스용 메인 단상입니다.',
  },
  {
    type: 'booth_gacha',
    label: '🎁 럭키드로우 / 가챠존',
    category: 'booth',
    icon: Gift,
    color: 'text-pink-900',
    bgColor: 'bg-pink-300',
    borderColor: 'border-pink-500',
    description: '캡슐 토이 뽑기 및 랜덤 럭키박스 기계 구역입니다.',
    defaultCapacity: 10,
  },
  {
    type: 'restroom',
    label: '🚻 화장실 / 편의시설',
    category: 'booth',
    icon: HelpCircle,
    color: 'text-slate-800',
    bgColor: 'bg-slate-200',
    borderColor: 'border-slate-500',
    description: '화장실, 물품 보관함(라커) 및 안내 데스크입니다.',
  },
];

// Pre-registered initial custom blocks
const INITIAL_CUSTOM_BLOCKS: CustomBlockDefinition[] = [
  {
    id: 'cb-vvip-sofa',
    name: 'VVIP 2인 커플 소파석',
    category: 'seat',
    width: 2,
    height: 1,
    emoji: '🛋️',
    bgColor: 'bg-amber-400',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-950',
    price: 250000,
    capacity: 2,
    isSeat: true,
    seatGrade: 'VVIP',
    description: '최고급 프리미엄 2인 가죽 리클라이너 소파석 (웰컴 샴페인 포함)',
  },
  {
    id: 'cb-family-lounge',
    name: '4인 패밀리 라운지석',
    category: 'seat',
    width: 2,
    height: 2,
    emoji: '👑',
    bgColor: 'bg-purple-400',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-950',
    price: 360000,
    capacity: 4,
    isSeat: true,
    seatGrade: 'FAMILY VIP',
    description: '가족 및 소모임을 위한 4인 프라이빗 박스 라운지석',
  },
  {
    id: 'cb-giant-photo',
    name: '초대형 3D 포토월 부스',
    category: 'booth',
    width: 2,
    height: 2,
    emoji: '📸',
    bgColor: 'bg-yellow-300',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-950',
    capacity: 8,
    isSeat: false,
    description: '3.5m 자이언트 캐릭터 조형물 & 입체 네온 포토존',
  },
  {
    id: 'cb-flagship-store',
    name: '메인 MD 플래그십 쇼룸',
    category: 'booth',
    width: 3,
    height: 2,
    emoji: '🛍️',
    bgColor: 'bg-rose-300',
    borderColor: 'border-rose-600',
    textColor: 'text-rose-950',
    capacity: 20,
    isSeat: false,
    description: '한정판 의류, 피규어 및 POS 결제 4대를 통합한 대형 쇼룸',
  },
];

// ----------------------------------------------------
// Pre-built Layout Templates
// ----------------------------------------------------
const PRESET_TEMPLATES = {
  blank: (cols: number = DEFAULT_GRID_COLS, rows: number = DEFAULT_GRID_ROWS) => {
    const tiles: SandboxTile[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        tiles.push({
          id: `t_${x}_${y}`,
          x,
          y,
          type: 'empty',
          width: 1,
          height: 1,
          isOrigin: true,
        });
      }
    }
    return tiles;
  },

  popup_loop: () => {
    const tiles = PRESET_TEMPLATES.blank();
    const map = new Map<string, SandboxTile>();
    tiles.forEach((t) => map.set(`${t.x},${t.y}`, t));

    const setTile = (x: number, y: number, type: SandboxTileType, label?: string) => {
      const t = map.get(`${x},${y}`);
      if (t) {
        t.type = type;
        if (label) t.label = label;
      }
    };

    const setCustomBlock = (x: number, y: number, def: CustomBlockDefinition) => {
      const rootId = `t_${x}_${y}`;
      for (let dy = 0; dy < def.height; dy++) {
        for (let dx = 0; dx < def.width; dx++) {
          const t = map.get(`${x + dx},${y + dy}`);
          if (t) {
            if (dx === 0 && dy === 0) {
              t.type = def.isSeat ? 'seat_vip' : 'booth_merch';
              t.isCustom = true;
              t.customDefId = def.id;
              t.label = def.name;
              t.width = def.width;
              t.height = def.height;
              t.isOrigin = true;
              t.parentOriginId = undefined;
              t.emoji = def.emoji;
              t.customBg = def.bgColor;
              t.customBorder = def.borderColor;
              t.customColor = def.textColor;
              t.isSeat = def.isSeat;
              t.seatGrade = def.seatGrade;
              t.price = def.price;
              t.capacity = def.capacity;
              t.note = def.description;
            } else {
              t.type = def.isSeat ? 'seat_vip' : 'booth_merch';
              t.isCustom = true;
              t.customDefId = def.id;
              t.isOrigin = false;
              t.parentOriginId = rootId;
              t.width = 1;
              t.height = 1;
            }
          }
        }
      }
    };

    // Entrance at (1, 10)
    setTile(1, 10, 'entrance', '메인 입구');
    setTile(1, 9, 'path_arrow_u', '입장');
    setTile(1, 8, 'path_arrow_u');

    // Queue line at (1, 7) ~ (1, 5)
    setTile(1, 7, 'queue', '대기열 1');
    setTile(1, 6, 'queue', '대기열 2');
    setTile(1, 5, 'queue', '대기열 3');

    // Kiosk
    setTile(2, 5, 'booth_kiosk', '모바일 발권기');

    // Walkway loop
    for (let x = 1; x <= 18; x++) {
      setTile(x, 4, 'path_arrow_r', '관람 동선');
    }

    // Walls partitioning zones
    for (let x = 0; x < 20; x++) {
      setTile(x, 0, 'wall');
      setTile(x, 11, 'wall');
    }
    for (let y = 0; y < 12; y++) {
      if (y !== 10) setTile(0, y, 'wall');
      if (y !== 10) setTile(19, y, 'wall');
    }

    // Custom 2x2 Photo Wall at (3, 2)
    setCustomBlock(3, 2, INITIAL_CUSTOM_BLOCKS[2]);

    // Custom 3x2 Flagship Merch Showroom at (12, 2)
    setCustomBlock(12, 2, INITIAL_CUSTOM_BLOCKS[3]);

    // Custom 2x1 VVIP Sofa Seat at (7, 7)
    setCustomBlock(7, 7, INITIAL_CUSTOM_BLOCKS[0]);

    // Downward flow
    setTile(18, 5, 'path_arrow_d');
    setTile(18, 6, 'path_arrow_d');
    setTile(18, 7, 'path_arrow_d');
    setTile(18, 8, 'path_arrow_d');

    // Gacha & Cafe Table
    setTile(15, 7, 'booth_gacha', '가챠 머신');
    setTile(16, 7, 'booth_gacha', '가챠 머신');
    setTile(12, 7, 'cafe_table', '체험 테이블');
    setTile(13, 7, 'cafe_table', '체험 테이블');

    // Return path to exit
    setTile(18, 9, 'path_arrow_d');
    setTile(18, 10, 'exit', '퇴장 출구');

    // Interior separator walls
    for (let x = 3; x <= 16; x++) {
      setTile(x, 5, 'wall');
    }

    return Array.from(map.values());
  },

  theatre_thrust: () => {
    const tiles = PRESET_TEMPLATES.blank();
    const map = new Map<string, SandboxTile>();
    tiles.forEach((t) => map.set(`${t.x},${t.y}`, t));

    const setTile = (x: number, y: number, type: SandboxTileType, label?: string) => {
      const t = map.get(`${x},${y}`);
      if (t) {
        t.type = type;
        if (label) t.label = label;
      }
    };

    // Stage (Top & Thrust T-Shape)
    for (let x = 6; x <= 13; x++) {
      setTile(x, 1, 'stage', 'MAIN STAGE');
      setTile(x, 2, 'stage', 'MAIN STAGE');
    }
    setTile(9, 3, 'stage', '돌출무대');
    setTile(10, 3, 'stage', '돌출무대');
    setTile(9, 4, 'stage', '돌출무대');
    setTile(10, 4, 'stage', '돌출무대');

    // Aisle paths around thrust
    for (let y = 1; y <= 10; y++) {
      setTile(5, y, 'path');
      setTile(14, y, 'path');
    }
    for (let x = 0; x < 20; x++) {
      setTile(x, 5, 'path');
      setTile(x, 10, 'path');
    }

    // Entrances and Exits
    setTile(5, 11, 'entrance', '좌측 객석입구');
    setTile(14, 11, 'exit', '우측 객석출구');

    // VIP Seats near stage
    for (let x = 6; x <= 8; x++) {
      setTile(x, 3, 'seat_vip', `VIP-${x}-3`);
      setTile(x, 4, 'seat_vip', `VIP-${x}-4`);
    }
    for (let x = 11; x <= 13; x++) {
      setTile(x, 3, 'seat_vip', `VIP-${x}-3`);
      setTile(x, 4, 'seat_vip', `VIP-${x}-4`);
    }

    // R Seats (Rows 6-7)
    for (let x = 1; x <= 4; x++) {
      setTile(x, 3, 'seat_r');
      setTile(x, 4, 'seat_r');
    }
    for (let x = 15; x <= 18; x++) {
      setTile(x, 3, 'seat_r');
      setTile(x, 4, 'seat_r');
    }
    for (let x = 6; x <= 13; x++) {
      setTile(x, 6, 'seat_r');
      setTile(x, 7, 'seat_r');
    }

    // S Seats (Rows 8-9)
    for (let x = 6; x <= 13; x++) {
      setTile(x, 8, 'seat_s');
      setTile(x, 9, 'seat_s');
    }

    // Wheelchair accessible seats at the back
    setTile(3, 9, 'seat_wheelchair', '휠체어석');
    setTile(4, 9, 'seat_wheelchair', '휠체어석');
    setTile(15, 9, 'seat_wheelchair', '휠체어석');
    setTile(16, 9, 'seat_wheelchair', '휠체어석');

    return Array.from(map.values());
  },

  cafe_market: () => {
    const tiles = PRESET_TEMPLATES.blank();
    const map = new Map<string, SandboxTile>();
    tiles.forEach((t) => map.set(`${t.x},${t.y}`, t));

    const setTile = (x: number, y: number, type: SandboxTileType, label?: string) => {
      const t = map.get(`${x},${y}`);
      if (t) {
        t.type = type;
        if (label) t.label = label;
      }
    };

    setTile(0, 5, 'entrance', '카페 입구');
    setTile(0, 6, 'entrance', '카페 입구');
    setTile(19, 5, 'exit', '퇴장구');
    setTile(19, 6, 'exit', '퇴장구');

    // Center wide pedestrian walkway
    for (let x = 1; x <= 18; x++) {
      setTile(x, 5, 'path');
      setTile(x, 6, 'path');
    }

    // Top row: Café Tables & Merch
    for (let x = 2; x <= 17; x += 3) {
      setTile(x, 2, 'cafe_table', `T-${x}`);
      setTile(x + 1, 2, 'cafe_table', `T-${x + 1}`);
      setTile(x, 3, 'path');
      setTile(x + 1, 3, 'path');
    }

    // Bottom row: Merch & Photo booths
    for (let x = 2; x <= 16; x += 4) {
      setTile(x, 8, 'booth_merch', `부스-${x}`);
      setTile(x + 1, 8, 'booth_merch', `부스-${x + 1}`);
      setTile(x, 7, 'path');
      setTile(x + 1, 7, 'path');
    }
    setTile(17, 8, 'booth_photo', '인증 포토존');
    setTile(18, 8, 'booth_photo', '인증 포토존');
    setTile(17, 7, 'path');
    setTile(18, 7, 'path');

    return Array.from(map.values());
  },
};

export const CustomGridSandboxStudio: React.FC<CustomGridSandboxStudioProps> = ({
  venueName = '성수 커스텀 스페이스',
  onSaveLayout,
  onShowToast,
}) => {
  // Blueprint Grid Dimensions (Dynamic Columns x Rows)
  const [gridCols, setGridCols] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const c = p.get('cols');
      if (c) return parseInt(c, 10);
    }
    return DEFAULT_GRID_COLS;
  });

  const [gridRows, setGridRows] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const r = p.get('rows');
      if (r) return parseInt(r, 10);
    }
    return DEFAULT_GRID_ROWS;
  });

  // Tile Data State
  const [tiles, setTiles] = useState<SandboxTile[]>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const pr = p.get('sandboxPreset');
      if (pr === 'theatre') return PRESET_TEMPLATES.theatre_thrust();
      if (pr === 'cafe') return PRESET_TEMPLATES.cafe_market();
      if (pr === 'blank') return PRESET_TEMPLATES.blank(DEFAULT_GRID_COLS, DEFAULT_GRID_ROWS);
    }
    return PRESET_TEMPLATES.popup_loop();
  });

  // Modal: Blueprint Dimensions & Block Expansion State
  const [isDimensionModalOpen, setIsDimensionModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('openDimModal') === 'true';
    }
    return false;
  });
  const [dimModalTab, setDimModalTab] = useState<'chunk' | 'dimensions'>('chunk');
  const [chunkWidth, setChunkWidth] = useState<number>(3);
  const [chunkHeight, setChunkHeight] = useState<number>(3);
  const [chunkDirection, setChunkDirection] = useState<'right' | 'bottom' | 'top' | 'left'>('right');
  const [customTargetCols, setCustomTargetCols] = useState<number>(20);
  const [customTargetRows, setCustomTargetRows] = useState<number>(12);

  // Undo History Stack with Dimension Snapshots
  interface HistorySnapshot {
    tiles: SandboxTile[];
    cols: number;
    rows: number;
  }
  const [history, setHistory] = useState<HistorySnapshot[]>([]);

  // Active Tool & Custom Blocks State
  const [activeTool, setActiveTool] = useState<SandboxTileType | 'eraser' | 'inspect' | 'custom'>('path');
  const [activeCustomBlockId, setActiveCustomBlockId] = useState<string | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('select') === 'sofa') return 't_7_7';
      if (p.get('select') === 'store') return 't_12_2';
      if (p.get('select') === 'photo') return 't_3_2';
    }
    return null;
  });

  // Active Category in Top Ribbon Toolbar
  const [activeCategoryTab, setActiveCategoryTab] = useState<'custom' | 'path' | 'seat' | 'booth' | 'tool'>('custom');

  // Ergonomic Zoom / Tile Size (px)
  // Options: 44px (compact), 52px (default comfortable), 66px (large), 82px (extra large)
  const [cellSize, setCellSize] = useState<number>(52);

  // Inspector Panel Collapse / Open State
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // User-created Custom Block Definitions
  const [customBlocks, setCustomBlocks] = useState<CustomBlockDefinition[]>(INITIAL_CUSTOM_BLOCKS);

  // Modal: New Custom Block Creator State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('openCustomModal') === 'true';
    }
    return false;
  });
  const [modalName, setModalName] = useState('');
  const [modalCategory, setModalCategory] = useState<'seat' | 'booth' | 'facility'>('seat');
  const [modalWidth, setModalWidth] = useState<number>(2);
  const [modalHeight, setModalHeight] = useState<number>(1);
  const [modalEmoji, setModalEmoji] = useState('🛋️');
  const [modalColorTheme, setModalColorTheme] = useState('gold');
  const [modalPrice, setModalPrice] = useState<number>(250000);
  const [modalCapacity, setModalCapacity] = useState<number>(2);
  const [modalSeatGrade, setModalSeatGrade] = useState('VVIP');
  const [modalDesc, setModalDesc] = useState('');

  // Mouse Drag Drawing State
  const [isMouseDown, setIsMouseDown] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('sim') === 'true';
    }
    return false;
  });
  const [simVisitorPos, setSimVisitorPos] = useState<{ x: number; y: number } | null>(null);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [simPath, setSimPath] = useState<{ x: number; y: number }[]>([]);
  const [copiedJson, setCopiedJson] = useState(false);

  // Push state to Undo History before a modification
  const pushHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-20),
      {
        tiles: tiles.map((t) => ({ ...t })),
        cols: gridCols,
        rows: gridRows,
      },
    ]);
  };

  const handleUndo = () => {
    if (history.length === 0) {
      if (onShowToast) onShowToast('더 이상 되돌릴 작업이 없습니다.');
      return;
    }
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setTiles(previous.tiles);
    setGridCols(previous.cols);
    setGridRows(previous.rows);
    if (onShowToast) onShowToast(`↩️ 이전 도안 상태(${previous.cols}×${previous.rows})로 되돌렸습니다.`);
  };

  // 화면 너비에 맞춰 타일 크기 자동 조절
  const fitToWidth = () => {
    const el = gridContainerRef.current;
    if (!el) return;
    const avail = el.clientWidth - 48 - 40;
    const size = Math.floor(avail / gridCols) - 2;
    setCellSize(Math.max(28, Math.min(64, size)));
  };

  useEffect(() => {
    fitToWidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Directional Blueprint Block Expansion Methods
  const expandColsRight = (count: number = 1) => {
    if (gridCols + count > 50) {
      if (onShowToast) onShowToast('⚠️ 도안 가로 최대 크기는 50칸입니다.');
      return;
    }
    pushHistory();
    const newCols = gridCols + count;
    const newTiles: SandboxTile[] = [];
    for (let y = 0; y < gridRows; y++) {
      for (let x = gridCols; x < newCols; x++) {
        newTiles.push({
          id: `t_${x}_${y}`,
          x,
          y,
          type: 'empty',
          width: 1,
          height: 1,
          isOrigin: true,
        });
      }
    }
    setTiles((prev) => [...prev, ...newTiles]);
    setGridCols(newCols);
    if (onShowToast) onShowToast(`📐 우측으로 ${count}열 도안 블록이 추가되었습니다. (현재 ${newCols}×${gridRows})`);
  };

  const expandRowsBottom = (count: number = 1) => {
    if (gridRows + count > 35) {
      if (onShowToast) onShowToast('⚠️ 도안 세로 최대 크기는 35칸입니다.');
      return;
    }
    pushHistory();
    const newRows = gridRows + count;
    const newTiles: SandboxTile[] = [];
    for (let y = gridRows; y < newRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        newTiles.push({
          id: `t_${x}_${y}`,
          x,
          y,
          type: 'empty',
          width: 1,
          height: 1,
          isOrigin: true,
        });
      }
    }
    setTiles((prev) => [...prev, ...newTiles]);
    setGridRows(newRows);
    if (onShowToast) onShowToast(`📐 하단으로 ${count}행 도안 블록이 추가되었습니다. (현재 ${gridCols}×${newRows})`);
  };

  const expandColsLeft = (count: number = 1) => {
    if (gridCols + count > 50) {
      if (onShowToast) onShowToast('⚠️ 도안 가로 최대 크기는 50칸입니다.');
      return;
    }
    pushHistory();
    const newCols = gridCols + count;
    setTiles((prev) => {
      const shifted = prev.map((t) => {
        const newX = t.x + count;
        let newParentId = t.parentOriginId;
        if (t.parentOriginId) {
          const match = t.parentOriginId.match(/^t_(\d+)_(\d+)$/);
          if (match) {
            const ox = parseInt(match[1], 10);
            const oy = parseInt(match[2], 10);
            newParentId = `t_${ox + count}_${oy}`;
          }
        }
        return {
          ...t,
          x: newX,
          id: `t_${newX}_${t.y}`,
          parentOriginId: newParentId,
        };
      });
      const leftPadding: SandboxTile[] = [];
      for (let y = 0; y < gridRows; y++) {
        for (let x = 0; x < count; x++) {
          leftPadding.push({
            id: `t_${x}_${y}`,
            x,
            y,
            type: 'empty',
            width: 1,
            height: 1,
            isOrigin: true,
          });
        }
      }
      return [...leftPadding, ...shifted];
    });
    setGridCols(newCols);
    if (onShowToast) onShowToast(`📐 좌측으로 ${count}열 도안 블록이 추가되었습니다. (현재 ${newCols}×${gridRows})`);
  };

  const expandRowsTop = (count: number = 1) => {
    if (gridRows + count > 35) {
      if (onShowToast) onShowToast('⚠️ 도안 세로 최대 크기는 35칸입니다.');
      return;
    }
    pushHistory();
    const newRows = gridRows + count;
    setTiles((prev) => {
      const shifted = prev.map((t) => {
        const newY = t.y + count;
        let newParentId = t.parentOriginId;
        if (t.parentOriginId) {
          const match = t.parentOriginId.match(/^t_(\d+)_(\d+)$/);
          if (match) {
            const ox = parseInt(match[1], 10);
            const oy = parseInt(match[2], 10);
            newParentId = `t_${ox}_${oy + count}`;
          }
        }
        return {
          ...t,
          y: newY,
          id: `t_${t.x}_${newY}`,
          parentOriginId: newParentId,
        };
      });
      const topPadding: SandboxTile[] = [];
      for (let y = 0; y < count; y++) {
        for (let x = 0; x < gridCols; x++) {
          topPadding.push({
            id: `t_${x}_${y}`,
            x,
            y,
            type: 'empty',
            width: 1,
            height: 1,
            isOrigin: true,
          });
        }
      }
      return [...topPadding, ...shifted];
    });
    setGridRows(newRows);
    if (onShowToast) onShowToast(`📐 상단으로 ${count}행 도안 블록이 추가되었습니다. (현재 ${gridCols}×${newRows})`);
  };

  const handleSetGridDimensions = (targetCols: number, targetRows: number) => {
    const clampedCols = Math.max(8, Math.min(50, targetCols));
    const clampedRows = Math.max(6, Math.min(35, targetRows));

    if (clampedCols === gridCols && clampedRows === gridRows) {
      setIsDimensionModalOpen(false);
      return;
    }

    pushHistory();

    const cutElements = tiles.filter(
      (t) => t.type !== 'empty' && (t.x >= clampedCols || t.y >= clampedRows)
    );
    if (cutElements.length > 0) {
      if (onShowToast) onShowToast(`⚠️ 도안 축소로 인해 ${cutElements.length}개의 블록이 잘립니다. (실행 취소 가능)`);
    }

    setTiles((prev) => {
      const preserved = prev.filter((t) => t.x < clampedCols && t.y < clampedRows);
      const preservedKeys = new Set(preserved.map((t) => `${t.x},${t.y}`));

      const added: SandboxTile[] = [];
      for (let y = 0; y < clampedRows; y++) {
        for (let x = 0; x < clampedCols; x++) {
          if (!preservedKeys.has(`${x},${y}`)) {
            added.push({
              id: `t_${x}_${y}`,
              x,
              y,
              type: 'empty',
              width: 1,
              height: 1,
              isOrigin: true,
            });
          }
        }
      }
      return [...preserved, ...added];
    });

    setGridCols(clampedCols);
    setGridRows(clampedRows);
    setIsDimensionModalOpen(false);
    if (onShowToast) onShowToast(`📐 도안 규격이 ${clampedCols}×${clampedRows} 칸으로 변경되었습니다.`);
  };

  const handleAddBlockChunk = (chunkW: number, chunkH: number, direction: 'right' | 'bottom' | 'top' | 'left') => {
    if (direction === 'right') {
      expandColsRight(chunkW);
    } else if (direction === 'bottom') {
      expandRowsBottom(chunkH);
    } else if (direction === 'top') {
      expandRowsTop(chunkH);
    } else if (direction === 'left') {
      expandColsLeft(chunkW);
    }
    setIsDimensionModalOpen(false);
  };

  // Find Tile by coords
  const tileMap = useMemo(() => {
    const map = new Map<string, SandboxTile>();
    tiles.forEach((t) => map.set(`${t.x},${t.y}`, t));
    return map;
  }, [tiles]);

  // Find selected tile (or its root origin if a covered child was selected)
  const selectedTile = useMemo(() => {
    if (!selectedTileId) return null;
    const direct = tiles.find((t) => t.id === selectedTileId);
    if (!direct) return null;
    if (direct.parentOriginId) {
      return tiles.find((t) => t.id === direct.parentOriginId) || direct;
    }
    return direct;
  }, [tiles, selectedTileId]);

  // Statistics calculation (including custom seats & multi-tile blocks)
  const stats = useMemo(() => {
    let vipSeats = 0;
    let rSeats = 0;
    let sSeats = 0;
    let stdSeats = 0;
    let wheelSeats = 0;
    let customSeats = 0;
    let pathCount = 0;
    let boothCount = 0;
    let totalRevenue = 0;
    let entrances = 0;
    let exits = 0;

    tiles.forEach((t) => {
      if (t.isOrigin === false) return;

      if (t.isCustom && t.isSeat) {
        const count = t.capacity || 1;
        customSeats += count;
        totalRevenue += (t.price || 0) * count;
      } else if (t.type === 'seat_vip') {
        vipSeats += t.capacity || 1;
        totalRevenue += (t.price || 170000) * (t.capacity || 1);
      } else if (t.type === 'seat_r') {
        rSeats += t.capacity || 1;
        totalRevenue += (t.price || 140000) * (t.capacity || 1);
      } else if (t.type === 'seat_s') {
        sSeats += t.capacity || 1;
        totalRevenue += (t.price || 100000) * (t.capacity || 1);
      } else if (t.type === 'seat_std') {
        stdSeats += t.capacity || 1;
        totalRevenue += (t.price || 70000) * (t.capacity || 1);
      } else if (t.type === 'seat_wheelchair') {
        wheelSeats += t.capacity || 1;
        totalRevenue += (t.price || 50000) * (t.capacity || 1);
      } else if (
        t.type === 'path' ||
        t.type === 'path_arrow_r' ||
        t.type === 'path_arrow_d' ||
        t.type === 'path_arrow_l' ||
        t.type === 'path_arrow_u' ||
        t.type === 'queue'
      ) {
        pathCount++;
      } else if (
        t.type === 'booth_merch' ||
        t.type === 'booth_photo' ||
        t.type === 'booth_kiosk' ||
        t.type === 'cafe_table' ||
        t.type === 'booth_gacha' ||
        (t.isCustom && !t.isSeat)
      ) {
        boothCount++;
      } else if (t.type === 'entrance') {
        entrances++;
      } else if (t.type === 'exit') {
        exits++;
      }
    });

    const totalSeats = vipSeats + rSeats + sSeats + stdSeats + wheelSeats + customSeats;
    const pathRatio = Math.round((pathCount / (gridCols * gridRows)) * 100);

    return {
      vipSeats,
      rSeats,
      sSeats,
      stdSeats,
      wheelSeats,
      customSeats,
      totalSeats,
      totalRevenue,
      pathCount,
      pathRatio,
      boothCount,
      entrances,
      exits,
    };
  }, [tiles]);

  // Apply brush tool to a tile
  const paintTile = (x: number, y: number) => {
    if (activeTool === 'inspect') {
      const target = tileMap.get(`${x},${y}`);
      if (target) {
        setSelectedTileId(target.parentOriginId || target.id);
        setIsInspectorOpen(true);
      }
      return;
    }

    pushHistory();

    // Placing a Multi-tile Custom Block
    if (activeTool === 'custom' && activeCustomBlockId) {
      const def = customBlocks.find((b) => b.id === activeCustomBlockId);
      if (!def) return;

      const w = def.width || 1;
      const h = def.height || 1;

      // Check bounds
      if (x + w > gridCols || y + h > gridRows) {
        if (onShowToast) onShowToast(`⚠️ 블록 크기(${w}×${h})가 캔버스 범위를 벗어납니다.`);
        return;
      }

      setTiles((prev) => {
        const next = [...prev];
        const rootId = `t_${x}_${y}`;

        for (let dy = 0; dy < h; dy++) {
          for (let dx = 0; dx < w; dx++) {
            const cx = x + dx;
            const cy = y + dy;
            const idx = next.findIndex((t) => t.x === cx && t.y === cy);
            if (idx === -1) continue;

            const isRoot = dx === 0 && dy === 0;

            if (isRoot) {
              next[idx] = {
                ...next[idx],
                type: def.isSeat ? 'seat_vip' : 'booth_merch',
                isCustom: true,
                customDefId: def.id,
                label: def.name,
                width: w,
                height: h,
                isOrigin: true,
                parentOriginId: undefined,
                emoji: def.emoji,
                customBg: def.bgColor,
                customBorder: def.borderColor,
                customColor: def.textColor,
                isSeat: def.isSeat,
                seatGrade: def.seatGrade,
                price: def.price,
                capacity: def.capacity,
                note: def.description,
              };
            } else {
              next[idx] = {
                ...next[idx],
                type: def.isSeat ? 'seat_vip' : 'booth_merch',
                isCustom: true,
                customDefId: def.id,
                isOrigin: false,
                parentOriginId: rootId,
                width: 1,
                height: 1,
              };
            }
          }
        }
        return next;
      });

      setSelectedTileId(`t_${x}_${y}`);
      setIsInspectorOpen(true);
      if (onShowToast) onShowToast(`✨ [${def.name}] (${w}×${h}) 블록이 배치되었습니다.`);
      return;
    }

    // Placing Standard 1x1 Tiles or Eraser
    setTiles((prev) => {
      const next = [...prev];
      const idx = next.findIndex((t) => t.x === x && t.y === y);
      if (idx === -1) return prev;

      const current = next[idx];

      // If erasing a multi-tile block, erase all its children
      if (activeTool === 'eraser') {
        const originId = current.parentOriginId || (current.isOrigin ? current.id : null);
        if (originId) {
          return next.map((t) => {
            if (t.id === originId || t.parentOriginId === originId) {
              return {
                id: t.id,
                x: t.x,
                y: t.y,
                type: 'empty',
                width: 1,
                height: 1,
                isOrigin: true,
                isCustom: false,
                label: '',
                price: undefined,
                capacity: undefined,
              };
            }
            return t;
          });
        }

        next[idx] = {
          id: current.id,
          x: current.x,
          y: current.y,
          type: 'empty',
          width: 1,
          height: 1,
          isOrigin: true,
          isCustom: false,
          label: '',
        };
        return next;
      }

      // Standard brush
      const newType = activeTool as SandboxTileType;
      if (current.type === newType && !current.isCustom) return prev;

      const toolMeta = TOOLS_CONFIG.find((t) => t.type === newType);
      next[idx] = {
        ...current,
        type: newType,
        isCustom: false,
        isOrigin: true,
        width: 1,
        height: 1,
        parentOriginId: undefined,
        label: toolMeta?.label || '',
        price: toolMeta?.defaultPrice,
        capacity: toolMeta?.defaultCapacity,
      };
      return next;
    });
  };

  // Mouse handlers for dragging/painting
  const handleMouseDown = (x: number, y: number) => {
    setIsMouseDown(true);
    paintTile(x, y);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isMouseDown && activeTool !== 'custom') {
      paintTile(x, y);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('focus') === 'canvas') {
        setTimeout(() => {
          const el = document.getElementById('sandbox-canvas-viewport');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }, 300);
      }
    }
  }, []);

  // Update selected tile metadata from inspector
  const handleUpdateSelectedTile = (updates: Partial<SandboxTile>) => {
    if (!selectedTileId) return;
    setTiles((prev) =>
      prev.map((t) => (t.id === selectedTileId ? { ...t, ...updates } : t))
    );
  };

  // Resize a block directly from the inspector
  const handleResizeSelectedTile = (newW: number, newH: number) => {
    if (!selectedTile) return;
    const x = selectedTile.x;
    const y = selectedTile.y;

    if (x + newW > gridCols || y + newH > gridRows) {
      if (onShowToast) onShowToast(`⚠️ 변경할 크기(${newW}×${newH})가 캔버스 범위를 벗어납니다.`);
      return;
    }

    pushHistory();

    setTiles((prev) => {
      const oldRootId = selectedTile.id;
      let next = prev.map((t) => {
        if (t.parentOriginId === oldRootId) {
          return {
            id: t.id,
            x: t.x,
            y: t.y,
            type: 'empty' as SandboxTileType,
            width: 1,
            height: 1,
            isOrigin: true,
            isCustom: false,
            label: '',
          };
        }
        return t;
      });

      for (let dy = 0; dy < newH; dy++) {
        for (let dx = 0; dx < newW; dx++) {
          const cx = x + dx;
          const cy = y + dy;
          const idx = next.findIndex((t) => t.x === cx && t.y === cy);
          if (idx === -1) continue;

          if (dx === 0 && dy === 0) {
            next[idx] = {
              ...selectedTile,
              width: newW,
              height: newH,
              isOrigin: true,
              parentOriginId: undefined,
            };
          } else {
            next[idx] = {
              ...next[idx],
              type: selectedTile.type,
              isCustom: selectedTile.isCustom,
              customDefId: selectedTile.customDefId,
              isOrigin: false,
              parentOriginId: oldRootId,
              width: 1,
              height: 1,
            };
          }
        }
      }
      return next;
    });

    if (onShowToast) onShowToast(`📐 블록 크기가 ${newW}×${newH}칸으로 변경되었습니다.`);
  };

  // =========================================================================
  // BFS PATHFINDING FOR VISITOR SIMULATION
  // =========================================================================
  const findPathFromEntranceToExit = (): { x: number; y: number }[] => {
    const startTile = tiles.find((t) => t.type === 'entrance');
    const endTile = tiles.find((t) => t.type === 'exit');

    if (!startTile || !endTile) return [];

    const isWalkable = (t: SandboxTile) => {
      if (t.type === 'wall' || (t.isCustom && !t.isSeat)) return false;
      return [
        'path',
        'path_arrow_r',
        'path_arrow_d',
        'path_arrow_l',
        'path_arrow_u',
        'queue',
        'entrance',
        'exit',
      ].includes(t.type);
    };

    const queue: { x: number; y: number; path: { x: number; y: number }[] }[] = [
      { x: startTile.x, y: startTile.y, path: [{ x: startTile.x, y: startTile.y }] },
    ];
    const visited = new Set<string>();
    visited.add(`${startTile.x},${startTile.y}`);

    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.x === endTile.x && current.y === endTile.y) {
        return current.path;
      }

      for (const dir of directions) {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        const key = `${nx},${ny}`;

        if (nx >= 0 && nx < gridCols && ny >= 0 && ny < gridRows && !visited.has(key)) {
          const neighbor = tileMap.get(key);
          if (neighbor && isWalkable(neighbor)) {
            visited.add(key);
            queue.push({
              x: nx,
              y: ny,
              path: [...current.path, { x: nx, y: ny }],
            });
          }
        }
      }
    }

    return [];
  };

  // Path validity status
  const pathValidation = useMemo(() => {
    if (stats.entrances === 0) return { valid: false, message: '입구(IN) 게이트가 없습니다.' };
    if (stats.exits === 0) return { valid: false, message: '출구(OUT) 게이트가 없습니다.' };
    const p = findPathFromEntranceToExit();
    if (p.length === 0) {
      return {
        valid: false,
        message: '⚠️ 동선 단절! 입구에서 출구로 연결되는 보행로(길)가 막혀 있습니다.',
      };
    }
    return {
      valid: true,
      length: p.length,
      message: `✅ 완벽한 관람 동선 연결됨 (총 길이: ${p.length} 타일 / 예상 보행 2.5분)`,
    };
  }, [tiles, stats]);

  // Visitor Walk Simulation Loop
  useEffect(() => {
    if (!isSimulating) {
      setSimVisitorPos(null);
      setSimStepIndex(0);
      return;
    }

    const calculatedPath = findPathFromEntranceToExit();
    if (calculatedPath.length === 0) {
      setIsSimulating(false);
      if (onShowToast) onShowToast('⚠️ 입구와 출구 사이의 길이 연결되어 있지 않아 시뮬레이션을 시작할 수 없습니다.');
      return;
    }

    setSimPath(calculatedPath);
    let step = 0;

    const interval = setInterval(() => {
      if (step < calculatedPath.length) {
        setSimVisitorPos(calculatedPath[step]);
        setSimStepIndex(step);
        step++;
      } else {
        step = 0;
        setSimVisitorPos(calculatedPath[0]);
        setSimStepIndex(0);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Load Preset
  const handleLoadPreset = (key: 'blank' | 'popup_loop' | 'theatre_thrust' | 'cafe_market') => {
    pushHistory();
    setIsSimulating(false);
    setSelectedTileId(null);
    let newCols = 20;
    let newRows = 12;
    if (key === 'blank') {
      newCols = gridCols;
      newRows = gridRows;
    }
    const newTiles = key === 'blank' ? PRESET_TEMPLATES.blank(newCols, newRows) : PRESET_TEMPLATES[key]();
    setGridCols(newCols);
    setGridRows(newRows);
    setTiles(newTiles);
    if (onShowToast) {
      const names = {
        blank: '백지 캔버스 (전체 리셋)',
        popup_loop: '성수 팝업스토어 미로 루프',
        theatre_thrust: '소극장 돌출 T자 하이브리드',
        cafe_market: '콜라보 카페 & 스트리트 마켓',
      };
      onShowToast(`🎨 [${names[key]}] 템플릿이 로드되었습니다.`);
    }
  };

  // Copy JSON
  const handleCopyJson = () => {
    const exportData = {
      venue: venueName,
      cols: gridCols,
      rows: gridRows,
      customBlocks,
      stats,
      tiles: tiles.filter((t) => t.type !== 'empty'),
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
    if (onShowToast) onShowToast('📋 공간 배치 데이터가 JSON으로 클립보드에 복사되었습니다.');
  };

  // Color theme definitions for Custom Block modal
  const COLOR_THEMES = [
    { id: 'gold', name: '골드 앰버', bg: 'bg-amber-400', border: 'border-amber-600', text: 'text-amber-950' },
    { id: 'purple', name: '로열 퍼플', bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-white' },
    { id: 'emerald', name: '에메랄드', bg: 'bg-emerald-400', border: 'border-emerald-700', text: 'text-emerald-950' },
    { id: 'rose', name: '로즈 핑크', bg: 'bg-rose-400', border: 'border-rose-600', text: 'text-white' },
    { id: 'blue', name: '딥 블루', bg: 'bg-blue-500', border: 'border-blue-700', text: 'text-white' },
    { id: 'dark', name: '모던 다크', bg: 'bg-stone-900', border: 'border-amber-400', text: 'text-amber-300' },
  ];

  // Create new Custom Block handler
  const handleCreateCustomBlock = () => {
    if (!modalName.trim()) {
      if (onShowToast) onShowToast('⚠️ 커스텀 블록 이름을 입력해주세요.');
      return;
    }

    const theme = COLOR_THEMES.find((c) => c.id === modalColorTheme) || COLOR_THEMES[0];
    const isSeat = modalCategory === 'seat';

    const newDef: CustomBlockDefinition = {
      id: `cb-${Date.now()}`,
      name: modalName.trim(),
      category: modalCategory,
      width: modalWidth,
      height: modalHeight,
      emoji: modalEmoji,
      bgColor: theme.bg,
      borderColor: theme.border,
      textColor: theme.text,
      price: isSeat ? modalPrice : undefined,
      capacity: modalCapacity,
      isSeat,
      seatGrade: isSeat ? modalSeatGrade : undefined,
      description: modalDesc.trim() || undefined,
    };

    setCustomBlocks((prev) => [newDef, ...prev]);
    setActiveCategoryTab('custom');
    setActiveTool('custom');
    setActiveCustomBlockId(newDef.id);
    setIsCustomModalOpen(false);

    setModalName('');
    setModalDesc('');

    if (onShowToast) {
      onShowToast(`🎉 새로운 커스텀 블록 [${newDef.name}] (${newDef.width}×${newDef.height})이 생성되었습니다! 캔버스에 찍어보세요.`);
    }
  };

  // Render tile visuals
  const renderTileVisual = (tile: SandboxTile) => {
    if (tile.isOrigin === false) {
      return null;
    }

    const isSelected = selectedTileId === tile.id || (selectedTile && selectedTile.id === tile.id);
    const isVisitorHere = simVisitorPos?.x === tile.x && simVisitorPos?.y === tile.y;

    const w = tile.width || 1;
    const h = tile.height || 1;

    let baseBg = 'bg-stone-50 border-stone-200';
    let content: React.ReactNode = null;

    // CUSTOM BLOCK RENDERING (Multi-tile & Custom Styled)
    if (tile.isCustom) {
      baseBg = `${tile.customBg || 'bg-amber-400'} ${tile.customBorder || 'border-amber-600'} ${tile.customColor || 'text-stone-950'} border-2 shadow-sm`;

      content = (
        <div className="flex flex-col items-center justify-center text-center p-1.5 leading-tight h-full w-full">
          <div className="flex items-center gap-1.5">
            <span className={cellSize >= 56 ? "text-2xl" : "text-lg"}>{tile.emoji || '🪑'}</span>
            {cellSize * w >= 100 && (
              <span className="text-xs font-black line-clamp-1">{tile.label}</span>
            )}
          </div>

          {cellSize * h >= 64 && cellSize * w >= 100 && <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black/25 rounded-md font-mono text-white">
              {w}×{h}
            </span>
            {tile.isSeat ? (
              <span className="text-[11px] font-black font-mono px-1.5 py-0.5 bg-white/30 rounded-md">
                ₩{((tile.price || 0)).toLocaleString()}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/30 rounded-md">{tile.capacity || 1}명 정원</span>
            )}
          </div>}
        </div>
      );
    } else {
      // STANDARD TILE RENDERING
      switch (tile.type) {
        case 'empty':
          baseBg = 'bg-stone-50/70 border-dashed border-stone-300 hover:bg-stone-100/90';
          break;

        case 'entrance':
          baseBg = 'bg-emerald-500 text-white border-emerald-700 shadow-md animate-pulse';
          content = (
            <div className="flex flex-col items-center justify-center text-xs font-black leading-none">
              <DoorOpen className="w-5 h-5 mb-0.5" />
              <span>IN (입구)</span>
            </div>
          );
          break;

        case 'exit':
          baseBg = 'bg-red-500 text-white border-red-700 shadow-md';
          content = (
            <div className="flex flex-col items-center justify-center text-xs font-black leading-none">
              <LogOut className="w-5 h-5 mb-0.5" />
              <span>OUT (출구)</span>
            </div>
          );
          break;

        case 'path':
          baseBg = 'bg-stone-200 border-stone-300 text-stone-600 hover:bg-stone-300';
          content = <Footprints className="w-4 h-4 opacity-70" />;
          break;

        case 'path_arrow_r':
          baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
          content = <ArrowRight className="w-5 h-5" />;
          break;

        case 'path_arrow_d':
          baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
          content = <ArrowDown className="w-5 h-5" />;
          break;

        case 'path_arrow_l':
          baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
          content = <ArrowLeft className="w-5 h-5" />;
          break;

        case 'path_arrow_u':
          baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
          content = <ArrowUp className="w-5 h-5" />;
          break;

        case 'queue':
          baseBg = 'bg-orange-300 border-orange-500 text-orange-950 font-mono font-bold';
          content = <div className="text-[10px] font-black tracking-tight">대기선</div>;
          break;

        case 'wall':
          baseBg = 'bg-stone-900 border-black text-stone-500 shadow-inner';
          content = <div className="w-full h-full bg-stone-900" />;
          break;

        case 'seat_vip':
          baseBg = 'bg-amber-400 border-amber-600 text-amber-950 shadow-sm';
          content = <span className="text-xs font-black">VIP</span>;
          break;

        case 'seat_r':
          baseBg = 'bg-purple-300 border-purple-500 text-purple-950';
          content = <span className="text-xs font-black">R</span>;
          break;

        case 'seat_s':
          baseBg = 'bg-emerald-300 border-emerald-500 text-emerald-950';
          content = <span className="text-xs font-black">S</span>;
          break;

        case 'seat_std':
          baseBg = 'bg-blue-200 border-blue-400 text-blue-950';
          content = <span className="text-[11px] font-bold">일반</span>;
          break;

        case 'seat_wheelchair':
          baseBg = 'bg-cyan-200 border-cyan-500 text-cyan-950';
          content = <span className="text-base">♿</span>;
          break;

        case 'booth_merch':
          baseBg = 'bg-rose-400 border-rose-600 text-white shadow-sm';
          content = (
            <div className="flex flex-col items-center justify-center leading-none">
              <Store className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-black">MD</span>
            </div>
          );
          break;

        case 'booth_photo':
          baseBg = 'bg-yellow-400 border-yellow-600 text-stone-950 shadow-sm';
          content = (
            <div className="flex flex-col items-center justify-center leading-none">
              <Camera className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-black">포토존</span>
            </div>
          );
          break;

        case 'booth_kiosk':
          baseBg = 'bg-indigo-300 border-indigo-600 text-indigo-950';
          content = <span className="text-[11px] font-black">발권기</span>;
          break;

        case 'cafe_table':
          baseBg = 'bg-amber-300 border-amber-600 text-amber-950 rounded-full scale-90';
          content = <Coffee className="w-4 h-4" />;
          break;

        case 'stage':
          baseBg = 'bg-purple-950 border-amber-400 text-amber-300 shadow-md';
          content = <Mic2 className="w-4 h-4 text-amber-400" />;
          break;

        case 'booth_gacha':
          baseBg = 'bg-pink-300 border-pink-500 text-pink-950';
          content = <Gift className="w-4 h-4" />;
          break;

        case 'restroom':
          baseBg = 'bg-slate-300 border-slate-500 text-slate-800';
          content = <span className="text-[11px] font-bold">WC</span>;
          break;
      }
    }

    return (
      <div
        key={tile.id}
        onMouseDown={() => handleMouseDown(tile.x, tile.y)}
        onMouseEnter={() => handleMouseEnter(tile.x, tile.y)}
        style={{
          gridColumnStart: tile.x + 1,
          gridColumnEnd: tile.x + 1 + w,
          gridRowStart: tile.y + 1,
          gridRowEnd: tile.y + 1 + h,
        }}
        className={`border transition-all flex items-center justify-center select-none cursor-pointer relative rounded-lg overflow-hidden ${baseBg} ${
          isSelected ? 'ring-4 ring-amber-500 z-10 scale-[1.02] shadow-xl' : 'hover:scale-[1.01]'
        }`}
        title={`[${tile.x}, ${tile.y}] ${tile.label || tile.type} (${w}×${h})`}
      >
        {content}

        {/* Animated Visitor Avatar during Simulation */}
        {isVisitorHere && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 border-2 border-stone-900 shadow-xl flex items-center justify-center text-sm font-black animate-bounce">
              🚶
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      {/* ===== TOOLBAR (한 줄) ===== */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-stone-200 bg-stone-50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="실행 취소"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-stone-300" />

          <select
            value=""
            onChange={(e) => {
              if (e.target.value) handleLoadPreset(e.target.value as any);
            }}
            className="h-8 px-2 text-xs font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 cursor-pointer"
          >
            <option value="">템플릿 불러오기</option>
            <option value="popup_loop">팝업 미로</option>
            <option value="theatre_thrust">소극장 T자</option>
            <option value="cafe_market">카페 &amp; 마켓</option>
            <option value="blank">빈 도안</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setCustomTargetCols(gridCols);
              setCustomTargetRows(gridRows);
              setIsDimensionModalOpen(true);
            }}
            className="h-8 flex items-center gap-1.5 px-2.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
            title="도안 크기 조절"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="font-mono">{gridCols} × {gridRows}</span>
          </button>

          <div className="h-8 flex items-center bg-white border border-stone-300 rounded-lg">
            <button
              type="button"
              onClick={() => setCellSize((p) => Math.max(32, p - 8))}
              className="px-2 h-full text-stone-600 hover:bg-stone-100 rounded-l-lg cursor-pointer"
              title="축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono text-stone-500 w-10 text-center">
              {Math.round((cellSize / 52) * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setCellSize((p) => Math.min(96, p + 8))}
              className="px-2 h-full text-stone-600 hover:bg-stone-100 rounded-r-lg cursor-pointer"
              title="확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={fitToWidth}
            className="h-8 px-2.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
            title="화면에 맞추기"
          >
            맞춤
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`h-8 flex items-center gap-1.5 px-3 text-xs font-semibold rounded-lg border cursor-pointer ${
              isSimulating
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? '중지' : '동선 테스트'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyJson}
            className="h-8 px-2.5 flex items-center text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 cursor-pointer"
            title="JSON 복사"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSaveLayout) onSaveLayout({ tiles, stats });
              if (onShowToast) onShowToast('💾 배치도가 저장되었습니다.');
            }}
            className="h-8 flex items-center gap-1.5 px-3.5 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>저장</span>
          </button>
        </div>
      </div>

      {/* ===== BODY: 팔레트 | 캔버스 | 속성 ===== */}
      <div className="flex">
        {/* --- 팔레트 --- */}
        <aside className="w-52 shrink-0 border-r border-stone-200 bg-white max-h-[720px] overflow-y-auto p-3 space-y-4">
          {/* 편집 도구 */}
          <div className="grid grid-cols-2 gap-1.5">
            {TOOLS_CONFIG.filter((t) => t.category === 'tool').map((t) => {
              const Icon = t.icon;
              const active = activeTool === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setActiveTool(t.type as any)}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                  title={t.description}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.type === 'inspect' ? '선택' : '지우개'}</span>
                </button>
              );
            })}
          </div>

          {(
            [
              { key: 'path', title: '길 · 출입구' },
              { key: 'seat', title: '좌석' },
              { key: 'booth', title: '부스 · 시설' },
            ] as const
          ).map((group) => (
            <div key={group.key}>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 px-1">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {TOOLS_CONFIG.filter((t) => t.category === group.key).map((t) => {
                  const Icon = t.icon;
                  const active = activeTool === t.type;
                  return (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setActiveTool(t.type as any)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left cursor-pointer ${
                        active ? 'bg-amber-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                      title={t.description}
                    >
                      <span
                        className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border ${t.bgColor} ${t.borderColor} ${t.color}`}
                      >
                        <Icon className="w-3 h-3" />
                      </span>
                      <span className="truncate">{t.label.replace(/^[^\p{L}\p{N}]+/u, '')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 내 블록 */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">내 블록</span>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="p-0.5 rounded text-stone-500 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
                title="새 블록 만들기"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5">
              {customBlocks.map((block) => {
                const active = activeTool === 'custom' && activeCustomBlockId === block.id;
                return (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => {
                      setActiveTool('custom');
                      setActiveCustomBlockId(block.id);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left cursor-pointer ${
                      active ? 'bg-amber-100 text-stone-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="w-5 text-center text-sm">{block.emoji}</span>
                    <span className="truncate flex-1">{block.name}</span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {block.width}×{block.height}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="w-full mt-1 py-1.5 rounded-lg border border-dashed border-stone-300 text-[11px] text-stone-500 hover:border-stone-500 hover:text-stone-800 cursor-pointer"
              >
                + 새 블록
              </button>
            </div>
          </div>
        </aside>

        {/* --- 캔버스 --- */}
        <main id="sandbox-canvas-viewport" className="flex-1 min-w-0 flex flex-col bg-stone-100">
          <div ref={gridContainerRef} className="flex-1 overflow-auto max-h-[680px] p-6 select-none">
            <div className="flex w-max mx-auto">
              <div>
                <div
                  className="grid gap-[2px] bg-stone-300 p-[2px] rounded-lg"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${gridRows}, ${cellSize}px)`,
                  }}
                >
                  {tiles.map((t) => renderTileVisual(t))}
                </div>
                {/* 아래로 한 줄 추가 */}
                <button
                  type="button"
                  onClick={() => expandRowsBottom(1)}
                  className="mt-1.5 w-full h-6 rounded-md border border-dashed border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-700 hover:bg-white flex items-center justify-center cursor-pointer"
                  title="아래로 한 줄 추가"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* 오른쪽으로 한 칸 추가 */}
              <button
                type="button"
                onClick={() => expandColsRight(1)}
                className="ml-1.5 w-6 rounded-md border border-dashed border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-700 hover:bg-white flex items-center justify-center cursor-pointer"
                style={{ height: gridRows * (cellSize + 2) + 2 }}
                title="오른쪽으로 한 칸 추가"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 상태 바 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 border-t border-stone-200 bg-white text-[11px] text-stone-500">
            <span>
              좌석 <b className="text-stone-800">{stats.totalSeats}</b>
            </span>
            <span>
              예상 매출 <b className="text-stone-800">₩{stats.totalRevenue.toLocaleString()}</b>
            </span>
            <span>
              부스 <b className="text-stone-800">{stats.boothCount}</b>
            </span>
            <span>
              입구 {stats.entrances} · 출구 {stats.exits}
            </span>
            <span
              className={`ml-auto flex items-center gap-1 font-semibold ${
                pathValidation.valid ? 'text-emerald-600' : 'text-rose-500'
              }`}
              title={pathValidation.message}
            >
              {pathValidation.valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {pathValidation.valid ? '동선 정상' : pathValidation.message}
            </span>
          </div>
        </main>

        {/* --- 속성 패널 (블록 선택 시에만) --- */}
        {selectedTile && isInspectorOpen && (
          <aside className="w-72 shrink-0 border-l border-stone-200 bg-white max-h-[720px] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
              <div className="flex items-center gap-2 min-w-0">
                {selectedTile.emoji && <span className="text-lg">{selectedTile.emoji}</span>}
                <span className="text-sm font-bold text-stone-900 truncate">
                  {selectedTile.label || '블록 속성'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTileId(null)}
                className="p-1 rounded text-stone-400 hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">이름</label>
                <input
                  type="text"
                  value={selectedTile.label || ''}
                  onChange={(e) => handleUpdateSelectedTile({ label: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">크기 (가로 × 세로)</label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTile.width || 1}
                    onChange={(e) => handleResizeSelectedTile(parseInt(e.target.value), selectedTile.height || 1)}
                    className="flex-1 px-2 py-1.5 border border-stone-300 rounded-lg text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n}칸</option>
                    ))}
                  </select>
                  <span className="text-stone-400">×</span>
                  <select
                    value={selectedTile.height || 1}
                    onChange={(e) => handleResizeSelectedTile(selectedTile.width || 1, parseInt(e.target.value))}
                    className="flex-1 px-2 py-1.5 border border-stone-300 rounded-lg text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n}칸</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!selectedTile.isSeat}
                  onChange={(e) => handleUpdateSelectedTile({ isSeat: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-stone-700">유료 좌석으로 판매</span>
              </label>

              {selectedTile.isSeat && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">등급</label>
                    <input
                      type="text"
                      value={selectedTile.seatGrade || ''}
                      onChange={(e) => handleUpdateSelectedTile({ seatGrade: e.target.value })}
                      placeholder="VIP"
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">가격 (₩)</label>
                    <input
                      type="number"
                      value={selectedTile.price || 0}
                      onChange={(e) => handleUpdateSelectedTile({ price: parseInt(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">수용 인원</label>
                <input
                  type="number"
                  value={selectedTile.capacity || 1}
                  onChange={(e) => handleUpdateSelectedTile({ capacity: parseInt(e.target.value) || 1 })}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">메모</label>
                <textarea
                  value={selectedTile.note || ''}
                  onChange={(e) => handleUpdateSelectedTile({ note: e.target.value })}
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  handleResizeSelectedTile(1, 1);
                  handleUpdateSelectedTile({ type: 'empty', label: '', price: undefined, isCustom: false });
                  setSelectedTileId(null);
                }}
                className="w-full py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                블록 삭제
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ===== 도안 크기 모달 ===== */}
      {isDimensionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsDimensionModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">도안 크기</h3>
              <button
                type="button"
                onClick={() => setIsDimensionModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 전체 크기 */}
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { label: '가로', value: customTargetCols, set: setCustomTargetCols, min: 8, max: 50 },
                  { label: '세로', value: customTargetRows, set: setCustomTargetRows, min: 6, max: 35 },
                ] as const
              ).map((f) => (
                <div key={f.label}>
                  <div className="text-[11px] font-semibold text-stone-500 mb-1">{f.label} (칸)</div>
                  <div className="flex items-center border border-stone-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => f.set(Math.max(f.min, f.value - 1))}
                      className="w-9 h-9 text-stone-600 hover:bg-stone-100 rounded-l-lg cursor-pointer"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={f.value}
                      onChange={(e) => f.set(parseInt(e.target.value) || f.min)}
                      className="flex-1 w-full text-center font-mono font-bold text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => f.set(Math.min(f.max, f.value + 1))}
                      className="w-9 h-9 text-stone-600 hover:bg-stone-100 rounded-r-lg cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { name: '소형', cols: 14, rows: 10 },
                { name: '중형', cols: 20, rows: 12 },
                { name: '대형', cols: 26, rows: 16 },
                { name: '특대', cols: 36, rows: 22 },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setCustomTargetCols(p.cols);
                    setCustomTargetRows(p.rows);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] border cursor-pointer ${
                    customTargetCols === p.cols && customTargetRows === p.rows
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {p.name} {p.cols}×{p.rows}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-stone-400">
              약 {Math.round(customTargetCols * 1.5)}m × {Math.round(customTargetRows * 1.5)}m (1칸 = 1.5m)
            </p>

            <button
              type="button"
              onClick={() => handleSetGridDimensions(customTargetCols, customTargetRows)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold rounded-lg cursor-pointer"
            >
              적용
            </button>

            {/* 블록 덧붙이기 */}
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-500">블록 덧붙이기</span>
                <div className="flex gap-1">
                  {[1, 3, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setChunkWidth(n);
                        setChunkHeight(n);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                        chunkWidth === n ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {n}칸
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { dir: 'top', icon: ArrowUp, label: '위' },
                    { dir: 'bottom', icon: ArrowDown, label: '아래' },
                    { dir: 'left', icon: ArrowLeft, label: '왼쪽' },
                    { dir: 'right', icon: ArrowRight, label: '오른쪽' },
                  ] as const
                ).map((d) => {
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.dir}
                      type="button"
                      onClick={() => handleAddBlockChunk(chunkWidth, chunkHeight, d.dir)}
                      className="flex flex-col items-center gap-0.5 py-2 rounded-lg border border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900 cursor-pointer"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL: 새 커스텀 블록 직접 만들기 (이름, 크기, 좌석, 색상 완벽 지원) */}
      {/* ========================================================================= */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-3 border-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-[8px_8px_0px_#1c1917] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-400 border-2 border-stone-900 rounded-xl">
                  <Sparkles className="w-5 h-5 text-stone-950" />
                </div>
                <div>
                  <h3 className="font-black text-stone-950 text-base">
                    나만의 새 커스텀 블록 만들기
                  </h3>
                  <p className="text-xs text-stone-500">
                    블록 이름, 크기(가로×세로), 좌석 여부 및 가격을 마음대로 정합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-4 text-xs">
              
              {/* 1. Block Name */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1">
                  블록 이름 *
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="예: VVIP 2인 소파석, 초대형 네온 포토월, 메인 MD 샵"
                  className="w-full px-3 py-2 bg-stone-50 border-2 border-stone-300 focus:border-stone-900 rounded-xl text-sm font-bold text-stone-950 focus:outline-hidden"
                />
              </div>

              {/* 2. Block Category */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1.5">
                  블록 성격 / 분류
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalCategory('seat');
                      setModalEmoji('🛋️');
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border-2 transition-all cursor-pointer text-center ${
                      modalCategory === 'seat'
                        ? 'bg-amber-400 border-stone-900 text-stone-950 shadow-[2px_2px_0px_#1c1917]'
                        : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    🪑 좌석 블록
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModalCategory('booth');
                      setModalEmoji('🛍️');
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border-2 transition-all cursor-pointer text-center ${
                      modalCategory === 'booth'
                        ? 'bg-rose-400 border-stone-900 text-white shadow-[2px_2px_0px_#1c1917]'
                        : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    🏪 팝업 부스
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModalCategory('facility');
                      setModalEmoji('🎤');
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border-2 transition-all cursor-pointer text-center ${
                      modalCategory === 'facility'
                        ? 'bg-purple-500 border-stone-900 text-white shadow-[2px_2px_0px_#1c1917]'
                        : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    🎤 무대 / 시설
                  </button>
                </div>
              </div>

              {/* 3. Block Size (Width x Height) with Live Preview */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1.5">
                  블록 크기 설정 (W × H 칸 수)
                </label>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-stone-500 w-12">가로 너비:</span>
                      {[1, 2, 3, 4].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setModalWidth(w)}
                          className={`flex-1 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                            modalWidth === w
                              ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-xs'
                              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {w}칸
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-stone-500 w-12">세로 높이:</span>
                      {[1, 2, 3, 4].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setModalHeight(h)}
                          className={`flex-1 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                            modalHeight === h
                              ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-xs'
                              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {h}칸
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Size Preview Box */}
                  <div className="p-3 bg-stone-900 rounded-2xl border-2 border-stone-900 flex flex-col items-center justify-center min-h-[90px]">
                    <div className="text-[9px] text-amber-400 font-mono font-bold mb-1">
                      실제 캔버스 차지 비율 ({modalWidth}×{modalHeight})
                    </div>
                    <div
                      className="grid gap-1 p-1 bg-stone-800 rounded-xl"
                      style={{
                        gridTemplateColumns: `repeat(4, 16px)`,
                        gridTemplateRows: `repeat(4, 16px)`,
                      }}
                    >
                      {Array.from({ length: 16 }).map((_, idx) => {
                        const col = idx % 4;
                        const row = Math.floor(idx / 4);
                        const isInside = col < modalWidth && row < modalHeight;
                        return (
                          <div
                            key={idx}
                            className={`w-4 h-4 rounded-xs transition-all ${
                              isInside ? 'bg-amber-400 border border-amber-600 scale-95' : 'bg-stone-700/40 border border-stone-700/50'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Emoji / Icon Selection */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1">
                  대표 아이콘 / 이모지
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-stone-50 border border-stone-200 rounded-xl">
                  {['🛋️', '👑', '💎', '🎟️', '🎪', '🛍️', '📸', '☕', '🎤', '🎁', '🚀', '⭐', '🍔', '🍿'].map((emo) => (
                    <button
                      key={emo}
                      type="button"
                      onClick={() => setModalEmoji(emo)}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${
                        modalEmoji === emo
                          ? 'bg-amber-400 ring-2 ring-stone-900 scale-110 shadow-xs'
                          : 'hover:bg-stone-200'
                      }`}
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Color Theme */}
              <div>
                <label className="block text-xs font-black text-stone-800 mb-1">
                  색상 테마
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {COLOR_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setModalColorTheme(theme.id)}
                      className={`p-2 rounded-xl border-2 text-[10px] font-bold text-center transition-all cursor-pointer ${
                        theme.bg
                      } ${theme.border} ${theme.text} ${
                        modalColorTheme === theme.id ? 'ring-2 ring-stone-900 scale-105 shadow-sm' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Pricing & Capacity */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                {modalCategory === 'seat' ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        좌석 등급명
                      </label>
                      <input
                        type="text"
                        value={modalSeatGrade}
                        onChange={(e) => setModalSeatGrade(e.target.value)}
                        placeholder="예: VVIP, 커플석"
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        티켓 판매 가격 (₩)
                      </label>
                      <input
                        type="number"
                        value={modalPrice}
                        onChange={(e) => setModalPrice(parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-black font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      동시 수용 정원 (명)
                    </label>
                    <input
                      type="number"
                      value={modalCapacity}
                      onChange={(e) => setModalCapacity(parseInt(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-black font-mono"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-stone-100">
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleCreateCustomBlock}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer transition-all active:scale-95"
              >
                ✨ 이 커스텀 블록 저장 &amp; 캔버스 브러시 선택
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
