'use client';

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, MapPin, ArrowUp, ChevronRight, X, Radio } from 'lucide-react';

interface CategoryRemoteProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  isVisible: boolean;
}

export const CategoryRemote: React.FC<CategoryRemoteProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
  isVisible,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 6 Main Categories
  const categories = [
    { id: 'all', label: '전체', solidBg: '#f5f5f4', solidText: '#1c1917' },
    { id: 'performance', label: '공연', solidBg: '#f3e8ff', solidText: '#6b21a8' },
    { id: 'movie', label: '영화', solidBg: '#e0f2fe', solidText: '#0369a1' },
    { id: 'exhibition', label: '전시', solidBg: '#dcfce7', solidText: '#166534' },
    { id: 'popup', label: '팝업스토어', solidBg: '#ffe4e6', solidText: '#9f1239' },
    { id: 'collab_cafe', label: '콜라보카페', solidBg: '#ffedd5', solidText: '#9a3412' },
    { id: 'festival', label: '축제', solidBg: '#fef9c3', solidText: '#854d0e' },
  ];

  // Hotspots
  const locations = [
    { name: '', label: '전체' },
    { name: '성수', label: '성수' },
    { name: '잠실', label: '잠실' },
    { name: '더현대', label: '더현대' },
    { name: '홍대', label: '홍대' },
  ];

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    onSelectLocation('');
    // 부드럽게 피드 시작 위치로 정렬
    const feed = document.getElementById('explore-feed-section');
    if (feed) {
      feed.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocationClick = (locName: string) => {
    onSelectLocation(locName);
    const feed = document.getElementById('explore-feed-section');
    if (feed) {
      feed.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ================= 1. DESKTOP FLOATING REMOTE (lg 이상) ================= */}
      <aside
        className={`hidden lg:flex fixed left-3 xl:left-5 2xl:left-8 top-28 xl:top-32 z-40 flex-col transition-all duration-300 ease-out select-none ${
          isVisible
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-x-8 pointer-events-none'
        }`}
        aria-label="카테고리 리모콘"
      >
        {isMinimized ? (
          // Minimized Floating Pill
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] hover:bg-stone-50 cursor-pointer transition-transform hover:scale-105"
            title="리모콘 펼치기"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-stone-900 animate-pulse" />
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-900" />
            <span className="text-xs font-black text-stone-900">리모콘</span>
          </button>
        ) : (
          // Full Remote Control Chassis
          <div className="w-[136px] bg-[#fffdf9] border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_#1c1917] p-2.5 flex flex-col gap-2">
            
            {/* Remote Top Header with LED & Minimize button */}
            <div className="flex items-center justify-between pb-1.5 border-b-2 border-stone-900">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 border border-stone-900 animate-pulse" />
                <span className="text-[11px] font-black tracking-tight text-stone-900">POP-CON</span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-[10px] text-stone-400 hover:text-stone-900 font-bold px-1 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                title="리모콘 접기"
              >
                접기
              </button>
            </div>

            {/* Remote Body: Category Buttons */}
            <div className="space-y-1">
              <span className="text-[9.5px] font-black text-stone-400 uppercase tracking-wider block px-1">
                카테고리
              </span>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-black transition-all border flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-stone-900 text-white border-stone-900 shadow-[2px_2px_0px_#1c1917] translate-x-0.5'
                          : 'border-stone-200 text-stone-800 hover:border-stone-900 hover:bg-white'
                      }`}
                      style={!isActive ? { backgroundColor: cat.solidBg } : undefined}
                    >
                      <span>{cat.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Remote Body: Location Filter */}
            <div className="space-y-1 pt-1 border-t border-stone-200">
              <div className="flex items-center gap-1 px-1">
                <MapPin className="w-3 h-3 text-stone-500" />
                <span className="text-[9.5px] font-black text-stone-400 tracking-wider">지역</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {locations.map((loc) => {
                  const isActive = selectedLocation === loc.name;
                  return (
                    <button
                      key={loc.label}
                      onClick={() => handleLocationClick(loc.name)}
                      className={`px-1.5 py-1 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {loc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Remote Bottom: Scroll to Top button */}
            <div className="pt-1 border-t border-stone-200">
              <button
                onClick={scrollToTop}
                className="w-full py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 hover:text-stone-900 font-bold text-[10.5px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                title="화면 맨 위로 이동"
              >
                <ArrowUp className="w-3 h-3 text-stone-600" />
                <span>맨 위로</span>
              </button>
            </div>

          </div>
        )}
      </aside>

      {/* ================= 2. MOBILE / TABLET FLOATING REMOTE BUTTON (lg 미만) ================= */}
      <div
        className={`lg:hidden fixed left-4 bottom-5 z-40 transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-900 text-white border-2 border-stone-900 shadow-[3px_3px_0px_#1c1917] font-black text-xs cursor-pointer hover:bg-stone-800 active:scale-95"
          title="카테고리 리모콘 열기"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
          <span>리모콘</span>
        </button>
      </div>

      {/* Mobile Modal Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#fffdf9] border-2 border-stone-900 rounded-3xl p-4 shadow-[6px_6px_0px_#1c1917] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-stone-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-stone-900" />
                <h3 className="font-black text-sm text-stone-900">카테고리 리모콘</h3>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-700" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryClick(cat.id);
                      setIsMobileOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer text-left flex items-center justify-between ${
                      isActive
                        ? 'bg-stone-900 text-white border-stone-900 shadow-[2px_2px_0px_#1c1917]'
                        : 'border-stone-200 text-stone-800'
                    }`}
                    style={!isActive ? { backgroundColor: cat.solidBg } : undefined}
                  >
                    <span>{cat.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                );
              })}
            </div>

            {/* Mobile Locations */}
            <div className="space-y-1.5 pt-2 border-t border-stone-200">
              <span className="text-xs font-bold text-stone-600">지역 필터</span>
              <div className="flex flex-wrap gap-1.5">
                {locations.map((loc) => {
                  const isActive = selectedLocation === loc.name;
                  return (
                    <button
                      key={loc.label}
                      onClick={() => {
                        handleLocationClick(loc.name);
                        setIsMobileOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {loc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setIsMobileOpen(false);
                scrollToTop();
              }}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 font-bold text-xs text-stone-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>맨 위로 가기</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
