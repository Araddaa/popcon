'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { CultureEvent, EventCategory } from '../types';
import { EventCard } from './EventCard';
import {
  MapPin,
  Navigation,
  Search,
  Compass,
  Clock,
  SlidersHorizontal,
  ExternalLink,
  Ticket,
  RotateCcw,
  Loader2,
  Map as MapIcon,
  LocateFixed,
} from 'lucide-react';

interface NearbyViewProps {
  events: CultureEvent[];
  onOpenEvent: (event: CultureEvent) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onGoToGroupBooking: (event: CultureEvent) => void;
}

interface EventGeoMeta {
  lat: number;
  lng: number;
  address: string;
  subway: string;
}

// 행사별 정밀 위경도 및 오시는 길 좌표 사전
const EVENT_COORDS_MAP: Record<number, EventGeoMeta> = {
  99: {
    lat: 37.5089,
    lng: 126.8891,
    address: '서울 구로구 경인로 662 디큐브시티 7층',
    subway: '1·2호선 신도림역 1·5번 출구 직결 (도보 2분)',
  },
  1: {
    lat: 37.5408,
    lng: 127.0598,
    address: '서울 성동구 연무장15길 11 에스팩토리 D동',
    subway: '2호선 성수역 3번 출구 (도보 4분)',
  },
  4: {
    lat: 37.5254,
    lng: 127.0355,
    address: '서울 강남구 압구정로46길 50 (하우스 도산 · 한남 플래그십)',
    subway: '수인분당선 압구정로데오역 5번 출구 (도보 7분)',
  },
  10: {
    lat: 37.5446,
    lng: 127.0578,
    address: '서울 성동구 성수이로14길 14 성수연방',
    subway: '2호선 성수역 3번 출구 (도보 3분)',
  },
  20: {
    lat: 37.5113,
    lng: 127.0998,
    address: '서울 송파구 올림픽로 240 샤롯데씨어터',
    subway: '2·8호선 잠실역 3번 출구 (도보 5분)',
  },
  21: {
    lat: 37.4789,
    lng: 127.0125,
    address: '서울 서초구 남부순환로 2406 예술의전당 콘서트홀',
    subway: '3호선 남부터미널역 5번 출구 (셔틀/도보 10분)',
  },
  22: {
    lat: 37.5815,
    lng: 127.0023,
    address: '서울 종로구 대학로8가길 85 대학로 TOM 1관',
    subway: '4호선 혜화역 2번 출구 (도보 4분)',
  },
  2: {
    lat: 37.5453,
    lng: 127.0655,
    address: '서울 성동구 아차산로17길 49 생각공장 B1 그라운드시소 성수',
    subway: '2호선 성수역 2번 출구 (도보 8분)',
  },
  5: {
    lat: 37.5258,
    lng: 126.9284,
    address: '서울 영등포구 여의대로 108 더현대 서울 6F ALT.1',
    subway: '5·9호선 여의도역 지하 무빙워크 연결 (도보 5분)',
  },
  6: {
    lat: 37.5786,
    lng: 126.9801,
    address: '서울 종로구 삼청로 30 국립현대미술관 서울',
    subway: '3호선 안국역 1번 출구 (도보 10분)',
  },
  30: {
    lat: 37.5509,
    lng: 126.9211,
    address: '서울 마포구 어울마당로 65 KT&G 상상마당 시네마',
    subway: '2호선 홍대입구역 9번 출구 (도보 8분)',
  },
  31: {
    lat: 37.5697,
    lng: 126.9721,
    address: '서울 종로구 새문안로 68 흥국생명빌딩 B2 씨네큐브',
    subway: '5호선 광화문역 6번 출구 (도보 3분)',
  },
  40: {
    lat: 37.5462,
    lng: 127.0496,
    address: '서울 성동구 서울숲2길 18 성수 아틀리에 2F',
    subway: '수인분당선 서울숲역 5번 출구 (도보 5분)',
  },
  41: {
    lat: 37.5574,
    lng: 126.9255,
    address: '서울 마포구 양화로 188 AK PLAZA 홍대 4F',
    subway: '2호선·공항철도 홍대입구역 4번 출구 직결',
  },
  50: {
    lat: 37.5422,
    lng: 127.0545,
    address: '서울 성동구 연무장길 일대',
    subway: '2호선 성수역 3·4번 출구 앞',
  },
  51: {
    lat: 35.1532,
    lng: 129.1186,
    address: '부산 수영구 광안해변로 219 광안리 해변 일대',
    subway: '부산 2호선 광안역 3번 출구 (도보 10분)',
  },
};

function getEventGeo(ev: CultureEvent): EventGeoMeta {
  if (EVENT_COORDS_MAP[ev.id]) return EVENT_COORDS_MAP[ev.id];
  const loc = `${ev.location} ${ev.spot}`;
  if (loc.includes('성수')) return { lat: 37.5425, lng: 127.0573, address: ev.spot, subway: '2호선 성수역 인근' };
  if (loc.includes('더현대') || loc.includes('여의도')) return { lat: 37.5258, lng: 126.9284, address: ev.spot, subway: '5·9호선 여의도역' };
  if (loc.includes('홍대')) return { lat: 37.5546, lng: 126.9235, address: ev.spot, subway: '2호선 홍대입구역' };
  if (loc.includes('잠실')) return { lat: 37.5113, lng: 127.0998, address: ev.spot, subway: '2호선 잠실역' };
  if (loc.includes('부산')) return { lat: 35.1532, lng: 129.1186, address: ev.spot, subway: '광안역 인근' };
  return { lat: 37.5665, lng: 126.9780, address: ev.spot, subway: '서울 중심부' };
}

// Haversine distance (km)
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatShortDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round(km * 1000))}m`;
  return `${km.toFixed(1)}km`;
}

function formatWalkOrTransit(km: number): string {
  if (km < 1.2) {
    const mins = Math.max(1, Math.round((km * 1000) / 70));
    return `도보 ${mins}분 (${Math.max(50, Math.round(km * 1000))}m)`;
  }
  if (km < 25) {
    const mins = Math.max(8, Math.round(km * 2.5 + 4));
    return `대중교통 ${mins}분 (${km.toFixed(1)}km)`;
  }
  return `${km.toFixed(0)}km (광역)`;
}

const HOTSPOT_PRESETS = [
  { id: 'all_seoul', name: '서울 전역', emoji: '🗺️', lat: 37.5425, lng: 127.0573, defaultRadius: 0 },
  { id: '성수', name: '성수 / 서울숲', emoji: '🍓', lat: 37.5425, lng: 127.0573, defaultRadius: 3000 },
  { id: '더현대', name: '더현대 여의도', emoji: '🏬', lat: 37.5258, lng: 126.9284, defaultRadius: 3000 },
  { id: '홍대', name: '홍대 / 연남', emoji: '🍊', lat: 37.5546, lng: 126.9235, defaultRadius: 3000 },
  { id: '잠실', name: '잠실 / 샤롯데', emoji: '🎭', lat: 37.5113, lng: 127.0998, defaultRadius: 3000 },
  { id: '신도림', name: '신도림 디큐브', emoji: '🔥', lat: 37.5089, lng: 126.8891, defaultRadius: 5000 },
  { id: '광화문', name: '광화문 / 대학로', emoji: '🏛️', lat: 37.5758, lng: 126.9825, defaultRadius: 3000 },
  { id: '한남', name: '한남 / 도산', emoji: '🥑', lat: 37.5254, lng: 127.0355, defaultRadius: 3000 },
  { id: '서초', name: '서초 / 예술의전당', emoji: '🎻', lat: 37.4789, lng: 127.0125, defaultRadius: 5000 },
  { id: '부산', name: '부산 광안리', emoji: '🌊', lat: 35.1532, lng: 129.1186, defaultRadius: 5000 },
];

const EXTRA_PLACE_KEYWORDS: { keywords: string[]; name: string; lat: number; lng: number }[] = [
  { keywords: ['코엑스', '삼성역', '강남역'], name: '삼성역 / 코엑스', lat: 37.5126, lng: 127.0588 },
  { keywords: ['ddp', '동대문'], name: '동대문 DDP', lat: 37.5668, lng: 127.0096 },
  { keywords: ['용산', '아이파크'], name: '용산 아이파크몰', lat: 37.5298, lng: 126.9647 },
  { keywords: ['올림픽공원', 'kspo'], name: '올림픽공원 KSPO', lat: 37.5194, lng: 127.1275 },
  { keywords: ['블루스퀘어', '한강진'], name: '한강진 블루스퀘어', lat: 37.5408, lng: 127.0026 },
  { keywords: ['명동', '을지로', '서울역'], name: '을지로 / 명동', lat: 37.5665, lng: 126.9780 },
];

const CATEGORY_FILTERS: { id: EventCategory; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'popup', label: '팝업스토어' },
  { id: 'performance', label: '공연·뮤지컬' },
  { id: 'exhibition', label: '전시' },
  { id: 'collab_cafe', label: '콜라보카페' },
  { id: 'movie', label: '영화' },
  { id: 'festival', label: '축제' },
];

const RADIUS_OPTIONS = [
  { label: '전체 거리', meters: 0 },
  { label: '500m', meters: 500 },
  { label: '1km', meters: 1000 },
  { label: '3km', meters: 3000 },
  { label: '5km', meters: 5000 },
];

export const NearbyView: React.FC<NearbyViewProps> = ({
  events,
  onOpenEvent,
  wishlist,
  onToggleWishlist,
  onGoToGroupBooking,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [activeSpotId, setActiveSpotId] = useState<string>('성수');
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number; label: string }>({
    lat: 37.5425,
    lng: 127.0573,
    label: '성수 / 서울숲',
  });
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number; focusEvent?: boolean }>({
    lat: 37.5425,
    lng: 127.0573,
  });
  const [radiusMeters, setRadiusMeters] = useState<number>(3000);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'popular'>('distance');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // 각 행사에 좌표 및 현재 기준점으로부터 거리 부여
  const eventsWithDistance = useMemo(() => {
    return events.map((ev) => {
      const geo = getEventGeo(ev);
      const distanceKm = getDistanceKm(myLocation.lat, myLocation.lng, geo.lat, geo.lng);
      return {
        event: ev,
        geo,
        distanceKm,
        distanceShort: formatShortDistance(distanceKm),
        distanceWalk: formatWalkOrTransit(distanceKm),
      };
    });
  }, [events, myLocation]);

  // 반경 · 카테고리 · 정렬 적용
  const filteredItems = useMemo(() => {
    const list = eventsWithDistance.filter((item) => {
      if (categoryFilter !== 'all' && item.event.category !== categoryFilter) return false;
      if (radiusMeters > 0 && item.distanceKm * 1000 > radiusMeters) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return (a.event.ranking || 99) - (b.event.ranking || 99);
    });

    return list;
  }, [eventsWithDistance, categoryFilter, radiusMeters, sortBy]);

  // 현재 선택된 행사 (현재 필터된 목록 안에서 우선 선택)
  const selectedItem = useMemo(() => {
    if (selectedEventId !== null) {
      const inFiltered = filteredItems.find((i) => i.event.id === selectedEventId);
      if (inFiltered) return inFiltered;
    }
    return filteredItems[0] || null;
  }, [selectedEventId, filteredItems]);

  const sendMapUpdate = useCallback(
    (flyTo: boolean, overrideCenter?: { lat: number; lng: number; focusEvent?: boolean }) => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      const center = overrideCenter || mapCenter;

      win.postMessage(
        {
          type: 'POPCON_EXPLORE_UPDATE',
          flyTo,
          payload: {
            centerLat: center.lat,
            centerLng: center.lng,
            focusEvent: !!center.focusEvent,
            myLat: myLocation.lat,
            myLng: myLocation.lng,
            myLabel: myLocation.label,
            radiusMeters,
            selectedEventId: selectedItem?.event.id ?? null,
            events: filteredItems.map((item) => ({
              id: item.event.id,
              title: item.event.title,
              category: item.event.category,
              categoryName: item.event.categoryName,
              lat: item.geo.lat,
              lng: item.geo.lng,
              spot: item.event.spot,
              dDay: item.event.dDay,
              distanceText: item.distanceShort,
            })),
          },
        },
        '*'
      );
    },
    [filteredItems, mapCenter, myLocation, radiusMeters, selectedItem]
  );

  // 지도 iframe 준비 또는 필터 변경 시 마커 동기화
  const shouldFlyNextRef = useRef(true);
  useEffect(() => {
    if (!mapReady) return;
    sendMapUpdate(shouldFlyNextRef.current);
    shouldFlyNextRef.current = false;
  }, [mapReady, filteredItems, myLocation, radiusMeters, selectedEventId, mapCenter, sendMapUpdate]);

  // 브라우저 GPS 내 주변 찾기
  const handleFindMyLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setStatusMessage('이 브라우저에서는 GPS를 지원하지 않아 성수역 기준으로 탐색합니다.');
      return;
    }

    setIsLocating(true);
    setStatusMessage('현재 GPS 위치를 확인하는 중...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        setIsLocating(false);
        setActiveSpotId('gps');
        setMyLocation({ lat, lng, label: '내 현재 위치 (GPS)' });
        setMapCenter({ lat, lng });

        // 현재 GPS 주변 5km 내 행사가 없으면 전체 거리로 자동 확장하여 가장 가까운 곳을 보여줌
        const nearbyCount = events.filter(
          (ev) => getDistanceKm(lat, lng, getEventGeo(ev).lat, getEventGeo(ev).lng) <= 5
        ).length;

        shouldFlyNextRef.current = true;
        if (nearbyCount === 0) {
          setRadiusMeters(0);
          setStatusMessage(
            `GPS 확인 완료 (${lat.toFixed(3)}, ${lng.toFixed(3)}) — 5km 내 행사가 없어 가까운 순으로 전체 행사를 표시합니다.`
          );
        } else {
          setRadiusMeters(5000);
          setStatusMessage(`내 현재 위치(GPS) 기준 반경 5km 내 ${nearbyCount}개 행사를 찾았습니다.`);
        }
      },
      () => {
        setIsLocating(false);
        // 위치 권한 거부/타임아웃 시 현재 중심 거점 재정렬
        shouldFlyNextRef.current = true;
        setMapCenter({ lat: myLocation.lat, lng: myLocation.lng });
        sendMapUpdate(true, { lat: myLocation.lat, lng: myLocation.lng });
        setStatusMessage(
          `위치 권한이 허용되지 않아 '${myLocation.label}' 기준으로 주변 행사를 탐색합니다. (위 거점 버튼을 눌러 기준 위치를 바꿀 수 있어요)`
        );
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
    );
  }, [events, myLocation, sendMapUpdate]);

  // iframe으로부터 오는 이벤트 수신
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!e.data || !e.data.type) return;

      if (e.data.type === 'POPCON_EXPLORE_READY') {
        shouldFlyNextRef.current = true;
        setMapReady(true);
      } else if (e.data.type === 'POPCON_EXPLORE_SELECT_EVENT') {
        const id = Number(e.data.eventId);
        setSelectedEventId(id);
        const found = eventsWithDistance.find((i) => i.event.id === id);
        if (found) {
          shouldFlyNextRef.current = false;
          setStatusMessage(`📌 [${found.event.title}] 선택됨 — ${found.distanceWalk}`);
        }
      } else if (e.data.type === 'POPCON_EXPLORE_MAP_MOVED') {
        const { lat, lng, label } = e.data;
        setActiveSpotId('custom_map');
        setMyLocation({ lat, lng, label: label || '지도 선택 중심' });
        shouldFlyNextRef.current = true;
        setMapCenter({ lat, lng });
        setStatusMessage(`📍 '${label || '현 지도 중심'}' 주변으로 거리를 다시 계산했습니다.`);
      } else if (e.data.type === 'POPCON_EXPLORE_REQUEST_MY_LOCATION') {
        handleFindMyLocation();
      }
    };

    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [eventsWithDistance, handleFindMyLocation]);

  // 핫스팟 거점 클릭
  const handleSelectHotspot = (spot: (typeof HOTSPOT_PRESETS)[number]) => {
    setActiveSpotId(spot.id);
    setMyLocation({ lat: spot.lat, lng: spot.lng, label: spot.name });
    shouldFlyNextRef.current = true;
    setMapCenter({ lat: spot.lat, lng: spot.lng });
    setRadiusMeters(spot.defaultRadius);
    setStatusMessage(
      spot.defaultRadius === 0
        ? `🗺️ 전체 지역 지도 보기로 전환했습니다.`
        : `📍 [${spot.name}] 반경 ${(spot.defaultRadius / 1000).toFixed(0)}km 이내 핫플을 표시합니다.`
    );
  };

  // 리스트/카드에서 행사 선택 시 지도로 이동
  const handleFocusEventOnMap = (ev: CultureEvent) => {
    const geo = getEventGeo(ev);
    setSelectedEventId(ev.id);
    shouldFlyNextRef.current = true;
    setMapCenter({ lat: geo.lat, lng: geo.lng, focusEvent: true });
    setStatusMessage(`🎯 [${ev.title}] 위치(${ev.spot})로 지도를 이동했습니다.`);
  };

  // 지도 찾기 통합 검색 (행사명 -> 내장 지역 -> OpenStreetMap 지오코딩)
  const handleMapSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // 1. 행사명 / 장소명 / 태그 매칭
    const matchedEvent = events.find(
      (ev) =>
        ev.title.toLowerCase().includes(q) ||
        ev.spot.toLowerCase().includes(q) ||
        ev.tags.some((t) => t.toLowerCase().includes(q))
    );
    if (matchedEvent) {
      const geo = getEventGeo(matchedEvent);
      setRadiusMeters(0);
      setCategoryFilter('all');
      setSelectedEventId(matchedEvent.id);
      shouldFlyNextRef.current = true;
      setMapCenter({ lat: geo.lat, lng: geo.lng, focusEvent: true });
      setStatusMessage(`🔍 [${matchedEvent.title}] 위치(${matchedEvent.spot})를 지도에서 찾았습니다.`);
      return;
    }

    // 2. 핫스팟 및 주요 역 사전 매칭
    const presetHit = HOTSPOT_PRESETS.find(
      (s) => s.id !== 'all_seoul' && (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
    );
    if (presetHit) {
      handleSelectHotspot(presetHit);
      return;
    }

    const extraHit = EXTRA_PLACE_KEYWORDS.find(
      (p) => p.keywords.some((k) => q.includes(k)) || p.name.toLowerCase().includes(q)
    );
    if (extraHit) {
      setActiveSpotId('search');
      setMyLocation({ lat: extraHit.lat, lng: extraHit.lng, label: extraHit.name });
      shouldFlyNextRef.current = true;
      setMapCenter({ lat: extraHit.lat, lng: extraHit.lng });
      setRadiusMeters(5000);
      setStatusMessage(`🔍 '${extraHit.name}' 반경 5km 내 행사를 찾았습니다.`);
      return;
    }

    // 3. OpenStreetMap Nominatim 지오코딩
    setIsSearchingMap(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&countrycodes=kr&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const label = data[0].display_name.split(',')[0];
        setActiveSpotId('search');
        setMyLocation({ lat, lng, label });

        const nearbyCount = events.filter(
          (ev) => getDistanceKm(lat, lng, getEventGeo(ev).lat, getEventGeo(ev).lng) <= 5
        ).length;

        shouldFlyNextRef.current = true;
        setMapCenter({ lat, lng });
        setRadiusMeters(nearbyCount > 0 ? 5000 : 0);
        setStatusMessage(
          nearbyCount > 0
            ? `🔍 '${label}' 반경 5km 내 ${nearbyCount}개 행사를 찾았습니다.`
            : `🔍 '${label}'에서 가장 가까운 순으로 행사를 정렬했습니다.`
        );
      } else {
        setStatusMessage(`⚠️ '${searchQuery}'에 대한 지도 검색 결과를 찾지 못했습니다. (예: 성수, 홍대, 잠실, 루피, 데스노트)`);
      }
    } catch {
      setStatusMessage('⚠️ 외부 지도 주소 검색 중 오류가 발생했습니다. 지역 버튼을 이용해 주세요.');
    } finally {
      setIsSearchingMap(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* ===== 1. 상단 검색 & 내 주변 찾기 컨트롤 패널 ===== */}
      <div className="bg-white border-2 border-stone-900 rounded-3xl p-4 sm:p-5 shadow-[4px_4px_0px_#1c1917] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>실시간 지도 탐색 · GPS 반경 검색</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1">
              지도 찾기 &amp; 내 주변 팝업·공연
            </h2>
          </div>

          {/* 지도 찾기 검색바 + 내 주변 찾기 GPS 버튼 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 lg:max-w-2xl">
            <form
              onSubmit={handleMapSearch}
              className="flex-1 flex items-center gap-1.5 bg-stone-50 border-2 border-stone-900 rounded-2xl px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-400"
            >
              <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="지역·역·장소 또는 행사명 검색 (예: 성수, 더현대, 샤롯데, 루피)..."
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSearchingMap}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {isSearchingMap ? '검색 중...' : '지도 찾기'}
              </button>
            </form>

            <button
              type="button"
              onClick={handleFindMyLocation}
              disabled={isLocating}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs sm:text-sm border-2 border-stone-900 shadow-[2px_2px_0px_#1c1917] cursor-pointer transition-all active:translate-y-0.5 whitespace-nowrap"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LocateFixed className="w-4 h-4" />
              )}
              <span>내 주변 찾기 (GPS)</span>
            </button>
          </div>
        </div>

        {/* 주요 거점 빠르게 이동하기 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {HOTSPOT_PRESETS.map((spot) => {
            const isActive = activeSpotId === spot.id;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => handleSelectHotspot(spot)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <span>{spot.emoji}</span>
                <span>{spot.name}</span>
              </button>
            );
          })}
        </div>

        {/* 반경 + 카테고리 + 정렬 필터 줄 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-black text-stone-400 flex items-center gap-1 mr-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              반경:
            </span>
            {RADIUS_OPTIONS.map((opt) => {
              const active = radiusMeters === opt.meters;
              return (
                <button
                  key={opt.meters}
                  type="button"
                  onClick={() => {
                    shouldFlyNextRef.current = true;
                    setRadiusMeters(opt.meters);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}

            <div className="w-px h-4 bg-stone-200 mx-1 hidden sm:block" />

            <span className="text-[11px] font-black text-stone-400 hidden sm:inline">분야:</span>
            {CATEGORY_FILTERS.map((cat) => {
              const active = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    shouldFlyNextRef.current = false;
                    setCategoryFilter(cat.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-stone-950 border border-stone-900'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <button
              type="button"
              onClick={() => setSortBy('distance')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                sortBy === 'distance' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              가까운 순
            </button>
            <button
              type="button"
              onClick={() => setSortBy('popular')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                sortBy === 'popular' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              인기 순
            </button>
          </div>
        </div>

        {/* 실시간 기준 상태 알림 */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <Navigation className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>
              기준 위치: <strong className="text-emerald-800">{myLocation.label}</strong>
              {statusMessage ? ` · ${statusMessage}` : ''}
            </span>
          </div>
          <span className="font-mono font-bold text-emerald-800">
            결과 {filteredItems.length}건
          </span>
        </div>
      </div>

      {/* ===== 2. 메인 대화형 지도 + 주변 행사 리스트 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 좌측(7칸): 실제 인터랙티브 Leaflet 지도 */}
        <div className="lg:col-span-7 bg-white border-2 border-stone-900 rounded-3xl overflow-hidden shadow-[4px_4px_0px_#1c1917] flex flex-col">
          <div className="relative w-full h-[420px] sm:h-[520px] bg-stone-100">
            <iframe
              ref={iframeRef}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/explore-map.html?lat=${myLocation.lat}&lng=${myLocation.lng}&zoom=14`}
              className="w-full h-full border-0 block"
              title="POP-CON 실시간 지도 탐색"
              onLoad={() => {
                shouldFlyNextRef.current = true;
                setMapReady(true);
                sendMapUpdate(true);
              }}
            />
          </div>
          <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
            <span>💡 지도를 드래그한 뒤 상단 <strong className="text-stone-800">[🔄 현 지도 위치에서 행사 찾기]</strong>를 누르면 그 지역 기준으로 검색됩니다.</span>
            <span className="font-mono text-stone-400">
              {myLocation.lat.toFixed(4)}, {myLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>

        {/* 우측(5칸): 주변 행사 리스트 + 선택된 장소 상세 카드 */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 선택된 핀 하이라이트 카드 */}
          {selectedItem && (
            <div className="bg-white border-2 border-stone-900 rounded-3xl p-4 shadow-[4px_4px_0px_#1c1917] space-y-3">
              <div className="flex gap-3">
                <img
                  src={selectedItem.event.imageUrl}
                  alt={selectedItem.event.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-stone-900 flex-shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-black border border-stone-900"
                      style={{
                        backgroundColor: selectedItem.event.badgeBg,
                        color: selectedItem.event.badgeText,
                      }}
                    >
                      {selectedItem.event.categoryName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                      📍 {selectedItem.distanceWalk}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-stone-900 truncate">
                    {selectedItem.event.title}
                  </h3>
                  <p className="text-[11px] text-stone-600 truncate">
                    {selectedItem.geo.address}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    🚇 {selectedItem.geo.subway}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onOpenEvent(selectedItem.event)}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>상세 및 예매하기</span>
                </button>
                <a
                  href={`https://map.kakao.com/link/to/${encodeURIComponent(selectedItem.event.spot)},${selectedItem.geo.lat},${selectedItem.geo.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-xl bg-[#fee500] text-[#191919] text-[11px] font-black flex items-center gap-1 hover:brightness-95"
                >
                  <span>카카오맵</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(selectedItem.event.spot)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-xl bg-[#03c75a] text-white text-[11px] font-black flex items-center gap-1 hover:brightness-95"
                >
                  <span>네이버</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* 반경 내 행사 목록 스크롤 박스 */}
          <div className="bg-white border-2 border-stone-900 rounded-3xl p-4 shadow-[4px_4px_0px_#1c1917] flex-1 flex flex-col min-h-[290px]">
            <div className="flex items-center justify-between pb-2.5 border-b border-stone-200">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>주변 행사 목록 ({filteredItems.length})</span>
              </h3>
              {radiusMeters > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    shouldFlyNextRef.current = true;
                    setRadiusMeters(0);
                  }}
                  className="text-[11px] font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>전체 지역 보기</span>
                </button>
              )}
            </div>

            {filteredItems.length > 0 ? (
              <div className="divide-y divide-stone-100 overflow-y-auto max-h-[300px] mt-1 pr-1">
                {filteredItems.map((item) => {
                  const isSel = selectedItem?.event.id === item.event.id;
                  return (
                    <div
                      key={item.event.id}
                      onClick={() => handleFocusEventOnMap(item.event)}
                      className={`py-2.5 px-2.5 my-1 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        isSel
                          ? 'bg-amber-50 border border-amber-400'
                          : 'hover:bg-stone-50 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                            {item.event.categoryName}
                          </span>
                          <span className="text-xs font-black text-stone-900 truncate">
                            {item.event.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          📍 {item.event.spot} · <span className="text-emerald-700 font-bold">{item.distanceWalk}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] font-mono font-bold text-stone-600">
                          {item.distanceShort}
                        </span>
                        {item.event.waitingCount !== undefined && item.event.waitingCount > 0 && (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" /> {item.event.waitingCount}팀
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-3">
                <p className="text-xs font-bold text-stone-500">
                  현재 반경({radiusMeters >= 1000 ? `${radiusMeters / 1000}km` : `${radiusMeters}m`}) 내에 조건에 맞는 행사가 없습니다.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      shouldFlyNextRef.current = true;
                      setRadiusMeters(0);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-black cursor-pointer"
                  >
                    전체 거리로 넓혀서 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('all');
                      handleSelectHotspot(HOTSPOT_PRESETS[1]);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold cursor-pointer"
                  >
                    성수동 핫플 보기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== 3. 하단 전체 카드 뷰 ===== */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-1.5">
          <span>{myLocation.label} 주변 추천 리스트</span>
          <span className="text-xs font-semibold text-stone-400 font-mono">({filteredItems.length}개)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <EventCard
              key={item.event.id}
              event={item.event}
              onOpenDetail={onOpenEvent}
              isLiked={wishlist.includes(item.event.id)}
              onToggleLike={() => onToggleWishlist(item.event.id)}
              onBookGroup={() => onGoToGroupBooking(item.event)}
              walkingDistance={item.distanceWalk}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
