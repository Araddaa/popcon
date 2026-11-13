'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  RefreshCw,
  Edit3,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  MapPin,
  Eye,
  Save,
  Download,
  ExternalLink,
  Sparkles,
  Sliders,
  Calendar,
  Ticket,
  Layers,
  Lock,
  Unlock,
  Settings,
  Activity,
  FileText,
  X,
  Check,
  Phone,
  Mail,
  Shield,
  CreditCard,
  History,
  RotateCcw,
  Compass,
  Scissors,
  Eraser,
  Wand2,
  Maximize2,
} from 'lucide-react';
import { AdminMember, UserStatus, UserRole } from '../types';
import { initialAdminMembers, venuePresets, posterPresets } from '../data/adminMockData';

interface AdminConsoleProps {
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export type CustomSeatGrade = 'op' | 'vip' | 'r' | 's' | 'a' | 'wheelchair' | 'empty';
export type StageStyle = 'proscenium' | 'thrust_t' | 'circular_arena' | 'runway';

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  onClose,
  isStandalonePage = false,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'users' | 'event' | 'map' | 'seats' | 'policies' | 'audit'
  >('users');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const tabParam = p.get('adminTab');
      if (tabParam && ['users', 'event', 'map', 'seats', 'policies', 'audit'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ==========================================
  // 1. USER MANAGEMENT STATE (회원 관리)
  // ==========================================
  const [members, setMembers] = useState<AdminMember[]>(initialAdminMembers);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'suspended' | 'banned' | 'organizer' | 'warning'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Sanction Modal
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [sanctionTarget, setSanctionTarget] = useState<AdminMember | null>(null);
  const [sanctionType, setSanctionType] = useState<'ban' | 'suspend' | 'warning'>('suspend');
  const [suspensionDays, setSuspensionDays] = useState<number>(7);
  const [sanctionReasonCategory, setSanctionReasonCategory] = useState('비인가 매크로/봇 사용 의심');
  const [sanctionDetailMemo, setSanctionDetailMemo] = useState('');

  // Member Detail Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [memberMemoDraft, setMemberMemoDraft] = useState('');

  // Filtered members calculation
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (filterStatus === 'active' && m.status !== 'active') return false;
      if (filterStatus === 'suspended' && m.status !== 'suspended') return false;
      if (filterStatus === 'banned' && m.status !== 'banned') return false;
      if (filterStatus === 'organizer' && m.role !== 'organizer') return false;
      if (filterStatus === 'warning' && m.warningCount === 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchNick = m.nickname.toLowerCase().includes(q);
        const matchEmail = m.email.toLowerCase().includes(q);
        const matchPhone = m.phone.includes(q);
        const matchId = m.id.toLowerCase().includes(q);
        if (!matchName && !matchNick && !matchEmail && !matchPhone && !matchId) return false;
      }
      return true;
    });
  }, [members, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === 'active').length;
    const suspended = members.filter((m) => m.status === 'suspended').length;
    const banned = members.filter((m) => m.status === 'banned').length;
    const organizers = members.filter((m) => m.role === 'organizer').length;
    const withWarning = members.filter((m) => m.warningCount > 0).length;
    return { total, active, suspended, banned, organizers, withWarning };
  }, [members]);

  const handleOpenSanctionModal = (
    member: AdminMember,
    type: 'ban' | 'suspend' | 'warning'
  ) => {
    setSanctionTarget(member);
    setSanctionType(type);
    if (type === 'ban') {
      setSanctionReasonCategory('비인가 매크로 프로그램 사용 및 다량 좌석 점유');
      setSanctionDetailMemo('비인가 프로그램 10초 내 50회 이상 비정상 좌석 요청 적발 (영구 이용 정지)');
    } else if (type === 'suspend') {
      setSanctionReasonCategory('상습 노쇼 및 반복 취소');
      setSanctionDetailMemo('3회 연속 노쇼 발생으로 인한 7일간 예매 기능 임시 비활성화');
      setSuspensionDays(7);
    } else {
      setSanctionReasonCategory('티켓팅 대기열 복수 기기 동시 접속 시도');
      setSanctionDetailMemo('경고 1회 추가 부여 (누적 3회 시 계정 비활성화)');
    }
    setIsSanctionModalOpen(true);
  };

  const handleApplySanction = () => {
    if (!sanctionTarget) return;

    const updated = members.map((m) => {
      if (m.id !== sanctionTarget.id) return m;

      const dateStr = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newActionLog = [...(m.recentActionLog || [])];

      if (sanctionType === 'ban') {
        newActionLog.unshift({
          date: dateStr,
          action: `영구 정지 (사유: ${sanctionReasonCategory})`,
          adminName: '송민재(관리자)',
        });
        return {
          ...m,
          status: 'banned' as UserStatus,
          banReason: `${sanctionReasonCategory} - ${sanctionDetailMemo}`,
          recentActionLog: newActionLog,
        };
      } else if (sanctionType === 'suspend') {
        const untilDate = new Date();
        untilDate.setDate(untilDate.getDate() + suspensionDays);
        const untilStr = `${untilDate.getFullYear()}.${String(untilDate.getMonth() + 1).padStart(2, '0')}.${String(untilDate.getDate()).padStart(2, '0')} (${suspensionDays}일간)`;

        newActionLog.unshift({
          date: dateStr,
          action: `임시 비활성화 ${suspensionDays}일 부여 (사유: ${sanctionReasonCategory})`,
          adminName: '송민재(관리자)',
        });

        return {
          ...m,
          status: 'suspended' as UserStatus,
          suspensionUntil: untilStr,
          banReason: `${sanctionReasonCategory} - ${sanctionDetailMemo}`,
          recentActionLog: newActionLog,
        };
      } else {
        const newCount = m.warningCount + 1;
        newActionLog.unshift({
          date: dateStr,
          action: `경고 ${newCount}회차 부여 (사유: ${sanctionReasonCategory})`,
          adminName: '송민재(관리자)',
        });
        return {
          ...m,
          warningCount: newCount,
          recentActionLog: newActionLog,
        };
      }
    });

    setMembers(updated);
    setIsSanctionModalOpen(false);

    if (sanctionType === 'ban') {
      showToast(`🚨 ${sanctionTarget.name} 회원에게 [영구 정지] 조치가 적용되었습니다.`);
    } else if (sanctionType === 'suspend') {
      showToast(`⏳ ${sanctionTarget.name} 회원이 [${suspensionDays}일간 임시 비활성화] 처리되었습니다.`);
    } else {
      showToast(`⚠️ ${sanctionTarget.name} 회원에게 [경고 +1]가 부여되었습니다.`);
    }
  };

  const handleReactivateMember = (member: AdminMember) => {
    const updated = members.map((m) => {
      if (m.id !== member.id) return m;
      const dateStr = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      const newActionLog = [...(m.recentActionLog || [])];
      newActionLog.unshift({
        date: dateStr,
        action: '정지 및 제재 해제 (정상 계정 복원)',
        adminName: '송민재(관리자)',
      });
      return {
        ...m,
        status: 'active' as UserStatus,
        suspensionUntil: undefined,
        banReason: undefined,
        warningCount: 0,
        recentActionLog: newActionLog,
      };
    });
    setMembers(updated);
    showToast(`✅ ${member.name} 회원의 모든 제재가 해제되고 정상 상태로 복구되었습니다.`);
  };

  const handleChangeRole = (member: AdminMember, newRole: UserRole) => {
    const updated = members.map((m) => (m.id === member.id ? { ...m, role: newRole } : m));
    setMembers(updated);
    if (selectedMember && selectedMember.id === member.id) {
      setSelectedMember({ ...selectedMember, role: newRole });
    }
    showToast(`🔄 ${member.name} 회원의 권한이 [${newRole === 'admin' ? '운영 관리자' : newRole === 'organizer' ? '주최사 파트너' : '일반 회원'}]으로 변경되었습니다.`);
  };

  // Batch actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMemberIds(filteredMembers.map((m) => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((item) => item !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleBatchSuspend = (days: number) => {
    if (selectedMemberIds.length === 0) return;
    const updated = members.map((m) => {
      if (!selectedMemberIds.includes(m.id)) return m;
      return {
        ...m,
        status: 'suspended' as UserStatus,
        suspensionUntil: `일괄 임시 비활성화 (${days}일간)`,
        banReason: '관리자 일괄 정책 제재 적용',
      };
    });
    setMembers(updated);
    showToast(`⏳ 선택된 ${selectedMemberIds.length}명의 회원이 [${days}일간 임시 비활성화]되었습니다.`);
    setSelectedMemberIds([]);
  };

  const handleBatchBan = () => {
    if (selectedMemberIds.length === 0) return;
    if (!confirm(`선택한 ${selectedMemberIds.length}명의 회원을 정말 영구 정지(Ban) 처리하시겠습니까?`)) return;
    const updated = members.map((m) => {
      if (!selectedMemberIds.includes(m.id)) return m;
      return {
        ...m,
        status: 'banned' as UserStatus,
        banReason: '관리자 일괄 부정행위 영구 차단',
      };
    });
    setMembers(updated);
    showToast(`🚨 선택된 ${selectedMemberIds.length}명의 회원이 [영구 정지] 처리되었습니다.`);
    setSelectedMemberIds([]);
  };

  const handleBatchReactivate = () => {
    if (selectedMemberIds.length === 0) return;
    const updated = members.map((m) => {
      if (!selectedMemberIds.includes(m.id)) return m;
      return {
        ...m,
        status: 'active' as UserStatus,
        suspensionUntil: undefined,
        banReason: undefined,
        warningCount: 0,
      };
    });
    setMembers(updated);
    showToast(`✅ 선택된 ${selectedMemberIds.length}명의 회원이 [정상 복구]되었습니다.`);
    setSelectedMemberIds([]);
  };

  const handleOpenProfileModal = (member: AdminMember) => {
    setSelectedMember(member);
    setMemberMemoDraft(member.memo || '');
    setIsProfileModalOpen(true);
  };

  const handleSaveMemberMemo = () => {
    if (!selectedMember) return;
    const updated = members.map((m) =>
      m.id === selectedMember.id ? { ...m, memo: memberMemoDraft } : m
    );
    setMembers(updated);
    setSelectedMember({ ...selectedMember, memo: memberMemoDraft });
    showToast('💾 회원 관리자 메모가 저장되었습니다.');
  };

  // ==========================================
  // 2. EVENT & CONTENT STATE (행사 기본 정보 & 상세 내용)
  // ==========================================
  const [eventTitle, setEventTitle] = useState('뮤지컬 <데스노트 2027> 서울 월드투어');
  const [eventSubtitle, setEventSubtitle] = useState('홍광호 · 김준수 · 고은성 주연 전석 지정석 티켓팅');
  const [eventCategory, setEventCategory] = useState<'performance' | 'popup' | 'exhibition' | 'movie' | 'collab_cafe'>('performance');
  const [eventPeriodStart, setEventPeriodStart] = useState('2027-01-10');
  const [eventPeriodEnd, setEventPeriodEnd] = useState('2027-04-15');
  const [eventRunningTime, setEventRunningTime] = useState('160분 (인터미션 20분 포함)');
  const [eventAgeRating, setEventAgeRating] = useState('만 8세 이상 관람가');
  const [eventPriceSummary, setEventPriceSummary] = useState('OP 190,000원 / VIP 170,000원 / R 140,000원');
  const [eventPosterUrl, setEventPosterUrl] = useState('https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80');
  const [eventDescription, setEventDescription] = useState(
    '이름이 적히면 죽는 사신(死神)의 공책 데스노트.\n\n정의를 실현하려는 천재 고교생 야가미 라이토와 그를 추적하는 명탐정 엘(L)의 숨막히는 두뇌 싸움!\n브로드웨이 및 웨스트엔드 최정상 크리에이티브 팀이 선사하는 압도적인 넘버와 3면 LED 디스플레이 무대의 혁신적인 귀환.'
  );
  const [castList, setCastList] = useState<{ id: string; role: string; actor: string }[]>([
    { id: '1', role: '야가미 라이토', actor: '홍광호' },
    { id: '2', role: '엘 (L)', actor: '김준수' },
    { id: '3', role: '렘', actor: '장은아' },
    { id: '4', role: '류크', actor: '서경수' },
    { id: '5', role: '아마네 미사', actor: '케이' },
  ]);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [newActorInput, setNewActorInput] = useState('');

  const handleAddCast = () => {
    if (!newRoleInput.trim() || !newActorInput.trim()) return;
    setCastList([
      ...castList,
      { id: Date.now().toString(), role: newRoleInput.trim(), actor: newActorInput.trim() },
    ]);
    setNewRoleInput('');
    setNewActorInput('');
  };

  const handleRemoveCast = (id: string) => {
    setCastList(castList.filter((c) => c.id !== id));
  };

  // ==========================================
  // 3. LOCATION & INTERACTIVE MAP STATE (위치 및 대화형 지도)
  // ==========================================
  const [venueName, setVenueName] = useState('디큐브 링크아트센터 대극장');
  const [venueAddress, setVenueAddress] = useState('서울특별시 구로구 경인로 662 디큐브시티 7층');
  const [venueLat, setVenueLat] = useState<number>(37.5089);
  const [venueLng, setVenueLng] = useState<number>(126.8891);
  const [venueTransit, setVenueTransit] = useState('지하철 1·2호선 신도림역 1번/5번 출구 지하 직결 (도보 2분)');
  const [venueParking, setVenueParking] = useState('디큐브시티 지하 주차장 이용 시 당일 관람객 4시간 5,000원 할인권 제공');
  const [mapRefreshKey, setMapRefreshKey] = useState<number>(Date.now());

  // 지도 iframe과의 양방향 실시간 메시지 연동 (지도 클릭 시 좌표 자동 갱신!)
  useEffect(() => {
    const handleMapMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'POPCON_LOCATION_PICKED') {
        const { lat, lng, name, address } = e.data;
        if (lat) setVenueLat(lat);
        if (lng) setVenueLng(lng);
        if (name && name !== 'VENUE' && name !== '공연장 위치') {
          setVenueName(name);
        }
        if (address) {
          setVenueAddress(address);
        }
        showToast(`📍 지도에서 새 위치를 선택했습니다: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, []);

  const handleSelectVenuePreset = (preset: (typeof venuePresets)[0]) => {
    setVenueName(preset.name);
    setVenueAddress(preset.address);
    setVenueLat(preset.lat);
    setVenueLng(preset.lng);
    setVenueTransit(preset.transit);
    setVenueParking(preset.parking);
    setMapRefreshKey(Date.now());
    showToast(`📍 [${preset.name}] 위치 정보와 좌표가 자동 반영되었습니다.`);
  };

  // =========================================================================
  // 4. FREEFORM & MULTI-ARCHITECTURE SEAT MAP BUILDER (자유 비정형 좌석 배치 스튜디오)
  // =========================================================================
  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const seatCols = Array.from({ length: 18 }, (_, i) => i + 1);

  const [stageStyle, setStageStyle] = useState<StageStyle>('proscenium');
  const [fanCurvature, setFanCurvature] = useState<number>(45); // 곡률 0% ~ 100%
  const [wingAngle, setWingAngle] = useState<number>(15); // 좌/우 날개석 안쪽 경사각 (0° ~ 25°)
  const [isStaggered, setIsStaggered] = useState<boolean>(true); // 지그재그 시야각 오프셋
  const [activeFloor, setActiveFloor] = useState<'1F' | '2F'>('1F');

  // 도구 팔레트
  const [selectedSeatTool, setSelectedSeatTool] = useState<CustomSeatGrade>('vip');
  const [seatPrices, setSeatPrices] = useState({
    op: 190000,
    vip: 170000,
    r: 140000,
    s: 110000,
    a: 80000,
    wheelchair: 85000,
  });

  // --- 프리셋 1: 샤롯데 / 대극장 3구역 부채꼴 (Curved Fan Theater) ---
  const generateCurvedFanPreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        // Aisles at col 6 and col 13
        if (c === 6 || c === 13) {
          layout[id] = 'empty';
          return;
        }

        // Row A & B: OP석 (오케스트라 피트석)
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

        // Curved arch outer corners: 앞열은 좁고 뒷열로 갈수록 사다리꼴 부채꼴로 확장!
        if (rIdx === 2 && (c <= 2 || c >= 17)) { layout[id] = 'empty'; return; }
        if (rIdx === 3 && (c <= 1 || c >= 18)) { layout[id] = 'empty'; return; }

        if (rIdx >= 2 && rIdx <= 4) {
          layout[id] = 'vip';
        } else if (rIdx >= 5 && rIdx <= 8) {
          layout[id] = 'r';
        } else if (rIdx >= 9 && rIdx <= 10) {
          layout[id] = 's';
        } else {
          layout[id] = 'a';
        }
      });
    });
    // Wheelchair seats at rear corners
    layout['L1'] = 'wheelchair';
    layout['L2'] = 'wheelchair';
    layout['L17'] = 'wheelchair';
    layout['L18'] = 'wheelchair';
    return layout;
  };

  // --- 프리셋 2: KSPO DOME / 아레나 T자 돌출무대 (Thrust T-Stage Arena) ---
  const generateTStagePreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        // Central T-Stage cutout: Rows A through F, cols 8 through 11
        if (rIdx <= 5 && c >= 8 && c <= 11) {
          layout[id] = 'empty'; // T-Stage runway area!
          return;
        }
        // Standing VIP Pen A (Left) & Pen B (Right)
        if (rIdx >= 1 && rIdx <= 5) {
          if (c >= 2 && c <= 6) { layout[id] = 'op'; return; } // Pen A VIP
          if (c >= 13 && c <= 17) { layout[id] = 'op'; return; } // Pen B VIP
          layout[id] = 'empty';
          return;
        }
        // Seating wrapping around the tip of the T-Stage
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

  // --- 프리셋 3: 예술의전당 오페라극장 다층 발코니 (Tiered Balcony) ---
  const generateBalconyPreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        // Left & Right Elevated Box Seats (Cols 1-2 and Cols 17-18)
        if ((c <= 2 || c >= 17) && rIdx <= 4) {
          layout[id] = 'vip';
          return;
        }
        // Center Balcony Arch
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

  // --- 프리셋 4: 성수 에스팩토리 비정형 아일랜드 & 런웨이 (Freeform Islands) ---
  const generateSeongsuIslandPreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r) => {
      seatCols.forEach((c) => {
        layout[`${r}${c}`] = 'empty';
      });
    });
    // Island A (VIP Lounge Pod - 10 seats)
    ['B3', 'B4', 'B5', 'C3', 'C4', 'C5', 'D3', 'D4', 'D5'].forEach((id) => (layout[id] = 'vip'));
    // Island B (R석 체험존 아일랜드 - 12 seats)
    ['B14', 'B15', 'B16', 'C14', 'C15', 'C16', 'D14', 'D15', 'D16', 'E14', 'E15', 'E16'].forEach(
      (id) => (layout[id] = 'r')
    );
    // Runway flanking seats (C8-C11 & F8-F11)
    ['F7', 'F8', 'F11', 'F12', 'G7', 'G8', 'G11', 'G12'].forEach((id) => (layout[id] = 'op'));
    // Island C (S석 원형 라운지)
    ['H3', 'H4', 'H5', 'I3', 'I4', 'I5', 'J3', 'J4', 'J5', 'H14', 'H15', 'H16', 'I14', 'I15', 'I16'].forEach(
      (id) => (layout[id] = 's')
    );
    return layout;
  };

  // --- 프리셋 5: 대학로 지그재그 소극장 (Staggered Small Theater) ---
  const generateStaggeredPreset = (): Record<string, CustomSeatGrade> => {
    const layout: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        if (rIdx > 7) { layout[id] = 'empty'; return; }
        if (c < 4 || c > 15) { layout[id] = 'empty'; return; }
        if (c === 9) { layout[id] = 'empty'; return; } // center aisle
        if (rIdx <= 2) layout[id] = 'vip';
        else if (rIdx <= 5) layout[id] = 'r';
        else layout[id] = 's';
      });
    });
    return layout;
  };

  // Layout states for 1F and 2F
  const [layout1F, setLayout1F] = useState<Record<string, CustomSeatGrade>>(generateCurvedFanPreset);
  const [layout2F, setLayout2F] = useState<Record<string, CustomSeatGrade>>(generateBalconyPreset);

  const currentLayout = activeFloor === '1F' ? layout1F : layout2F;
  const setCurrentLayout = (newLayout: Record<string, CustomSeatGrade>) => {
    if (activeFloor === '1F') setLayout1F(newLayout);
    else setLayout2F(newLayout);
  };

  // 프리셋 로더 함수들
  const loadPreset = (type: 'fan' | 't_stage' | 'balcony' | 'island' | 'staggered') => {
    if (type === 'fan') {
      setStageStyle('proscenium');
      setFanCurvature(45);
      setWingAngle(15);
      setIsStaggered(true);
      setCurrentLayout(generateCurvedFanPreset());
      showToast('🏛️ [샤롯데씨어터형 부채꼴 대극장] 프리셋이 로드되었습니다.');
    } else if (type === 't_stage') {
      setStageStyle('thrust_t');
      setFanCurvature(30);
      setWingAngle(10);
      setIsStaggered(false);
      setCurrentLayout(generateTStagePreset());
      showToast('🎤 [KSPO DOME형 T자 돌출무대 아레나] 프리셋이 로드되었습니다.');
    } else if (type === 'balcony') {
      setStageStyle('proscenium');
      setFanCurvature(35);
      setWingAngle(20);
      setIsStaggered(true);
      setCurrentLayout(generateBalconyPreset());
      showToast('🎭 [예술의전당형 다층 발코니 & 박스석] 프리셋이 로드되었습니다.');
    } else if (type === 'island') {
      setStageStyle('runway');
      setFanCurvature(0);
      setWingAngle(0);
      setIsStaggered(false);
      setCurrentLayout(generateSeongsuIslandPreset());
      showToast('✨ [성수 에스팩토리 비정형 아일랜드 라운지] 프리셋이 로드되었습니다.');
    } else if (type === 'staggered') {
      setStageStyle('proscenium');
      setFanCurvature(10);
      setWingAngle(5);
      setIsStaggered(true);
      setCurrentLayout(generateStaggeredPreset());
      showToast('🎬 [대학로 지그재그 시야보장 소극장] 프리셋이 로드되었습니다.');
    }
  };

  // 좌석 클릭 인터랙션 (토글 또는 도구 브러시 적용)
  const handleSeatClick = (id: string) => {
    setCurrentLayout({
      ...currentLayout,
      [id]: currentLayout[id] === selectedSeatTool ? 'empty' : selectedSeatTool,
    });
  };

  // 부채꼴 자동 깎기 (Auto-Sculpt Fan)
  const handleAutoSculptFan = () => {
    const updated = { ...currentLayout };
    seatRows.forEach((r, rIdx) => {
      seatCols.forEach((c) => {
        const id = `${r}${c}`;
        const maxColsForThisRow = 8 + Math.floor(rIdx * 0.9);
        const centerCol = 9.5;
        const distFromCenter = Math.abs(c - centerCol);
        if (distFromCenter > maxColsForThisRow / 2) {
          updated[id] = 'empty';
        }
      });
    });
    setCurrentLayout(updated);
    setFanCurvature(50);
    setWingAngle(15);
    showToast('✂️ 외곽 좌석들이 무대를 향하는 완벽한 부채꼴 아치형으로 깎였습니다.');
  };

  // 캔버스 전체 지우기 (자유 스케치 시작)
  const handleClearCanvas = () => {
    if (!confirm('현재 층의 모든 좌석을 지우고 텅 빈 캔버스에서 새로 배치하시겠습니까?')) return;
    const cleared: Record<string, CustomSeatGrade> = {};
    seatRows.forEach((r) => {
      seatCols.forEach((c) => {
        cleared[`${r}${c}`] = 'empty';
      });
    });
    setCurrentLayout(cleared);
    showToast('🧹 캔버스가 초기화되었습니다. 도구 팔레트로 원하는 위치에 좌석을 찍어 배치하세요.');
  };

  // 행 단위 일괄 지정
  const handleRowBulkAssign = (row: string) => {
    const updated = { ...currentLayout };
    seatCols.forEach((c) => {
      if (c !== 6 && c !== 13) {
        updated[`${row}${c}`] = selectedSeatTool;
      }
    });
    setCurrentLayout(updated);
    showToast(`🪄 ${row}열 좌석들이 [${selectedSeatTool.toUpperCase()}] 등급으로 일괄 변경되었습니다.`);
  };

  // 실시간 좌석 통계 계산
  const seatCounts = useMemo(() => {
    let op = 0,
      vip = 0,
      r = 0,
      s = 0,
      a = 0,
      wheelchair = 0,
      empty = 0;
    Object.values(currentLayout).forEach((grade) => {
      if (grade === 'op') op++;
      else if (grade === 'vip') vip++;
      else if (grade === 'r') r++;
      else if (grade === 's') s++;
      else if (grade === 'a') a++;
      else if (grade === 'wheelchair') wheelchair++;
      else empty++;
    });
    const totalValid = op + vip + r + s + a + wheelchair;
    const totalRev =
      op * seatPrices.op +
      vip * seatPrices.vip +
      r * seatPrices.r +
      s * seatPrices.s +
      a * seatPrices.a +
      wheelchair * seatPrices.wheelchair;
    return { op, vip, r, s, a, wheelchair, empty, totalValid, totalRev };
  }, [currentLayout, seatPrices]);

  // ==========================================
  // 5. TICKETING POLICIES STATE (티켓팅 정책 & 워룸)
  // ==========================================
  const [ticketOpenDateTime, setTicketOpenDateTime] = useState('2026-11-14T14:00');
  const [enable10sCountdown, setEnable10sCountdown] = useState(true);
  const [maxTicketsPerUser, setMaxTicketsPerUser] = useState<number>(4);
  const [enableGroupSplit, setEnableGroupSplit] = useState(true);
  const [enableWaitlist, setEnableWaitlist] = useState(true);
  const [queueTrafficCap, setQueueTrafficCap] = useState('10000');

  const handleSaveAllConfig = () => {
    showToast('✨ 모든 관리자 설정(회원 제재, 행사 내용, 지도 좌표, 좌석 배치, 티켓팅 정책)이 저장되었습니다!');
  };

  return (
    <div className={`w-full bg-stone-100 text-stone-900 ${isStandalonePage ? 'min-h-screen py-6 px-3 sm:px-6' : 'p-2 sm:p-5'}`}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-amber-300 border-2 border-amber-400 px-5 py-3 rounded-2xl shadow-[4px_4px_0px_#f59e0b] font-bold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Studio Container Card */}
      <div className="max-w-7xl mx-auto bg-white border-2 border-stone-900 rounded-3xl shadow-[6px_6px_0px_#1c1917] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-stone-900 text-white px-5 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center font-black text-xl shadow-inner">
              🎪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  POP-CON 주최사 &amp; 통합 관리자 콘솔
                </h1>
                <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin v2.5
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  실시간 서버 동기화 활성
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                회원 이용정지 및 제재 관리 · 행사 콘텐츠 및 지도 위치 실시간 피커 · 부채꼴/비정형 자유 좌석 배치도 · 티켓팅 워룸 정책
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSaveAllConfig}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_#fff] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Save className="w-4 h-4" />
              <span>전체 설정 저장</span>
            </button>

            {isStandalonePage ? (
              <a
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-bold rounded-xl border border-stone-700 transition-colors"
                title="메인 서비스 화면으로 이동"
              >
                <span>메인 사이트</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-stone-50 border-b-2 border-stone-900 px-4 sm:px-8 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
          
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-rose-500 text-white shadow-[2px_2px_0px_#1c1917] border-2 border-stone-900'
                : 'text-stone-700 hover:bg-stone-200/70 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. 회원 관리 &amp; 이용 정지</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'users' ? 'bg-white text-rose-700' : 'bg-stone-200 text-stone-700'}`}>
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('event')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'event'
                ? 'bg-amber-400 text-stone-950 shadow-[2px_2px_0px_#1c1917] border-2 border-stone-900'
                : 'text-stone-700 hover:bg-stone-200/70 border border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. 행사 정보 &amp; 포스터</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-emerald-500 text-white shadow-[2px_2px_0px_#1c1917] border-2 border-stone-900'
                : 'text-stone-700 hover:bg-stone-200/70 border border-transparent'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>3. 오시는 길 &amp; 지도 위치 피커</span>
          </button>

          <button
            onClick={() => setActiveTab('seats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'seats'
                ? 'bg-purple-600 text-white shadow-[2px_2px_0px_#1c1917] border-2 border-stone-900'
                : 'text-stone-700 hover:bg-stone-200/70 border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. 자유 비정형 좌석 배치기</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-300 text-stone-950 font-black">
              NEW
            </span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'policies'
                ? 'bg-sky-500 text-white shadow-[2px_2px_0px_#1c1917] border-2 border-stone-900'
                : 'text-stone-700 hover:bg-stone-200/70 border border-transparent'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>5. 티켓팅 오픈 &amp; 워룸 정책</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-stone-800 text-white shadow-[2px_2px_0px_#1c1917] border-2 border-stone-900'
                : 'text-stone-700 hover:bg-stone-200/70 border border-transparent'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>6. 관리자 감사 로그</span>
          </button>

        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: 회원 관리 & 이용 정지 (USER MANAGEMENT) */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 bg-stone-50 border-2 border-stone-900 rounded-2xl shadow-[2px_2px_0px_#1c1917]">
                  <div className="text-[11px] font-bold text-stone-500">전체 회원</div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono mt-0.5">
                    {stats.total.toLocaleString()}명
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border-2 border-emerald-900 rounded-2xl shadow-[2px_2px_0px_#065f46]">
                  <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>정상 활성 회원</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-900 font-mono mt-0.5">
                    {stats.active.toLocaleString()}명
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border-2 border-amber-900 rounded-2xl shadow-[2px_2px_0px_#78350f]">
                  <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>임시 비활성화</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono mt-0.5">
                    {stats.suspended.toLocaleString()}명
                  </div>
                </div>

                <div className="p-3.5 bg-rose-50 border-2 border-rose-900 rounded-2xl shadow-[2px_2px_0px_#9f1239]">
                  <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                    <Ban className="w-3.5 h-3.5" />
                    <span>영구 정지 (Ban)</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-rose-900 font-mono mt-0.5">
                    {stats.banned.toLocaleString()}명
                  </div>
                </div>

                <div className="p-3.5 bg-purple-50 border-2 border-purple-900 rounded-2xl shadow-[2px_2px_0px_#581c87]">
                  <div className="text-[11px] font-bold text-purple-800 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>주최사 파트너</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-purple-900 font-mono mt-0.5">
                    {stats.organizers.toLocaleString()}사
                  </div>
                </div>

                <div className="p-3.5 bg-orange-50 border-2 border-orange-900 rounded-2xl shadow-[2px_2px_0px_#7c2d12]">
                  <div className="text-[11px] font-bold text-orange-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>경고 누적 회원</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-orange-900 font-mono mt-0.5">
                    {stats.withWarning.toLocaleString()}명
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Search & Batch Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border-2 border-stone-200">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'all'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    전체 보기 ({stats.total})
                  </button>
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'active'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    정상 회원 ({stats.active})
                  </button>
                  <button
                    onClick={() => setFilterStatus('suspended')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'suspended'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    임시 비활성화 ({stats.suspended})
                  </button>
                  <button
                    onClick={() => setFilterStatus('banned')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'banned'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-rose-800 hover:bg-rose-50'
                    }`}
                  >
                    영구 정지 ({stats.banned})
                  </button>
                  <button
                    onClick={() => setFilterStatus('organizer')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'organizer'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-purple-800 hover:bg-purple-50'
                    }`}
                  >
                    주최사 ({stats.organizers})
                  </button>
                  <button
                    onClick={() => setFilterStatus('warning')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === 'warning'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white border border-stone-300 text-orange-800 hover:bg-orange-50'
                    }`}
                  >
                    경고 회원 ({stats.withWarning})
                  </button>
                </div>

                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="이름, 닉네임, 이메일, 전화번호 검색..."
                    className="w-full pl-9 pr-4 py-2 bg-white border-2 border-stone-900 rounded-xl text-xs font-bold placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Batch Action Bar */}
              {selectedMemberIds.length > 0 && (
                <div className="bg-stone-900 text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in shadow-[3px_3px_0px_#f59e0b] border-2 border-amber-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-bold text-amber-300">
                      총 {selectedMemberIds.length}명의 회원이 선택되었습니다.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBatchSuspend(7)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl transition-all cursor-pointer"
                    >
                      일괄 7일 정지
                    </button>
                    <button
                      onClick={() => handleBatchSuspend(30)}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-xs rounded-xl transition-all cursor-pointer"
                    >
                      일괄 30일 정지
                    </button>
                    <button
                      onClick={handleBatchBan}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
                    >
                      일괄 영구 정지 (Ban)
                    </button>
                    <button
                      onClick={handleBatchReactivate}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer"
                    >
                      일괄 정상 복원
                    </button>
                    <button
                      onClick={() => setSelectedMemberIds([])}
                      className="px-2.5 py-1.5 text-stone-400 hover:text-white text-xs font-bold ml-1"
                    >
                      선택 해제
                    </button>
                  </div>
                </div>
              )}

              {/* Members Table */}
              <div className="border-2 border-stone-900 rounded-2xl overflow-hidden bg-white shadow-[4px_4px_0px_#1c1917]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-white border-b-2 border-stone-900 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              filteredMembers.length > 0 &&
                              selectedMemberIds.length === filteredMembers.length
                            }
                            onChange={handleSelectAll}
                            className="rounded accent-amber-400 cursor-pointer"
                          />
                        </th>
                        <th className="p-3.5">회원 인적사항</th>
                        <th className="p-3.5">연락처 &amp; 계정</th>
                        <th className="p-3.5">회원 상태 (제재 여부)</th>
                        <th className="p-3.5">권한</th>
                        <th className="p-3.5">경고 누적</th>
                        <th className="p-3.5">누적 예매 / 결제</th>
                        <th className="p-3.5">최근 접속 IP</th>
                        <th className="p-3.5 text-center">관리자 조치</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-12 text-stone-400 font-bold">
                            검색 조건에 일치하는 회원이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map((m) => {
                          const isSelected = selectedMemberIds.includes(m.id);
                          return (
                            <tr
                              key={m.id}
                              className={`hover:bg-amber-50/40 transition-colors ${
                                isSelected ? 'bg-amber-50/80' : ''
                              } ${m.status === 'banned' ? 'bg-rose-50/30' : m.status === 'suspended' ? 'bg-amber-50/30' : ''}`}
                            >
                              <td className="p-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelect(m.id)}
                                  className="rounded accent-amber-400 cursor-pointer"
                                />
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border ${
                                      m.status === 'banned'
                                        ? 'bg-rose-200 text-rose-900 border-rose-400'
                                        : m.status === 'suspended'
                                        ? 'bg-amber-200 text-amber-900 border-amber-400'
                                        : 'bg-stone-100 text-stone-800 border-stone-300'
                                    }`}
                                  >
                                    {m.name.slice(0, 1)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                                      <span>{m.name}</span>
                                      <span className="text-[11px] font-normal text-stone-500">
                                        ({m.nickname})
                                      </span>
                                      {m.passVerified && (
                                        <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-black border border-blue-300">
                                          PASS
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                                      {m.id} · 가입일: {m.createdAt}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="font-mono text-stone-700 text-[11px]">{m.email}</div>
                                <div className="font-mono text-stone-500 text-[10px]">{m.phone}</div>
                              </td>
                              <td className="p-3.5">
                                {m.status === 'active' && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                    정상 이용 중
                                  </span>
                                )}
                                {m.status === 'suspended' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-400">
                                      <Clock className="w-3 h-3 text-amber-700" />
                                      임시 비활성화
                                    </span>
                                    {m.suspensionUntil && (
                                      <div className="text-[10px] font-bold text-amber-800 mt-1">
                                        ~ {m.suspensionUntil}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {m.status === 'banned' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-900 border border-rose-400">
                                      <Ban className="w-3 h-3 text-rose-700" />
                                      영구 정지 (Banned)
                                    </span>
                                    {m.banReason && (
                                      <div className="text-[10px] text-rose-700 mt-1 max-w-[180px] truncate" title={m.banReason}>
                                        {m.banReason}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    m.role === 'admin'
                                      ? 'bg-stone-900 text-white'
                                      : m.role === 'organizer'
                                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                      : 'bg-stone-100 text-stone-700'
                                  }`}
                                >
                                  {m.role === 'admin'
                                    ? '관리자'
                                    : m.role === 'organizer'
                                    ? '주최사'
                                    : '일반회원'}
                                </span>
                              </td>
                              <td className="p-3.5">
                                {m.warningCount === 0 ? (
                                  <span className="text-stone-400 font-mono">0회</span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                      m.warningCount >= 3
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300 font-black animate-pulse'
                                        : 'bg-orange-100 text-orange-800 border border-orange-300'
                                    }`}
                                  >
                                    <AlertTriangle className="w-3 h-3" />
                                    {m.warningCount}회 누적
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 font-mono">
                                <div className="font-bold text-stone-900">
                                  {m.totalBookings}건
                                </div>
                                <div className="text-[11px] text-stone-500">
                                  ₩{m.totalSpent.toLocaleString()}
                                </div>
                              </td>
                              <td className="p-3.5 font-mono text-[11px] text-stone-600">
                                <div>{m.lastLoginIp}</div>
                                <div className="text-[10px] text-stone-400">{m.lastLoginAt}</div>
                              </td>
                              <td className="p-3.5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenProfileModal(m)}
                                    className="p-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-900 transition-colors"
                                    title="회원 상세 정보 &amp; 감사 로그"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {m.status === 'active' ? (
                                    <>
                                      <button
                                        onClick={() => handleOpenSanctionModal(m, 'suspend')}
                                        className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                                        title="임시 비활성화 (7일/30일 등)"
                                      >
                                        비활성화
                                      </button>
                                      <button
                                        onClick={() => handleOpenSanctionModal(m, 'ban')}
                                        className="px-2 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 text-[11px] font-black transition-colors cursor-pointer"
                                        title="영구 정지 (Ban)"
                                      >
                                        정지
                                      </button>
                                      <button
                                        onClick={() => handleOpenSanctionModal(m, 'warning')}
                                        className="p-1 rounded-lg hover:bg-orange-100 text-orange-700 cursor-pointer"
                                        title="경고 +1회 부여"
                                      >
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleReactivateMember(m)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                                      title="정지 해제 및 정상 계정으로 복원"
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                      <span>정상 복구</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 행사 정보 & 포스터 관리 (EVENT CONTENT & POSTER) */}
          {/* ========================================================= */}
          {activeTab === 'event' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-5 bg-white p-6 border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_#1c1917]">
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2 pb-3 border-b-2 border-stone-200">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span>행사 기본 정보 및 타이틀 설정</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-700">행사 공식 타이틀 *</label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 border-stone-900 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                      placeholder="예: 뮤지컬 데스노트 2027 월드투어 서울"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-700">인용 서브 슬로건 / 부제</label>
                    <input
                      type="text"
                      value={eventSubtitle}
                      onChange={(e) => setEventSubtitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">행사 카테고리 태그</label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 border-2 border-stone-900 rounded-xl text-xs font-bold bg-white focus:outline-hidden"
                    >
                      <option value="performance">🎭 공연 (뮤지컬 / 콘서트 / 연극)</option>
                      <option value="popup">🛍️ 팝업스토어 (브랜드 / 캐릭터)</option>
                      <option value="exhibition">🖼️ 전시회 (미디어아트 / 갤러리)</option>
                      <option value="movie">🎬 영화 / GV / 시사회</option>
                      <option value="collab_cafe">☕ 콜라보 카페 / F&amp;B</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">관람 연령 등급</label>
                    <input
                      type="text"
                      value={eventAgeRating}
                      onChange={(e) => setEventAgeRating(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">관람 기간 (시작일)</label>
                    <input
                      type="date"
                      value={eventPeriodStart}
                      onChange={(e) => setEventPeriodStart(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">관람 기간 (종료일)</label>
                    <input
                      type="date"
                      value={eventPeriodEnd}
                      onChange={(e) => setEventPeriodEnd(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">러닝타임 / 인터미션</label>
                    <input
                      type="text"
                      value={eventRunningTime}
                      onChange={(e) => setEventRunningTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">대표 티켓 가격 요약</label>
                    <input
                      type="text"
                      value={eventPriceSummary}
                      onChange={(e) => setEventPriceSummary(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-700">포스터 이미지 URL</label>
                    <input
                      type="text"
                      value={eventPosterUrl}
                      onChange={(e) => setEventPosterUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-mono"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-stone-400">추천 프리셋:</span>
                      {posterPresets.map((p) => (
                        <button
                          key={p.title}
                          type="button"
                          onClick={() => setEventPosterUrl(p.url)}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-amber-100 rounded text-[10px] font-bold text-stone-700 border border-stone-200"
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-700">행사 상세 소개 &amp; 시놉시스</label>
                    <textarea
                      rows={5}
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-sans"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                      캐스팅 라인업 (주요 출연진 &amp; 배역)
                    </h4>
                    <span className="text-[11px] text-stone-400 font-mono">총 {castList.length}명 등록됨</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {castList.map((c) => (
                      <div
                        key={c.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-stone-900"
                      >
                        <span className="text-amber-800">{c.role}</span>
                        <span className="text-stone-400">|</span>
                        <span>{c.actor}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCast(c.id)}
                          className="text-stone-400 hover:text-rose-600 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newRoleInput}
                      onChange={(e) => setNewRoleInput(e.target.value)}
                      placeholder="배역명 (예: 야가미 라이토)"
                      className="w-1/3 px-3 py-1.5 border border-stone-300 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={newActorInput}
                      onChange={(e) => setNewActorInput(e.target.value)}
                      placeholder="배우명 (예: 홍광호)"
                      className="w-1/3 px-3 py-1.5 border border-stone-300 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCast}
                      className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>캐스트 추가</span>
                    </button>
                  </div>
                </div>

              </div>

              <div className="space-y-4">
                <div className="bg-white p-5 border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_#1c1917] space-y-4 sticky top-6">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-xs font-black text-stone-900 uppercase">
                      실시간 행사 상세 프리뷰
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      LIVE PREVIEW
                    </span>
                  </div>

                  <div className="aspect-3/4 rounded-2xl overflow-hidden border-2 border-stone-900 shadow-md relative bg-stone-100">
                    <img
                      src={eventPosterUrl}
                      alt={eventTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src =
                          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-rose-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase shadow-xs">
                      {eventCategory.toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-black text-stone-900 text-base leading-tight">
                      {eventTitle}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-1">{eventSubtitle}</p>
                    <div className="pt-2 text-xs space-y-1 text-stone-600 font-medium">
                      <div>
                        📅 <span className="font-bold text-stone-800">일정:</span> {eventPeriodStart} ~ {eventPeriodEnd}
                      </div>
                      <div>
                        ⏱️ <span className="font-bold text-stone-800">러닝타임:</span> {eventRunningTime}
                      </div>
                      <div>
                        🎫 <span className="font-bold text-stone-800">가격:</span> {eventPriceSummary}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast('💾 행사 기본 정보와 포스터 설정이 임시 저장되었습니다.');
                    }}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
                  >
                    이 내용으로 행사 저장하기
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: 오시는 길 & 대화형 지도 위치 피커 (MAP LOCATION PICKER) */}
          {/* ========================================================= */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              
              {/* Presets Bar */}
              <div className="bg-white p-4 border-2 border-stone-900 rounded-2xl shadow-[3px_3px_0px_#1c1917] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>서울 주요 공연장 &amp; 핫스팟 원클릭 프리셋:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {venuePresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleSelectVenuePreset(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        venueName === preset.name
                          ? 'bg-emerald-600 text-white border-emerald-800 shadow-xs'
                          : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Coordinates & Fields + Live Map Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Form (5 cols) */}
                <div className="lg:col-span-5 bg-white p-6 border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_#1c1917] space-y-4">
                  <h3 className="text-base font-black text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-200">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>행사장 위치 및 지도 피커 정보</span>
                  </h3>

                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>💡 직접 위치 고르기 안내:</strong><br />
                      오른쪽 지도 위를 <strong>클릭</strong>하거나 <strong>노란 핀을 원하는 곳으로 드래그</strong>하면 실시간으로 좌표와 주소가 이 화면에 자동 반영됩니다!
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">행사장 / 공연장 명칭 *</label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 border-stone-900 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                      placeholder="예: 디큐브 링크아트센터 대극장"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">도로명 주소 *</label>
                    <input
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-400 focus:outline-hidden"
                      placeholder="예: 서울특별시 구로구 경인로 662 디큐브시티 7층"
                    />
                  </div>

                  {/* Coordinates */}
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                    <div className="text-[11px] font-bold text-stone-500 flex items-center justify-between">
                      <span>실시간 GPS 좌표 (Latitude / Longitude)</span>
                      <button
                        onClick={() => setMapRefreshKey(Date.now())}
                        className="text-emerald-700 hover:underline flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>지도 새로고침</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-stone-600">위도 (Lat)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={venueLat}
                          onChange={(e) => setVenueLat(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-600">경도 (Lng)</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={venueLng}
                          onChange={(e) => setVenueLng(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">대중교통 지하철 도보 안내</label>
                    <textarea
                      rows={2}
                      value={venueTransit}
                      onChange={(e) => setVenueTransit(e.target.value)}
                      className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">주차 요금 및 관람객 할인 팁</label>
                    <textarea
                      rows={2}
                      value={venueParking}
                      onChange={(e) => setVenueParking(e.target.value)}
                      className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setMapRefreshKey(Date.now());
                      showToast(`📍 [${venueName}] 지도 설정이 저장되었습니다.`);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    지도 위치 확정 및 저장
                  </button>

                </div>

                {/* Live Interactive Map Preview with Click-To-Pick (7 cols) */}
                <div className="lg:col-span-7 bg-white p-5 border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_#1c1917] flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black text-stone-900">
                        대화형 위치 피커 지도 (지도를 클릭하거나 핀을 드래그하세요)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {venueLat.toFixed(4)}, {venueLng.toFixed(4)}
                    </span>
                  </div>

                  {/* Interactive Leaflet Map iframe */}
                  <div className="w-full flex-1 min-h-[480px] rounded-xl overflow-hidden border-2 border-stone-900 shadow-inner relative">
                    <iframe
                      key={mapRefreshKey}
                      src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/venue-map.html?lat=${venueLat}&lng=${venueLng}&name=${encodeURIComponent(
                        venueName
                      )}&address=${encodeURIComponent(venueAddress)}`}
                      className="w-full h-full min-h-[480px] border-0"
                      title="실시간 공연장 오시는 길 지도 & 위치 피커"
                    />
                  </div>

                  <p className="text-[11px] text-stone-500">
                    🎯 지도 상단 검색창에 건물명을 검색하거나, 지도 위 원하는 지점을 클릭하면 실시간으로 핀이 옮겨지며 좌측 입력폼에 위경도가 즉시 연동됩니다.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: 자유 비정형 좌석 배치도 스튜디오 (FREEFORM & ARCHITECTURAL BUILDER) */}
          {/* ========================================================================= */}
          {activeTab === 'seats' && (
            <div className="space-y-6">
              
              {/* Studio Header & Real Architecture Presets */}
              <div className="bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
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

                    <button
                      onClick={() => {
                        showToast('💾 자유 비정형 좌석 배치도와 가격 데이터가 저장되었습니다!');
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-sm cursor-pointer"
                    >
                      배치 확정 및 저장
                    </button>
                  </div>
                </div>

                {/* 5 Real Venue Architecture Presets */}
                <div className="space-y-1.5 pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                      실제 건물 구조별 비정형 프리셋 불러오기 (네모 모양 탈피):
                    </span>
                    <span className="text-[11px] text-stone-400">원클릭으로 극장 고유 구조 자동 생성</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      onClick={() => loadPreset('fan')}
                      className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs font-black text-amber-950">🏛️ 샤롯데 부채꼴 대극장</div>
                      <div className="text-[10px] text-amber-800">3구역 곡선 아치 + OP석</div>
                    </button>

                    <button
                      onClick={() => loadPreset('t_stage')}
                      className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs font-black text-rose-950">🎤 KSPO DOME T자 돌출</div>
                      <div className="text-[10px] text-rose-800">돌출 런웨이 + VIP 펜스석</div>
                    </button>

                    <button
                      onClick={() => loadPreset('balcony')}
                      className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs font-black text-purple-950">🎭 오페라극장 발코니</div>
                      <div className="text-[10px] text-purple-800">좌우 박스석 + 2층 발코니</div>
                    </button>

                    <button
                      onClick={() => loadPreset('island')}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs font-black text-emerald-950">✨ 성수 팝업 아일랜드</div>
                      <div className="text-[10px] text-emerald-800">지그재그 비정형 라운지</div>
                    </button>

                    <button
                      onClick={() => loadPreset('staggered')}
                      className="p-2 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-xl text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs font-black text-sky-950">🎬 지그재그 시야 소극장</div>
                      <div className="text-[10px] text-sky-800">앞사람 가림 없는 교차형</div>
                    </button>
                  </div>
                </div>

                {/* Pricing Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-stone-200">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-300">
                    <div className="text-[10px] font-black text-amber-900">OP석 (무대앞) ₩</div>
                    <input
                      type="number"
                      step={5000}
                      value={seatPrices.op}
                      onChange={(e) => setSeatPrices({ ...seatPrices, op: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-0.5 mt-0.5 bg-white border border-amber-300 rounded font-mono font-bold text-xs"
                    />
                    <div className="text-[10px] text-amber-700 font-mono mt-0.5">{seatCounts.op}석</div>
                  </div>

                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-300">
                    <div className="text-[10px] font-black text-amber-900">VIP석 ₩</div>
                    <input
                      type="number"
                      step={5000}
                      value={seatPrices.vip}
                      onChange={(e) => setSeatPrices({ ...seatPrices, vip: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-0.5 mt-0.5 bg-white border border-amber-300 rounded font-mono font-bold text-xs"
                    />
                    <div className="text-[10px] text-amber-700 font-mono mt-0.5">{seatCounts.vip}석</div>
                  </div>

                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-300">
                    <div className="text-[10px] font-black text-purple-900">R석 ₩</div>
                    <input
                      type="number"
                      step={5000}
                      value={seatPrices.r}
                      onChange={(e) => setSeatPrices({ ...seatPrices, r: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-0.5 mt-0.5 bg-white border border-purple-300 rounded font-mono font-bold text-xs"
                    />
                    <div className="text-[10px] text-purple-700 font-mono mt-0.5">{seatCounts.r}석</div>
                  </div>

                  <div className="p-2 bg-sky-50 rounded-xl border border-sky-300">
                    <div className="text-[10px] font-black text-sky-900">S석 ₩</div>
                    <input
                      type="number"
                      step={5000}
                      value={seatPrices.s}
                      onChange={(e) => setSeatPrices({ ...seatPrices, s: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-0.5 mt-0.5 bg-white border border-sky-300 rounded font-mono font-bold text-xs"
                    />
                    <div className="text-[10px] text-sky-700 font-mono mt-0.5">{seatCounts.s}석</div>
                  </div>

                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-300">
                    <div className="text-[10px] font-black text-emerald-900">A석 ₩</div>
                    <input
                      type="number"
                      step={5000}
                      value={seatPrices.a}
                      onChange={(e) => setSeatPrices({ ...seatPrices, a: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-0.5 mt-0.5 bg-white border border-emerald-300 rounded font-mono font-bold text-xs"
                    />
                    <div className="text-[10px] text-emerald-700 font-mono mt-0.5">{seatCounts.a}석</div>
                  </div>

                  <div className="p-2 bg-pink-50 rounded-xl border border-pink-300">
                    <div className="text-[10px] font-black text-pink-900">휠체어석 ₩</div>
                    <input
                      type="number"
                      step={5000}
                      value={seatPrices.wheelchair}
                      onChange={(e) => setSeatPrices({ ...seatPrices, wheelchair: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-0.5 mt-0.5 bg-white border border-pink-300 rounded font-mono font-bold text-xs"
                    />
                    <div className="text-[10px] text-pink-700 font-mono mt-0.5">{seatCounts.wheelchair}석</div>
                  </div>
                </div>

              </div>

              {/* Main Studio Controls & Visual Freeform Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Col: Tool Palette & Geometry Sliders (1 col) */}
                <div className="space-y-4">
                  
                  {/* Curvature & Architectural Sliders */}
                  <div className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[4px_4px_0px_#1c1917] space-y-3">
                    <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-amber-500" />
                        형태 및 곡률 정밀 조절
                      </span>
                      <span className="text-[10px] text-stone-400">곡선/경사각</span>
                    </h4>

                    {/* Curvature slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-stone-600">
                        <span>부채꼴 곡률 (Curvature):</span>
                        <span className="font-mono text-purple-600">{fanCurvature}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={fanCurvature}
                        onChange={(e) => setFanCurvature(parseInt(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>일자 평면(0%)</span>
                        <span>표준 아치(50%)</span>
                        <span>원형 극장(100%)</span>
                      </div>
                    </div>

                    {/* Wing Angle slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-stone-600">
                        <span>좌/우 날개 안쪽 회전각:</span>
                        <span className="font-mono text-amber-600">{wingAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={wingAngle}
                        onChange={(e) => setWingAngle(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Stagger Toggle */}
                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-stone-800">지그재그 시야각(Stagger)</div>
                        <div className="text-[10px] text-stone-400">짝수 행 교차 오프셋</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isStaggered}
                        onChange={(e) => setIsStaggered(e.target.checked)}
                        className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                      />
                    </div>

                    {/* Quick Sculpt buttons */}
                    <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2">
                      <button
                        onClick={handleAutoSculptFan}
                        className="p-1.5 bg-stone-100 hover:bg-purple-100 rounded-lg text-[11px] font-bold text-stone-800 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title="네모 모서리를 깎아 부채꼴 아치로 성형"
                      >
                        <Scissors className="w-3 h-3 text-purple-600" />
                        <span>부채꼴 깎기</span>
                      </button>

                      <button
                        onClick={handleClearCanvas}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-[11px] font-bold text-rose-800 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        title="모든 좌석을 지우고 백지에서 자유 드로잉"
                      >
                        <Eraser className="w-3 h-3 text-rose-600" />
                        <span>전체 지우기</span>
                      </button>
                    </div>

                  </div>

                  {/* Seat Grade Palette */}
                  <div className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[4px_4px_0px_#1c1917] space-y-3">
                    <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                      좌석 등급 도구 팔레트
                    </h4>

                    <div className="space-y-1.5">
                      <button
                        onClick={() => setSelectedSeatTool('op')}
                        className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          selectedSeatTool === 'op'
                            ? 'bg-amber-200 border-2 border-amber-600 text-amber-950 font-black shadow-xs'
                            : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-700" />
                          OP석 (₩{seatPrices.op.toLocaleString()})
                        </span>
                        <span className="font-mono text-[11px]">{seatCounts.op}석</span>
                      </button>

                      <button
                        onClick={() => setSelectedSeatTool('vip')}
                        className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          selectedSeatTool === 'vip'
                            ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-xs'
                            : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-600" />
                          VIP석 (₩{seatPrices.vip.toLocaleString()})
                        </span>
                        <span className="font-mono text-[11px]">{seatCounts.vip}석</span>
                      </button>

                      <button
                        onClick={() => setSelectedSeatTool('r')}
                        className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          selectedSeatTool === 'r'
                            ? 'bg-purple-100 border-2 border-purple-500 text-purple-950 font-black shadow-xs'
                            : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded bg-purple-400 border border-purple-600" />
                          R석 (₩{seatPrices.r.toLocaleString()})
                        </span>
                        <span className="font-mono text-[11px]">{seatCounts.r}석</span>
                      </button>

                      <button
                        onClick={() => setSelectedSeatTool('s')}
                        className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          selectedSeatTool === 's'
                            ? 'bg-sky-100 border-2 border-sky-500 text-sky-950 font-black shadow-xs'
                            : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded bg-sky-400 border border-sky-600" />
                          S석 (₩{seatPrices.s.toLocaleString()})
                        </span>
                        <span className="font-mono text-[11px]">{seatCounts.s}석</span>
                      </button>

                      <button
                        onClick={() => setSelectedSeatTool('a')}
                        className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          selectedSeatTool === 'a'
                            ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black shadow-xs'
                            : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-600" />
                          A석 (₩{seatPrices.a.toLocaleString()})
                        </span>
                        <span className="font-mono text-[11px]">{seatCounts.a}석</span>
                      </button>

                      <button
                        onClick={() => setSelectedSeatTool('wheelchair')}
                        className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          selectedSeatTool === 'wheelchair'
                            ? 'bg-pink-100 border-2 border-pink-500 text-pink-950 font-black shadow-xs'
                            : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded bg-pink-400 border border-pink-600" />
                          휠체어석 (₩{seatPrices.wheelchair.toLocaleString()})
                        </span>
                        <span className="font-mono text-[11px]">{seatCounts.wheelchair}석</span>
                      </button>

                      <button
                        onClick={() => setSelectedSeatTool('empty')}
                        className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          selectedSeatTool === 'empty'
                            ? 'bg-stone-200 border-2 border-stone-800 text-stone-900 font-black'
                            : 'bg-stone-50 border border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Eraser className="w-3.5 h-3.5 text-stone-600" />
                          좌석 지우개 / 통로 (빈칸)
                        </span>
                        <span className="font-mono text-[11px]">지우개</span>
                      </button>
                    </div>

                    {/* Row bulk buttons */}
                    <div className="pt-2 border-t border-stone-200 space-y-1">
                      <div className="text-[10px] font-bold text-stone-500">행(Row) 일괄 등급 지정:</div>
                      <div className="grid grid-cols-6 gap-1">
                        {seatRows.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleRowBulkAssign(r)}
                            className="py-1 bg-stone-100 hover:bg-amber-200 rounded text-[10px] font-mono font-bold text-stone-800 transition-colors cursor-pointer"
                          >
                            {r}열
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Col: Interactive Visual Non-Rectangular Canvas (3 cols) */}
                <div className="lg:col-span-3 bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-[4px_4px_0px_#1c1917] flex flex-col items-center overflow-hidden">
                  
                  {/* Stage Visual Representation */}
                  <div className="w-full max-w-2xl text-center mb-6 relative">
                    
                    {stageStyle === 'thrust_t' ? (
                      // T-Stage Projection
                      <div className="flex flex-col items-center">
                        <div className="w-full py-2.5 bg-stone-950 text-amber-400 font-black text-xs tracking-widest rounded-t-xl border-2 border-amber-400 uppercase shadow-md">
                          🎤 MAIN CONCERT STAGE
                        </div>
                        {/* Thrust runway extending down */}
                        <div className="w-24 h-12 bg-amber-400/90 border-x-2 border-b-2 border-stone-950 text-[10px] font-black text-stone-950 flex items-center justify-center shadow-inner">
                          RUNWAY ⬇
                        </div>
                      </div>
                    ) : stageStyle === 'runway' ? (
                      // Fashion Runway
                      <div className="flex flex-col items-center">
                        <div className="w-3/4 py-2 bg-stone-950 text-emerald-400 font-black text-xs tracking-widest rounded-xl border-2 border-emerald-400 uppercase">
                          ✨ POP-UP BRAND RUNWAY &amp; MEDIA WALL
                        </div>
                      </div>
                    ) : (
                      // Classic Proscenium Curved Stage
                      <div
                        className="w-full py-2.5 bg-stone-950 text-amber-400 font-black text-xs tracking-widest rounded-2xl border-2 border-amber-400 uppercase shadow-md transition-transform"
                        style={{
                          borderRadius: `${fanCurvature + 16}px ${fanCurvature + 16}px 8px 8px`,
                          transform: `scaleY(${1 + fanCurvature * 0.003})`,
                        }}
                      >
                        🎪 MAIN THEATER STAGE / PROSCENIUM
                      </div>
                    )}

                    <p className="text-[11px] text-stone-400 mt-2">
                      💡 원하는 좌석을 클릭하면 선택된 등급으로 변환되거나 생성/삭제됩니다. (곡률/경사각 슬라이더로 비정형 형태 제어)
                    </p>
                  </div>

                  {/* Freeform Curved & Multi-Block Seat Matrix */}
                  <div className="w-full overflow-x-auto pb-6">
                    <div className="min-w-[700px] max-w-4xl mx-auto space-y-2.5 py-2">
                      {seatRows.map((row, rIdx) => {
                        // Calculate curved transform offset based on curvature slider
                        const curveOffset = Math.sin((rIdx / (seatRows.length - 1)) * Math.PI) * (fanCurvature * 0.15);
                        // Stagger offset for alternate rows
                        const staggerPadding = isStaggered && rIdx % 2 === 1 ? '14px' : '0px';

                        return (
                          <div
                            key={row}
                            className="flex items-center gap-2 transition-transform duration-200"
                            style={{
                              paddingLeft: staggerPadding,
                              transform: `translateY(${curveOffset}px)`,
                            }}
                          >
                            <span className="w-6 text-center font-mono font-bold text-xs text-stone-500 flex-shrink-0">
                              {row}
                            </span>

                            {/* 3 Blocks: Left Wing (angled), Center Block, Right Wing (angled) */}
                            <div className="flex-1 flex items-center justify-between gap-3">
                              
                              {/* Left Wing Block (Cols 1-5, angled inwards) */}
                              <div
                                className="flex items-center gap-1.5 transition-transform duration-200"
                                style={{
                                  transform: `rotate(${wingAngle * 0.7}deg) scale(${1 - (rIdx === 0 ? 0.08 : 0)})`,
                                  transformOrigin: 'right center',
                                }}
                              >
                                {[1, 2, 3, 4, 5].map((col) => {
                                  const seatId = `${row}${col}`;
                                  const grade = currentLayout[seatId] || 'empty';
                                  return (
                                    <SeatCell
                                      key={seatId}
                                      id={seatId}
                                      col={col}
                                      grade={grade}
                                      onClick={() => handleSeatClick(seatId)}
                                    />
                                  );
                                })}
                              </div>

                              {/* Main Center Block (Cols 7-12, curved) */}
                              <div
                                className="flex items-center gap-1.5 transition-transform duration-200"
                                style={{
                                  transform: `scaleX(${1 + (rIdx / seatRows.length) * (fanCurvature * 0.002)})`,
                                }}
                              >
                                {[7, 8, 9, 10, 11, 12].map((col) => {
                                  const seatId = `${row}${col}`;
                                  const grade = currentLayout[seatId] || 'empty';
                                  return (
                                    <SeatCell
                                      key={seatId}
                                      id={seatId}
                                      col={col}
                                      grade={grade}
                                      onClick={() => handleSeatClick(seatId)}
                                    />
                                  );
                                })}
                              </div>

                              {/* Right Wing Block (Cols 14-18, angled inwards) */}
                              <div
                                className="flex items-center gap-1.5 transition-transform duration-200"
                                style={{
                                  transform: `rotate(${-wingAngle * 0.7}deg) scale(${1 - (rIdx === 0 ? 0.08 : 0)})`,
                                  transformOrigin: 'left center',
                                }}
                              >
                                {[14, 15, 16, 17, 18].map((col) => {
                                  const seatId = `${row}${col}`;
                                  const grade = currentLayout[seatId] || 'empty';
                                  return (
                                    <SeatCell
                                      key={seatId}
                                      id={seatId}
                                      col={col}
                                      grade={grade}
                                      onClick={() => handleSeatClick(seatId)}
                                    />
                                  );
                                })}
                              </div>

                            </div>

                            <span className="w-6 text-center font-mono font-bold text-xs text-stone-500 flex-shrink-0">
                              {row}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend Bar */}
                  <div className="w-full flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-stone-200 text-xs text-stone-600 font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-700" />
                      OP석
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-600" />
                      VIP석
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-purple-400 border border-purple-600" />
                      R석
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-sky-400 border border-sky-600" />
                      S석
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-600" />
                      A석
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-pink-400 border border-pink-600" />
                      휠체어석
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <span className="w-3.5 h-3.5 rounded border border-dashed border-stone-300" />
                      통로 / 공백
                    </span>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: 티켓팅 오픈 & 정책 (POLICIES & WAR ROOM) */}
          {/* ========================================================= */}
          {activeTab === 'policies' && (
            <div className="max-w-4xl mx-auto bg-white border-2 border-stone-900 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1c1917] space-y-6">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-200">
                <Clock className="w-5 h-5 text-sky-500" />
                <span>티켓팅 오픈 시간 및 대기열 워룸 정책</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">티켓팅 공식 오픈 일시 *</label>
                  <input
                    type="datetime-local"
                    value={ticketOpenDateTime}
                    onChange={(e) => setTicketOpenDateTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-stone-900 rounded-xl text-xs font-mono font-bold"
                  />
                  <p className="text-[11px] text-stone-400">
                    지정된 시각 정각에 대기열 팝업과 좌석 선택창이 자동 오픈됩니다.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">1인당 최대 예매 한도</label>
                  <select
                    value={maxTicketsPerUser}
                    onChange={(e) => setMaxTicketsPerUser(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 border-2 border-stone-900 rounded-xl text-xs font-bold bg-white"
                  >
                    <option value={2}>1인 2매 제한 (엄격한 암표 방지)</option>
                    <option value={4}>1인 4매 제한 (표준 패밀리/친구 권장)</option>
                    <option value={6}>1인 6매 제한</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">동시 대기열 허용 트래픽 수용치 (TPS)</label>
                  <input
                    type="text"
                    value={queueTrafficCap}
                    onChange={(e) => setQueueTrafficCap(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-mono font-bold"
                  />
                  <p className="text-[11px] text-stone-400">
                    초과 접속 시 팝콘 가상 대기열 화면(대기 번호표)으로 자동 격리됩니다.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enable10sCountdown}
                      onChange={(e) => setEnable10sCountdown(e.target.checked)}
                      className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-black text-stone-900">
                        10초 전 '팝콘 팡팡' 오버레이 카운트다운 강제 활성화
                      </div>
                      <div className="text-[10px] text-stone-500">
                        오픈 10초 전 전체 화면에 노란 팝콘이 팡팡 튀며 심장박동 사운드가 재생됩니다.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableGroupSplit}
                      onChange={(e) => setEnableGroupSplit(e.target.checked)}
                      className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-black text-stone-900">
                        동행 1/N 연석 분할 결제 방 허용
                      </div>
                      <div className="text-[10px] text-stone-500">
                        주최사가 승인한 회차에 한해 친구 초대 후 5분간 좌석을 홀드하고 각자 결제할 수 있습니다.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableWaitlist}
                      onChange={(e) => setEnableWaitlist(e.target.checked)}
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-black text-stone-900">
                        매진 회차 취소표 대기열(Waitlist) 자동 오픈
                      </div>
                      <div className="text-[10px] text-stone-500">
                        전석 매진 즉시 대기열 등록을 열고 취소표 발생 시 알림톡을 순차 발송합니다.
                      </div>
                    </div>
                  </label>
                </div>

              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={() => {
                    showToast('⚡ 티켓팅 워룸 오픈 정책이 최신 상태로 저장되었습니다.');
                  }}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  정책 적용 및 워룸 대기
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: 관리자 감사 로그 & 보안 활동 (AUDIT LOGS) */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <div className="max-w-4xl mx-auto bg-white border-2 border-stone-900 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1c1917] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-stone-900" />
                  <h3 className="text-base font-black text-stone-900">
                    관리자 감사 이력 및 회원 제재 감사 로그 (Audit Trail)
                  </h3>
                </div>
                <button
                  onClick={() => {
                    showToast('📥 감사 로그 CSV 파일이 생성되었습니다.');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>로그 내보내기</span>
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                  <Ban className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-900">[영구 정지] 박준혁 (USR-2026-0199)</span>
                      <span className="text-[10px] text-rose-600 bg-rose-100 px-1.5 py-0.2 rounded font-sans">
                        조치자: 송민재(관리자)
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] font-sans">
                      사유: 비인가 매크로 프로그램 사용 및 10초 내 74회 비정상 좌석 점유 적발 (IP 영구 차단)
                    </p>
                    <div className="text-[10px] text-stone-400">2026.11.11 09:30 · IP 58.120.99.14</div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-900">[임시 비활성화 7일] 최유나 (USR-2026-0412)</span>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-sans">
                        조치자: 시스템(자동)
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] font-sans">
                      사유: 무단 노쇼 3회 연속 누적 및 사전 취소 미이행 페널티 (2026.11.20까지 예매 제한)
                    </p>
                    <div className="text-[10px] text-stone-400">2026.11.13 00:00</div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-900">[대화형 지도 피커 갱신] 디큐브 링크아트센터 대극장</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-sans">
                        조치자: 송민재(관리자)
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] font-sans">
                      위경도 좌표(37.5089, 126.8891) 실시간 드래그 핀 피커 연동 완료
                    </p>
                    <div className="text-[10px] text-stone-400">2026.11.13 14:15</div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
                  <Layers className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-900">[비정형 좌석배치도 로드] 샤롯데씨어터 3구역 부채꼴 아치형</span>
                      <span className="text-[10px] text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded font-sans">
                        조치자: 정하늘(주최사 파트너)
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] font-sans">
                      OP석 ₩190,000 / VIP석 ₩170,000 / R석 ₩140,000 / 곡률 45% 사다리꼴 부채꼴 배치
                    </p>
                    <div className="text-[10px] text-stone-400">2026.11.13 15:02</div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: 제재 적용 모달 (SANCTION / BAN / SUSPEND MODAL) */}
      {/* ========================================================= */}
      {isSanctionModalOpen && sanctionTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-[6px_6px_0px_#1c1917] space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900">
              <div className="flex items-center gap-2">
                {sanctionType === 'ban' ? (
                  <Ban className="w-5 h-5 text-rose-600" />
                ) : sanctionType === 'suspend' ? (
                  <Clock className="w-5 h-5 text-amber-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                )}
                <h3 className="font-black text-stone-900 text-base">
                  회원 이용 제재 설정 ({sanctionTarget.name} 회원)
                </h3>
              </div>
              <button
                onClick={() => setIsSanctionModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-stone-600">
                <span className="font-bold text-stone-900">{sanctionTarget.name} ({sanctionTarget.nickname})</span>
                <span className="font-mono">{sanctionTarget.id}</span>
              </div>
              <div className="text-stone-500 font-mono text-[11px]">{sanctionTarget.email} · {sanctionTarget.phone}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">제재 유형 선택 *</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSanctionType('suspend')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    sanctionType === 'suspend'
                      ? 'bg-amber-100 border-2 border-amber-600 text-amber-950 font-black'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  임시 비활성화
                </button>
                <button
                  type="button"
                  onClick={() => setSanctionType('ban')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    sanctionType === 'ban'
                      ? 'bg-rose-100 border-2 border-rose-600 text-rose-950 font-black'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  영구 정지 (Ban)
                </button>
                <button
                  type="button"
                  onClick={() => setSanctionType('warning')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    sanctionType === 'warning'
                      ? 'bg-orange-100 border-2 border-orange-600 text-orange-950 font-black'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  경고 1회 추가
                </button>
              </div>
            </div>

            {sanctionType === 'suspend' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">비활성화 유지 기간</label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 7, 14, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setSuspensionDays(days)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
                        suspensionDays === days
                          ? 'bg-amber-500 text-stone-950 border-amber-600 font-black'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {days}일간
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">제재 대표 사유 카테고리</label>
              <select
                value={sanctionReasonCategory}
                onChange={(e) => setSanctionReasonCategory(e.target.value)}
                className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl text-xs font-bold bg-white"
              >
                <option value="비인가 매크로/봇 프로그램 사용 의심">🤖 비인가 매크로/봇 프로그램 사용 의심</option>
                <option value="암표 매매 및 부정 티켓 고가 전매 행위">💸 암표 매매 및 부정 티켓 고가 전매 행위</option>
                <option value="상습 노쇼 및 반복적인 직전 취소 악용">🚫 상습 노쇼 및 반복적인 직전 취소 악용</option>
                <option value="티켓팅 대기열 복수 기기 동시 접속 시도">📱 티켓팅 대기열 복수 기기 동시 접속 시도</option>
                <option value="타 이용자 비방 및 악성 허위 사실 유포">🤬 타 이용자 비방 및 악성 허위 사실 유포</option>
                <option value="명의 도용 및 본인 인증 위반">⚠️ 명의 도용 및 본인 인증 위반</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">상세 사유 및 관리자 메모 *</label>
              <textarea
                rows={3}
                value={sanctionDetailMemo}
                onChange={(e) => setSanctionDetailMemo(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                placeholder="회원에게 통보되거나 감사 로그에 영구 기록될 구체적인 사유를 입력하세요."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsSanctionModalOpen(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApplySanction}
                className={`px-5 py-2 text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer ${
                  sanctionType === 'ban'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : sanctionType === 'suspend'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                제재 확정 적용
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: 회원 상세 정보 프로필 모달 (PROFILE MODAL) */}
      {/* ========================================================= */}
      {isProfileModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-stone-900 rounded-3xl max-w-xl w-full p-6 shadow-[6px_6px_0px_#1c1917] space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-stone-900" />
                <h3 className="font-black text-stone-900 text-base">
                  회원 상세 프로필 &amp; 감사 관리 ({selectedMember.name})
                </h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-stone-900 flex items-center gap-2">
                    <span>{selectedMember.name}</span>
                    <span className="text-xs text-stone-500 font-normal">({selectedMember.nickname})</span>
                    {selectedMember.passVerified && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded border border-blue-300">
                        PASS 인증완료
                      </span>
                    )}
                  </h4>
                  <div className="text-xs font-mono text-stone-500 mt-0.5">{selectedMember.id}</div>
                </div>

                <div>
                  {selectedMember.status === 'active' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      정상 계정
                    </span>
                  )}
                  {selectedMember.status === 'suspended' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      임시 비활성화
                    </span>
                  )}
                  {selectedMember.status === 'banned' && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300">
                      영구 정지
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-stone-200">
                <div>
                  <span className="text-stone-500">이메일:</span>{' '}
                  <span className="font-mono font-bold">{selectedMember.email}</span>
                </div>
                <div>
                  <span className="text-stone-500">연락처:</span>{' '}
                  <span className="font-mono font-bold">{selectedMember.phone}</span>
                </div>
                <div>
                  <span className="text-stone-500">가입일:</span>{' '}
                  <span className="font-mono">{selectedMember.createdAt}</span>
                </div>
                <div>
                  <span className="text-stone-500">최근 접속 IP:</span>{' '}
                  <span className="font-mono">{selectedMember.lastLoginIp}</span>
                </div>
                <div>
                  <span className="text-stone-500">누적 예매 / 결제액:</span>{' '}
                  <span className="font-mono font-bold text-stone-900">
                    {selectedMember.totalBookings}건 / ₩{selectedMember.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500">보유 포인트:</span>{' '}
                  <span className="font-mono font-bold text-amber-600">
                    {selectedMember.points.toLocaleString()}P
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">회원 시스템 권한 (Role)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleChangeRole(selectedMember, 'user')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    selectedMember.role === 'user'
                      ? 'bg-stone-900 text-white font-black'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  일반 회원 (User)
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeRole(selectedMember, 'organizer')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    selectedMember.role === 'organizer'
                      ? 'bg-purple-600 text-white font-black'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  주최사 파트너 (Organizer)
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeRole(selectedMember, 'admin')}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    selectedMember.role === 'admin'
                      ? 'bg-rose-600 text-white font-black'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  운영 관리자 (Admin)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">관리자 전용 특이사항 메모</label>
              <textarea
                rows={3}
                value={memberMemoDraft}
                onChange={(e) => setMemberMemoDraft(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                placeholder="해당 회원에 대한 운영팀 전용 메모를 입력하세요 (이용자에게 노출되지 않음)"
              />
              <button
                type="button"
                onClick={handleSaveMemberMemo}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                메모 저장
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-200">
              <h5 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                관리자 조치 및 인증 이력
              </h5>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedMember.recentActionLog && selectedMember.recentActionLog.length > 0 ? (
                  selectedMember.recentActionLog.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-stone-50 border border-stone-200 rounded-lg text-[11px] flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-stone-900">{log.action}</span>
                        <span className="text-stone-400 ml-2 font-mono">{log.date}</span>
                      </div>
                      <span className="text-[10px] text-stone-600 bg-stone-200 px-1.5 py-0.2 rounded">
                        {log.adminName}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-stone-400 py-3 text-center">
                    등록된 조치 이력이 없습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// Seat Cell Component for Freeform Matrix
interface SeatCellProps {
  id: string;
  col: number;
  grade: CustomSeatGrade;
  onClick: () => void;
}

const SeatCell: React.FC<SeatCellProps> = ({ id, col, grade, onClick }) => {
  let bgClass = 'border border-dashed border-stone-200 bg-transparent text-stone-300 opacity-40 hover:opacity-90';
  let label = '';

  if (grade === 'op') {
    bgClass = 'bg-amber-400 border-2 border-amber-600 text-amber-950 font-black shadow-xs hover:scale-110';
    label = 'OP';
  } else if (grade === 'vip') {
    bgClass = 'bg-amber-300 border-2 border-amber-500 text-amber-950 font-black shadow-xs hover:scale-110';
    label = `${col}`;
  } else if (grade === 'r') {
    bgClass = 'bg-purple-300 border-2 border-purple-500 text-purple-950 font-black shadow-xs hover:scale-110';
    label = `${col}`;
  } else if (grade === 's') {
    bgClass = 'bg-sky-300 border-2 border-sky-500 text-sky-950 font-black shadow-xs hover:scale-110';
    label = `${col}`;
  } else if (grade === 'a') {
    bgClass = 'bg-emerald-300 border-2 border-emerald-500 text-emerald-950 font-black shadow-xs hover:scale-110';
    label = `${col}`;
  } else if (grade === 'wheelchair') {
    bgClass = 'bg-pink-300 border-2 border-pink-500 text-pink-950 font-black shadow-xs hover:scale-110';
    label = '♿';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] transition-all cursor-pointer select-none ${bgClass}`}
      title={`${id} 좌석 (${grade.toUpperCase()}) - 클릭하여 등급 변경 또는 토글`}
    >
      {label}
    </button>
  );
};
