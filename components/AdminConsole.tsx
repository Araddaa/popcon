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
  Store,
  Coffee,
  Radio,
  Code2,
} from 'lucide-react';
import { AdminMember, UserStatus, UserRole } from '../types';
import { initialAdminMembers, venuePresets, posterPresets, AdminVenuePreset } from '../data/adminMockData';
import { UniversalSpaceStudio } from './UniversalSpaceStudio';

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
  const [eventCategory, setEventCategory] = useState<'performance' | 'popup' | 'exhibition' | 'movie' | 'collab_cafe' | 'festival'>('performance');
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
  const [venueName, setVenueName] = useState('잠실 샤롯데씨어터');
  const [venueAddress, setVenueAddress] = useState('서울특별시 송파구 올림픽로 240');
  const [venueLat, setVenueLat] = useState<number>(37.5111);
  const [venueLng, setVenueLng] = useState<number>(127.0982);
  const [venueTransit, setVenueTransit] = useState('지하철 2·8호선 잠실역 3번 출구 도보 5분 (롯데월드 호텔 방면)');
  const [venueParking, setVenueParking] = useState('샤롯데씨어터 지하 주차장 4시간 4,000원 (로비 무인 정산기 등록 필수)');
  const [mapRefreshKey, setMapRefreshKey] = useState<number>(Date.now());
  const [isKopisModalOpen, setIsKopisModalOpen] = useState(false);
  const [selectedKopisData, setSelectedKopisData] = useState<AdminVenuePreset>(venuePresets[0]);

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

  const handleSelectVenuePreset = (preset: AdminVenuePreset) => {
    setVenueName(preset.name);
    setVenueAddress(preset.address);
    setVenueLat(preset.lat);
    setVenueLng(preset.lng);
    setVenueTransit(preset.transit);
    setVenueParking(preset.parking);
    setMapRefreshKey(Date.now());
    if (preset.category) {
      setEventCategory(preset.category);
    }
    setSelectedKopisData(preset);
    showToast(`🏛️ [${preset.name}] KOPIS/시설 데이터(${preset.seatScaleDesc}) 및 위치 정보가 자동 반영되었습니다.`);
  };

  // =========================================================================
  // 4. UNIVERSAL SPACE & SEATING STUDIO (5대 문화공간 통합 관리)
  // =========================================================================
  // (비정형 극장 좌석배치, 팝업스토어 부스·동선, 콜라보카페, 전시회, 페스티벌 엔진은 UniversalSpaceStudio가 전담)

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
              onClick={() => setIsKopisModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs sm:text-sm rounded-xl border border-amber-400/40 cursor-pointer transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>KOPIS API 연동 안내</span>
            </button>

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

        {/* Executive Ops Live Bar */}
        <div className="bg-stone-950 text-white px-5 sm:px-8 py-2.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap font-mono">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span>관리 회원:</span>
              <strong className="text-white">12,840명</strong>
              <span className="text-[10px] text-rose-400 font-bold">(제재 4건)</span>
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>실시간 트래픽:</span>
              <strong className="text-emerald-400">3,820 req/s</strong>
              <span className="text-[10px] text-emerald-300 font-bold">(정상 99.98%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>범용 공간 엔진:</span>
              <strong className="text-purple-300">공연 · 팝업 · 카페 · 전시 · 페스티벌</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
              <span>🏛️ KOPIS 공공데이터 연동</span>
            </span>
            <span className="hidden sm:inline font-mono">|</span>
            <span className="hidden sm:inline font-mono text-stone-400">POP-CON Smart Mapper v2.5</span>
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
            <span>4. 범용 공간 &amp; 좌석 스튜디오</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-300 text-stone-950 font-black">
              5대 공간 지원
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
                      <option value="collab_cafe">☕ 콜라보 카페 / F&amp;B</option>
                      <option value="exhibition">🖼️ 전시회 (미디어아트 / 갤러리)</option>
                      <option value="festival">🏕️ 야외 페스티벌 (뮤직 / 푸드)</option>
                      <option value="movie">🎬 영화 / GV / 시사회</option>
                    </select>
                  </div>

                  {/* Category to Space Studio Quick Link */}
                  <div className="sm:col-span-2 bg-purple-50 border-2 border-purple-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {eventCategory === 'popup' ? '🛍️' : eventCategory === 'collab_cafe' ? '☕' : eventCategory === 'exhibition' ? '🖼️' : eventCategory === 'festival' ? '🏕️' : '🎭'}
                      </span>
                      <div>
                        <div className="text-xs font-black text-purple-950">
                          맞춤 공간 엔진 연동: [{eventCategory === 'popup' ? '🛍️ 팝업스토어 (부스/타임정원)' : eventCategory === 'collab_cafe' ? '☕ 콜라보 카페 (테이블배치)' : eventCategory === 'exhibition' ? '🖼️ 전시회 (섹션/도슨트)' : eventCategory === 'festival' ? '🏕️ 야외 페스티벌 (스탠딩/피크닉)' : '🎭 공연·뮤지컬 (지정좌석)'}]
                        </div>
                        <div className="text-[11px] text-purple-700 mt-0.5">
                          {eventCategory === 'popup' && 'MD판매대, 포토존, 럭키가챠, DIY존 및 30분 타임정원을 설계합니다.'}
                          {eventCategory === 'collab_cafe' && '2인/4인 부스석, 바 카운터 및 70분 타임제 테이블 맵을 설정합니다.'}
                          {eventCategory === 'exhibition' && '1~5전시실 룸 테마, 일방통행 관람동선 및 도슨트 투어를 설계합니다.'}
                          {eventCategory === 'festival' && '메인 스테이지, 스탠딩 A/B 구역 및 피크닉 돗자리 존을 배치합니다.'}
                          {eventCategory === 'performance' && '부채꼴 아치, T자 돌출무대, 발코니 및 VIP/R/S 좌석을 배치합니다.'}
                          {eventCategory === 'movie' && '스크린 및 전석 지정석 시야각을 배치합니다.'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('seats')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 transition-transform active:scale-95"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>맞춤 공간 설계기로 이동</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
              
              {/* KOPIS API & Venue Presets Bar */}
              <div className="bg-white p-5 border-2 border-stone-900 rounded-3xl shadow-[4px_4px_0px_#1c1917] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏛️</span>
                    <div>
                      <h4 className="font-black text-sm text-stone-900">
                        KOPIS 공공데이터 &amp; 스마트 베뉴 공간 데이터베이스 (좌석·도면 자동 연동)
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        장소를 선택하면 공공 API 시설코드 및 실제 극장 좌석도 / 팝업스토어 부스 도면이 자동 동기화됩니다.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsKopisModalOpen(true)}
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-xl border border-stone-900 shadow-xs cursor-pointer transition-all"
                  >
                    <Radio className="w-3.5 h-3.5 text-stone-950" />
                    <span>KOPIS API 연동 원리 확인</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {venuePresets.map((preset) => {
                    const isSelected = venueName === preset.name;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleSelectVenuePreset(preset)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 shadow-[3px_3px_0px_#059669] ring-2 ring-emerald-400'
                            : 'bg-stone-50 border-stone-300 hover:border-stone-900 hover:bg-white text-stone-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">
                              {preset.category === 'popup' ? '🛍️' : preset.category === 'collab_cafe' ? '☕' : preset.category === 'exhibition' ? '🖼️' : preset.category === 'festival' ? '🏕️' : '🎭'}
                            </span>
                            <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                              isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                            }`}>
                              {preset.kopisId?.startsWith('FC') ? `KOPIS:${preset.kopisId}` : '매퍼연동'}
                            </span>
                          </div>
                          <div className="font-black text-xs line-clamp-1">{preset.name}</div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">{preset.seatScaleDesc}</div>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-stone-200 flex items-center justify-between text-[10px] font-bold">
                          <span className="text-emerald-700 font-mono line-clamp-1">{preset.layoutPresetName}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-[11px] text-emerald-950 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      현재 선택: <strong>[{venueName}]</strong> — {selectedKopisData?.apiSyncStatus || '동기화 완료'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('seats')}
                    className="font-bold text-emerald-800 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <span>이 베뉴의 공간 배치도 보기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
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
          {/* TAB 4: 유니버설 공간 & 배치 스튜디오 (UNIVERSAL SPACE & SEAT STUDIO) */}
          {/* ========================================================================= */}
          {activeTab === 'seats' && (
            <UniversalSpaceStudio
              venueName={venueName}
              eventCategory={eventCategory}
              onShowToast={showToast}
            />
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

      {/* ========================================================= */}
      {/* KOPIS API EXPLAINER & TESTER MODAL */}
      {/* ========================================================= */}
      {isKopisModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-stone-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_#1c1917] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xl shadow-inner">
                  🏛️
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    KOPIS (공연예술통합전산망) 공공 API &amp; 좌석 데이터 연동 아키텍처
                  </h3>
                  <p className="text-xs text-stone-500">
                    공공데이터포털 KOPIS Open API 현황 및 팝업/공연장 공간 매핑 가이드
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsKopisModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Q&A 1: API에서 좌석 좌표를 받아올 수 있는가? */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-2">
              <div className="font-black text-amber-900 text-sm flex items-center gap-2">
                <span>❓ Q. 특정 장소를 정하면 그 장소의 실제 좌석 배치도를 받아올 수 있는 공식 API가 있을까요?</span>
              </div>
              <div className="text-xs text-amber-950 leading-relaxed space-y-2 font-medium">
                <p>
                  <strong>결론:</strong> 문화체육관광부 <strong>KOPIS(공연예술통합전산망) Open API</strong>는 전국의 공연시설명, 주소, <strong>총 객석수 (seatscale)</strong>, <strong>장애인석 규모</strong>, 무대 규모 등의 메타데이터는 공식 제공하지만, <strong>개별 좌석의 2D/3D 좌표나 세부 좌석배치도 도면은 API로 제공되지 않습니다.</strong>
                </p>
                <p>
                  <strong>이유:</strong> 극장별 상세 좌석배치도와 시야각, 1열 1번 단위의 실시간 예매 시스템은 각 예매처(인터파크, 예스24, 티켓링크, 멜론티켓 등) 및 전문 CAD 도면 개발사의 <strong>영업 비밀이자 고유 상용 자산</strong>이기 때문입니다.
                </p>
                <p>
                  <strong>팝업스토어 / 전시회의 경우:</strong> 성수동 팝업스토어나 백화점 팝업존은 <strong>고정된 좌석이 없는 가변 임대 공간(Flex Space)</strong>입니다. 매 행사마다 가벽, MD 판매대, 포토존, 대기열이 완전히 새로 구축되므로 물리적으로 사전에 정의된 좌석 API가 존재할 수 없습니다.
                </p>
              </div>
            </div>

            {/* Solution: How POP-CON Solves It */}
            <div className="bg-stone-900 text-white rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-black text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>POP-CON의 스마트 해결책: [공공 API 메타데이터 + 스마트 베뉴 매퍼 v2.5]</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                POP-CON은 KOPIS의 공식 시설 코드(<code>mt10id</code>)와 주소/총좌석수를 수집한 후, 당사의 <strong>스마트 베뉴 공간 데이터베이스</strong>와 1:1 매핑하여 <strong>장소 선택 즉시 실제 도면(샤롯데 부채꼴 1,241석, KSPO T자 아레나, 성수 에스팩토리 팝업 부스 등)을 100% 자동 렌더링</strong>합니다.
              </p>
            </div>

            {/* Live API Response Simulator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-stone-800">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-600" />
                  <span>실시간 KOPIS API 응답 페이로드 시뮬레이션 (현재 선택: {selectedKopisData?.name || venueName})</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  HTTP 200 OK
                </span>
              </div>

              <div className="bg-stone-950 text-stone-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border-2 border-stone-800">
                <pre>{JSON.stringify({
                  request: {
                    endpoint: "http://www.kopis.or.kr/openApi/restful/prfplc",
                    serviceKey: "POPCON_SECRET_KEY_PROD",
                    id: selectedKopisData?.kopisId || "FC080001",
                  },
                  response: {
                    fcltynm: selectedKopisData?.name || venueName,
                    mt10id: selectedKopisData?.kopisId || "FC080001",
                    seatscale: selectedKopisData?.totalSeats || 1241,
                    seatScaleDesc: selectedKopisData?.seatScaleDesc || "1,241석 (1층 725석 / 2층 516석)",
                    adres: selectedKopisData?.address || venueAddress,
                    la: selectedKopisData?.lat || venueLat,
                    lo: selectedKopisData?.lng || venueLng,
                    category: selectedKopisData?.category || eventCategory,
                    popconAutoMapping: {
                      status: "SUCCESS_200",
                      mappedPreset: selectedKopisData?.layoutPresetName || "부채꼴 대극장 3구역",
                      spaceMode: selectedKopisData?.spaceMode || "theatre",
                    }
                  }
                }, null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIsKopisModalOpen(false);
                  setActiveTab('seats');
                }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer"
              >
                현재 선택된 공간 배치기 바로 확인하기 →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
