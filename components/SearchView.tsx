'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ArrowLeft, Sparkles, Filter, Calendar, MapPin, Tag } from 'lucide-react';
import { CultureEvent } from '../types';
import { EventCard } from './EventCard';

interface SearchViewProps {
  events: CultureEvent[];
  onOpenDetail: (event: CultureEvent) => void;
  onBackToExplore: () => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({
  events,
  onOpenDetail,
  onBackToExplore,
  wishlist,
  onToggleWishlist,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const popularTags = [
    '잔망루피',
    '지킬앤하이드',
    '모네 미디어아트',
    '성수 에스팩토리',
    '스튜디오 지브리',
    '콜라보카페',
    '샤롯데씨어터',
    '독립영화',
  ];

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'popup', label: '팝업스토어' },
    { id: 'performance', label: '공연' },
    { id: 'exhibition', label: '전시' },
    { id: 'movie', label: '영화' },
    { id: 'collab_cafe', label: '콜라보카페' },
    { id: 'festival', label: '축제' },
  ];

  const locations = [
    { id: 'all', label: '전체 지역' },
    { id: '성수', label: '성수' },
    { id: '잠실', label: '잠실' },
    { id: '더현대', label: '더현대/여의도' },
    { id: '홍대', label: '홍대' },
  ];

  // Filter events in real-time
  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((ev) => {
      // 1. Text Search match
      if (q) {
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesSpot = ev.spot.toLowerCase().includes(q);
        const matchesLocation = ev.location.toLowerCase().includes(q);
        const matchesCategory = ev.categoryName.toLowerCase().includes(q);
        const matchesTags = ev.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDesc = ev.desc.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSpot && !matchesLocation && !matchesCategory && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // 2. Category match
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }

      // 3. Location match
      if (selectedLocation !== 'all' && !ev.location.includes(selectedLocation) && !ev.spot.includes(selectedLocation)) {
        return false;
      }

      return true;
    });
  }, [events, query, selectedCategory, selectedLocation]);

  return (
    <div className="w-full max-w-5xl mx-auto py-2 space-y-6 select-none animate-in fade-in duration-200">
      
      {/* 1. Top Navigation Bar (Back button) */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToExplore}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border-2 border-stone-900 text-stone-900 text-xs font-bold transition-all shadow-[2px_2px_0px_#1c1917] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>둘러보기로 돌아가기</span>
        </button>

        <span className="text-xs font-mono font-bold text-stone-400">
          통합 검색 모드
        </span>
      </div>

      {/* 2. Large Centered Search Box */}
      <div className="bg-white border-2 border-stone-900 rounded-3xl p-6 sm:p-8 shadow-[5px_5px_0px_#1c1917] space-y-5">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center bg-stone-50 border-2 border-stone-900 rounded-2xl px-4 py-3.5 shadow-inner focus-within:bg-white focus-within:border-stone-900 transition-all">
          <Search className="w-6 h-6 text-stone-700 flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="어떤 팝업스토어, 공연, 전시를 찾으시나요?"
            className="w-full text-base sm:text-lg font-bold text-stone-900 placeholder-stone-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 cursor-pointer ml-2"
              title="검색어 지우기"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Popular Trending Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-stone-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>인기 검색어:</span>
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-900 hover:text-white border border-stone-300 hover:border-stone-900 text-stone-700 text-xs font-medium transition-all cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Category & Location Sub-filters */}
        <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all border cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-300 hover:border-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Locations */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <MapPin className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
            {locations.map((loc) => {
              const isActive = selectedLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {loc.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Search Results Grid */}
      <div className="space-y-4">
        
        {/* Results Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight">
              {query ? `'${query}' 검색 결과` : '전체 추천 행사'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              총 <strong className="text-stone-900 font-mono">{filteredEvents.length}</strong>개의 행사가 검색되었습니다.
            </p>
          </div>

          {(query || selectedCategory !== 'all' || selectedLocation !== 'all') && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 underline cursor-pointer"
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onOpenDetail={(target) => onOpenDetail(target)}
                isLiked={wishlist.includes(ev.id)}
                onToggleLike={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(ev.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-stone-900 rounded-3xl p-12 text-center shadow-[4px_4px_0px_#1c1917] space-y-3">
            <p className="text-base font-black text-stone-800">
              '{query}'에 해당하는 행사를 찾을 수 없습니다.
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              단어의 철자가 정확한지 확인하시거나, 다른 인기 검색어(#잔망루피, #지브리)를 클릭해보세요!
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-2xs hover:bg-stone-800 transition-all cursor-pointer"
            >
              전체 행사 둘러보기
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
