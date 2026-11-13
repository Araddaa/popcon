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
}

export interface CustomGridSandboxStudioProps {
  venueName?: string;
  onSaveLayout?: (data: { tiles: SandboxTile[]; stats: any }) => void;
  onShowToast?: (msg: string) => void;
}

// 20 columns x 12 rows
const GRID_COLS = 20;
const GRID_ROWS = 12;

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
    description: '타일을 클릭하여 이름, 가격, 메모를 확인하고 편집합니다.',
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

  // --- Seats ---
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
    bgColor: 'bg-purple-900',
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

// ----------------------------------------------------
// Pre-built Layout Templates
// ----------------------------------------------------
const PRESET_TEMPLATES = {
  blank: () => {
    const tiles: SandboxTile[] = [];
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        tiles.push({ id: `t_${x}_${y}`, x, y, type: 'empty' });
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

    // Photo Zones on top
    setTile(3, 2, 'booth_photo', '시그니처 조형물');
    setTile(4, 2, 'booth_photo', '시그니처 조형물');
    setTile(7, 2, 'booth_photo', '네온 포토월');
    setTile(8, 2, 'booth_photo', '네온 포토월');

    // Walls partitioning zones
    for (let x = 0; x < 20; x++) {
      setTile(x, 0, 'wall');
      setTile(x, 11, 'wall');
    }
    for (let y = 0; y < 12; y++) {
      if (y !== 10) setTile(0, y, 'wall');
      if (y !== 10) setTile(19, y, 'wall');
    }

    // Merch Store area
    setTile(12, 2, 'booth_merch', '한정판 피규어');
    setTile(13, 2, 'booth_merch', '인형·쿠션');
    setTile(15, 2, 'booth_merch', '의류·에코백');
    setTile(16, 2, 'booth_merch', '계산대 POS');

    // Downward flow
    setTile(18, 5, 'path_arrow_d');
    setTile(18, 6, 'path_arrow_d');
    setTile(18, 7, 'path_arrow_d');
    setTile(18, 8, 'path_arrow_d');

    // Gacha & DIY zone
    setTile(15, 7, 'booth_gacha', '가챠 뽑기 1');
    setTile(16, 7, 'booth_gacha', '가챠 뽑기 2');
    setTile(12, 7, 'cafe_table', 'DIY 체험 테이블');
    setTile(13, 7, 'cafe_table', 'DIY 체험 테이블');

    // Return path to exit
    for (let x = 18; x >= 18; x--) {
      setTile(x, 9, 'path_arrow_d');
    }
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
    // T-Thrust runway
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
  // Tile Data State
  const [tiles, setTiles] = useState<SandboxTile[]>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const pr = p.get('sandboxPreset');
      if (pr === 'theatre') return PRESET_TEMPLATES.theatre_thrust();
      if (pr === 'cafe') return PRESET_TEMPLATES.cafe_market();
      if (pr === 'blank') return PRESET_TEMPLATES.blank();
    }
    return PRESET_TEMPLATES.popup_loop();
  });
  const [activeTool, setActiveTool] = useState<SandboxTileType | 'eraser' | 'inspect'>('path');
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

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

  // Find Tile by coords
  const tileMap = useMemo(() => {
    const map = new Map<string, SandboxTile>();
    tiles.forEach((t) => map.set(`${t.x},${t.y}`, t));
    return map;
  }, [tiles]);

  const selectedTile = useMemo(() => {
    return tiles.find((t) => t.id === selectedTileId) || null;
  }, [tiles, selectedTileId]);

  // Statistics calculation
  const stats = useMemo(() => {
    let vipSeats = 0;
    let rSeats = 0;
    let sSeats = 0;
    let stdSeats = 0;
    let wheelSeats = 0;
    let pathCount = 0;
    let boothCount = 0;
    let totalRevenue = 0;
    let entrances = 0;
    let exits = 0;

    tiles.forEach((t) => {
      if (t.type === 'seat_vip') {
        vipSeats++;
        totalRevenue += t.price || 170000;
      } else if (t.type === 'seat_r') {
        rSeats++;
        totalRevenue += t.price || 140000;
      } else if (t.type === 'seat_s') {
        sSeats++;
        totalRevenue += t.price || 100000;
      } else if (t.type === 'seat_std') {
        stdSeats++;
        totalRevenue += t.price || 70000;
      } else if (t.type === 'seat_wheelchair') {
        wheelSeats++;
        totalRevenue += t.price || 50000;
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
        t.type === 'booth_gacha'
      ) {
        boothCount++;
      } else if (t.type === 'entrance') {
        entrances++;
      } else if (t.type === 'exit') {
        exits++;
      }
    });

    const totalSeats = vipSeats + rSeats + sSeats + stdSeats + wheelSeats;
    const pathRatio = Math.round((pathCount / (GRID_COLS * GRID_ROWS)) * 100);

    return {
      vipSeats,
      rSeats,
      sSeats,
      stdSeats,
      wheelSeats,
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
      if (target) setSelectedTileId(target.id);
      return;
    }

    setTiles((prev) => {
      const next = [...prev];
      const idx = next.findIndex((t) => t.x === x && t.y === y);
      if (idx === -1) return prev;

      const current = next[idx];
      let newType: SandboxTileType = 'empty';

      if (activeTool === 'eraser') {
        newType = 'empty';
      } else {
        newType = activeTool;
      }

      if (current.type === newType) return prev; // Avoid unnecessary re-renders

      // Default label/pricing from tool config
      const toolMeta = TOOLS_CONFIG.find((t) => t.type === newType);
      const updated: SandboxTile = {
        ...current,
        type: newType,
        label: toolMeta?.label || '',
        price: toolMeta?.defaultPrice,
        capacity: toolMeta?.defaultCapacity,
      };

      next[idx] = updated;
      return next;
    });
  };

  // Mouse handlers for dragging/painting
  const handleMouseDown = (x: number, y: number) => {
    setIsMouseDown(true);
    paintTile(x, y);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isMouseDown) {
      paintTile(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Update selected tile metadata from inspector
  const handleUpdateSelectedTile = (updates: Partial<SandboxTile>) => {
    if (!selectedTileId) return;
    setTiles((prev) =>
      prev.map((t) => (t.id === selectedTileId ? { ...t, ...updates } : t))
    );
  };

  // =========================================================================
  // BFS PATHFINDING FOR VISITOR SIMULATION
  // =========================================================================
  const findPathFromEntranceToExit = (): { x: number; y: number }[] => {
    const startTile = tiles.find((t) => t.type === 'entrance');
    const endTile = tiles.find((t) => t.type === 'exit');

    if (!startTile || !endTile) return [];

    const isWalkable = (type: SandboxTileType) => {
      return [
        'path',
        'path_arrow_r',
        'path_arrow_d',
        'path_arrow_l',
        'path_arrow_u',
        'queue',
        'entrance',
        'exit',
      ].includes(type);
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

        if (nx >= 0 && nx < GRID_COLS && ny >= 0 && ny < GRID_ROWS && !visited.has(key)) {
          const neighbor = tileMap.get(key);
          if (neighbor && isWalkable(neighbor.type)) {
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
        // Loop back to start
        step = 0;
        setSimVisitorPos(calculatedPath[0]);
        setSimStepIndex(0);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Load Preset
  const handleLoadPreset = (key: 'blank' | 'popup_loop' | 'theatre_thrust' | 'cafe_market') => {
    setIsSimulating(false);
    setSelectedTileId(null);
    const newTiles = PRESET_TEMPLATES[key]();
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
      cols: GRID_COLS,
      rows: GRID_ROWS,
      stats,
      tiles: tiles.filter((t) => t.type !== 'empty'),
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
    if (onShowToast) onShowToast('📋 공간 배치 데이터가 JSON으로 클립보드에 복사되었습니다.');
  };

  // Render tile visuals
  const renderTileVisual = (tile: SandboxTile) => {
    const isSelected = selectedTileId === tile.id;
    const isVisitorHere = simVisitorPos?.x === tile.x && simVisitorPos?.y === tile.y;

    let baseBg = 'bg-stone-50 border-stone-200';
    let content: React.ReactNode = null;

    switch (tile.type) {
      case 'empty':
        baseBg = 'bg-stone-50/70 border-dashed border-stone-200 hover:bg-stone-100/90';
        break;

      case 'entrance':
        baseBg = 'bg-emerald-500 text-white border-emerald-700 shadow-sm animate-pulse';
        content = (
          <div className="flex flex-col items-center justify-center text-[9px] font-black leading-none">
            <DoorOpen className="w-3.5 h-3.5 mb-0.5" />
            <span>IN</span>
          </div>
        );
        break;

      case 'exit':
        baseBg = 'bg-red-500 text-white border-red-700 shadow-sm';
        content = (
          <div className="flex flex-col items-center justify-center text-[9px] font-black leading-none">
            <LogOut className="w-3.5 h-3.5 mb-0.5" />
            <span>OUT</span>
          </div>
        );
        break;

      case 'path':
        baseBg = 'bg-stone-300 border-stone-400 text-stone-600 hover:bg-stone-300';
        content = <Footprints className="w-3 h-3 opacity-60" />;
        break;

      case 'path_arrow_r':
        baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
        content = <ArrowRight className="w-3.5 h-3.5" />;
        break;

      case 'path_arrow_d':
        baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
        content = <ArrowDown className="w-3.5 h-3.5" />;
        break;

      case 'path_arrow_l':
        baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
        content = <ArrowLeft className="w-3.5 h-3.5" />;
        break;

      case 'path_arrow_u':
        baseBg = 'bg-amber-200 border-amber-400 text-amber-900';
        content = <ArrowUp className="w-3.5 h-3.5" />;
        break;

      case 'queue':
        baseBg = 'bg-orange-300 border-orange-500 text-orange-950 font-mono text-[9px] font-bold';
        content = <div className="text-[8px] font-black tracking-tighter">대기선</div>;
        break;

      case 'wall':
        baseBg = 'bg-stone-900 border-black text-stone-500 shadow-inner';
        content = <div className="w-full h-full bg-stone-900" />;
        break;

      case 'seat_vip':
        baseBg = 'bg-amber-400 border-amber-600 text-amber-950 shadow-sm';
        content = (
          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-[8px] font-black">VIP</span>
          </div>
        );
        break;

      case 'seat_r':
        baseBg = 'bg-purple-300 border-purple-500 text-purple-950';
        content = <span className="text-[8px] font-black">R</span>;
        break;

      case 'seat_s':
        baseBg = 'bg-emerald-300 border-emerald-500 text-emerald-950';
        content = <span className="text-[8px] font-black">S</span>;
        break;

      case 'seat_std':
        baseBg = 'bg-blue-200 border-blue-400 text-blue-950';
        content = <span className="text-[8px] font-bold">일반</span>;
        break;

      case 'seat_wheelchair':
        baseBg = 'bg-cyan-200 border-cyan-500 text-cyan-950';
        content = <span className="text-[9px]">♿</span>;
        break;

      case 'booth_merch':
        baseBg = 'bg-rose-400 border-rose-600 text-white shadow-sm';
        content = (
          <div className="flex flex-col items-center justify-center leading-none">
            <Store className="w-3 h-3" />
            <span className="text-[7px] font-black mt-0.5">MD</span>
          </div>
        );
        break;

      case 'booth_photo':
        baseBg = 'bg-yellow-400 border-yellow-600 text-stone-950 shadow-sm';
        content = (
          <div className="flex flex-col items-center justify-center leading-none">
            <Camera className="w-3 h-3" />
            <span className="text-[7px] font-black mt-0.5">포토</span>
          </div>
        );
        break;

      case 'booth_kiosk':
        baseBg = 'bg-indigo-300 border-indigo-600 text-indigo-950';
        content = <span className="text-[8px] font-black">발권</span>;
        break;

      case 'cafe_table':
        baseBg = 'bg-amber-300 border-amber-600 text-amber-950 rounded-full scale-90';
        content = <Coffee className="w-3 h-3" />;
        break;

      case 'stage':
        baseBg = 'bg-purple-950 border-amber-400 text-amber-300 shadow-md';
        content = <Mic2 className="w-3 h-3 text-amber-400" />;
        break;

      case 'booth_gacha':
        baseBg = 'bg-pink-300 border-pink-500 text-pink-950';
        content = <Gift className="w-3 h-3" />;
        break;

      case 'restroom':
        baseBg = 'bg-slate-300 border-slate-500 text-slate-800';
        content = <span className="text-[8px] font-bold">WC</span>;
        break;
    }

    return (
      <div
        key={tile.id}
        onMouseDown={() => handleMouseDown(tile.x, tile.y)}
        onMouseEnter={() => handleMouseEnter(tile.x, tile.y)}
        className={`w-full aspect-square border transition-all flex items-center justify-center select-none cursor-pointer relative ${baseBg} ${
          isSelected ? 'ring-3 ring-amber-500 z-10 scale-105 shadow-md' : ''
        }`}
        title={`[${tile.x}, ${tile.y}] ${tile.label || tile.type}`}
      >
        {content}

        {/* Animated Visitor Avatar during Simulation */}
        {isVisitorHere && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 border-2 border-stone-900 shadow-lg flex items-center justify-center text-xs font-black animate-bounce">
              🚶
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-stone-900 rounded-3xl p-4 sm:p-7 shadow-[6px_6px_0px_#1c1917] space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400 border-2 border-stone-900 rounded-xl shadow-[2px_2px_0px_#1c1917]">
              <Grid className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-stone-950">
                  완전 자유 커스텀 샌드박스 빌더
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-400">
                  FREEFORM STUDIO
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                원하는 자리에 직접 마우스로 드래그하여 <span className="font-bold text-stone-800">좌석, 굿즈 부스, 포토존, 보행로 길(통로), 대기열 라인</span>을 100% 마음대로 설계합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Presets, Simulation & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Presets */}
          <div className="flex items-center bg-stone-100 border border-stone-300 rounded-xl p-1 gap-1 text-xs">
            <span className="text-[10px] font-bold text-stone-400 px-2 font-mono">템플릿:</span>
            <button
              type="button"
              onClick={() => handleLoadPreset('popup_loop')}
              className="px-2 py-1 bg-white hover:bg-stone-200 rounded-lg font-bold text-stone-700 shadow-xs cursor-pointer"
            >
              팝업 미로
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('theatre_thrust')}
              className="px-2 py-1 bg-white hover:bg-stone-200 rounded-lg font-bold text-stone-700 shadow-xs cursor-pointer"
            >
              소극장 T자
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('cafe_market')}
              className="px-2 py-1 bg-white hover:bg-stone-200 rounded-lg font-bold text-stone-700 shadow-xs cursor-pointer"
            >
              카페&amp;마켓
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('blank')}
              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold shadow-xs cursor-pointer"
            >
              백지 리셋
            </button>
          </div>

          {/* Visitor Simulation Button */}
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs border-2 border-stone-900 transition-all cursor-pointer ${
              isSimulating
                ? 'bg-rose-500 text-white animate-pulse shadow-[2px_2px_0px_#1c1917]'
                : 'bg-emerald-400 hover:bg-emerald-300 text-stone-950 shadow-[2px_2px_0px_#1c1917]'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? '시뮬레이션 중지' : '🚶 관람객 동선 테스트'}</span>
          </button>

          {/* Save / Export JSON */}
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 cursor-pointer"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>JSON 복사</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onSaveLayout) onSaveLayout({ tiles, stats });
              if (onShowToast) onShowToast('💾 자유 커스텀 배치도가 성공적으로 저장되었습니다!');
            }}
            className="flex items-center gap-1 px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>배치 저장</span>
          </button>
        </div>
      </div>

      {/* Real-time Spatial KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-stone-50 border-2 border-stone-200 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-stone-400">총 배치 좌석</div>
          <div className="text-xl font-black text-stone-900 font-mono mt-0.5">
            {stats.totalSeats}석
          </div>
          <div className="text-[9px] text-amber-700 font-mono font-bold">
            VIP {stats.vipSeats} / R {stats.rSeats} / S {stats.sSeats}
          </div>
        </div>

        <div className="bg-stone-50 border-2 border-stone-200 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-stone-400">좌석 예상 총매출</div>
          <div className="text-xl font-black text-amber-600 font-mono mt-0.5">
            ₩{stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[9px] text-stone-500 font-mono">전석 매진 기준</div>
        </div>

        <div className="bg-stone-50 border-2 border-stone-200 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-stone-400">부스 &amp; 체험존</div>
          <div className="text-xl font-black text-rose-600 font-mono mt-0.5">
            {stats.boothCount}개
          </div>
          <div className="text-[9px] text-rose-700 font-mono font-bold">MD, 포토존, 가챠</div>
        </div>

        <div className="bg-stone-50 border-2 border-stone-200 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-stone-400">보행로 (길) 면적</div>
          <div className="text-xl font-black text-stone-900 font-mono mt-0.5">
            {stats.pathCount}칸 <span className="text-xs font-normal text-stone-400">({stats.pathRatio}%)</span>
          </div>
          <div className="text-[9px] text-emerald-700 font-mono font-bold">원활한 보행 폭 유지</div>
        </div>

        <div className="bg-stone-50 border-2 border-stone-200 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-stone-400">출입구 게이트</div>
          <div className="text-xl font-black text-stone-900 font-mono mt-0.5">
            IN {stats.entrances} / OUT {stats.exits}
          </div>
          <div className="text-[9px] text-stone-500 font-mono">시작과 퇴장 지점</div>
        </div>

        <div className="bg-stone-50 border-2 border-stone-200 p-3 rounded-2xl col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-stone-400">동선 검증 상태</div>
          <div className="text-xs font-black mt-1 font-mono">
            {pathValidation.valid ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 정상 연결
              </span>
            ) : (
              <span className="text-rose-500 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 동선 단절
              </span>
            )}
          </div>
          <div className="text-[9px] text-stone-500 mt-0.5 truncate">{pathValidation.message}</div>
        </div>
      </div>

      {/* Main Studio Body: Palette Toolbar (Left) + Interactive Grid Canvas (Center) + Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT: Tools & Block Palette (col-span-3) */}
        <div className="lg:col-span-3 bg-stone-50 border-2 border-stone-900 rounded-2xl p-3 sm:p-4 space-y-4 shadow-[3px_3px_0px_#1c1917]">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-xs font-black text-stone-900 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              <span>블록 &amp; 브러시 팔레트</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono">드래그로 그리기</span>
          </div>

          {/* Group 1: Tools */}
          <div>
            <div className="text-[10px] font-bold text-stone-400 mb-1.5 uppercase tracking-wider font-mono">
              [1] 도구
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TOOLS_CONFIG.filter((t) => t.category === 'tool').map((t) => {
                const isSelected = activeTool === t.type;
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setActiveTool(t.type)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-[2px_2px_0px_#f59e0b]'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 2: Paths & Flow */}
          <div>
            <div className="text-[10px] font-bold text-stone-400 mb-1.5 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>[2] 길 &amp; 관람 동선</span>
              <span className="text-amber-600 font-bold">인도/통로</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TOOLS_CONFIG.filter((t) => t.category === 'path').map((t) => {
                const isSelected = activeTool === t.type;
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setActiveTool(t.type as any)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 border-stone-900 shadow-[2px_2px_0px_#1c1917]'
                        : `${t.bgColor} ${t.borderColor} ${t.color} hover:brightness-95`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-[11px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 3: Seats */}
          <div>
            <div className="text-[10px] font-bold text-stone-400 mb-1.5 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>[3] 객석 &amp; 좌석</span>
              <span className="text-purple-600 font-bold">VIP/R/S</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TOOLS_CONFIG.filter((t) => t.category === 'seat').map((t) => {
                const isSelected = activeTool === t.type;
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setActiveTool(t.type as any)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-purple-900 text-amber-300 border-stone-900 shadow-[2px_2px_0px_#1c1917]'
                        : `${t.bgColor} ${t.borderColor} ${t.color} hover:brightness-95`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-[11px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 4: Booths & Facilities */}
          <div>
            <div className="text-[10px] font-bold text-stone-400 mb-1.5 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>[4] 팝업 부스 &amp; 시설</span>
              <span className="text-rose-600 font-bold">MD/포토존</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TOOLS_CONFIG.filter((t) => t.category === 'booth').map((t) => {
                const isSelected = activeTool === t.type;
                const Icon = t.icon;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setActiveTool(t.type as any)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-rose-500 text-white border-stone-900 shadow-[2px_2px_0px_#1c1917]'
                        : `${t.bgColor} ${t.borderColor} ${t.color} hover:brightness-95`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-[11px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER: 2D Grid Canvas (col-span-6) */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-stone-900" />
              <span>캔버스 크기: 20열 × 12행 (총 240타일)</span>
            </span>
            <span className="text-stone-400 font-mono">
              선택된 브러시: <strong className="text-stone-900 font-sans">{activeTool}</strong>
            </span>
          </div>

          {/* The Interactive Tilemap Canvas */}
          <div
            ref={gridContainerRef}
            className="p-3 bg-stone-900 border-3 border-stone-900 rounded-3xl shadow-[5px_5px_0px_#1c1917] overflow-x-auto select-none"
          >
            <div
              className="grid gap-[2px] bg-stone-800 p-2 rounded-2xl min-w-[580px]"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
              }}
            >
              {tiles.map((t) => renderTileVisual(t))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 px-2 pt-1">
            <span>💡 <strong>Tip:</strong> 마우스 버튼을 누른 채로 드래그하면 그림판처럼 연속으로 길이 그려집니다.</span>
            <span className="text-amber-600 font-bold">1타일 = 약 1.5m 규격</span>
          </div>
        </div>

        {/* RIGHT: Tile Inspector & Properties (col-span-3) */}
        <div className="lg:col-span-3 bg-stone-50 border-2 border-stone-900 rounded-2xl p-4 space-y-4 shadow-[3px_3px_0px_#1c1917]">
          <div className="flex items-center gap-1.5 border-b border-stone-200 pb-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-black text-stone-900">타일 속성 인스펙터</h4>
          </div>

          {selectedTile ? (
            <div className="space-y-3 text-xs">
              <div className="bg-white border border-stone-200 p-2.5 rounded-xl space-y-1">
                <div className="text-[10px] text-stone-400 font-mono">좌표 / ID</div>
                <div className="font-bold text-stone-900 font-mono">
                  [{selectedTile.x}, {selectedTile.y}] ({selectedTile.id})
                </div>
                <div className="text-[10px] text-purple-600 font-bold uppercase mt-1">
                  타입: {selectedTile.type}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-1">
                  블록 표시 이름 / 번호
                </label>
                <input
                  type="text"
                  value={selectedTile.label || ''}
                  onChange={(e) => handleUpdateSelectedTile({ label: e.target.value })}
                  placeholder="예: VIP-A1, 포토존, MD매대"
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {selectedTile.type.startsWith('seat_') && (
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-1">
                    티켓 판매 가격 (₩)
                  </label>
                  <input
                    type="number"
                    value={selectedTile.price || 0}
                    onChange={(e) =>
                      handleUpdateSelectedTile({ price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold font-mono text-stone-900 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-1">
                  동시 체류 / 수용 인원 (명)
                </label>
                <input
                  type="number"
                  value={selectedTile.capacity || 1}
                  onChange={(e) =>
                    handleUpdateSelectedTile({ capacity: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold font-mono text-stone-900 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-1">
                  현장 운영 메모 / 지침
                </label>
                <textarea
                  value={selectedTile.note || ''}
                  onChange={(e) => handleUpdateSelectedTile({ note: e.target.value })}
                  placeholder="예: 안전 요원 배치 필수, 전력 220V 16A 소켓 지원"
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateSelectedTile({ type: 'empty', label: '', price: undefined });
                    if (onShowToast) onShowToast('선택한 블록이 지워졌습니다.');
                  }}
                  className="w-full py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>이 블록 비우기</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-stone-400 space-y-2">
              <Eye className="w-6 h-6 mx-auto opacity-40" />
              <p className="text-xs">
                캔버스 위의 블록을 클릭하면 이름, 가격, 수용 인원을 여기서 수정할 수 있습니다.
              </p>
            </div>
          )}

          {/* Quick Legend */}
          <div className="border-t border-stone-200 pt-3 text-[10px] text-stone-500 space-y-1">
            <div className="font-bold text-stone-700">색상 범례 (Legend)</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-stone-300 rounded-xs" /> 보행로(길)
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-xs" /> VIP 좌석
              <span className="w-2.5 h-2.5 bg-rose-400 rounded-xs" /> MD 부스
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-xs" /> 포토존
              <span className="w-2.5 h-2.5 bg-stone-900 rounded-xs" /> 가벽/파티션
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> 입구(IN)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
