'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
}) => {
  // C-08: 상단 카테고리 6개 (공연·영화·전시·팝업스토어·콜라보카페·축제) 동일 비중 원천 분리
  const categories = [
    { id: 'all', label: '전체', solidBg: '#f5f5f4', solidText: '#1c1917' },
    { id: 'performance', label: '공연', solidBg: '#f3e8ff', solidText: '#6b21a8' },
    { id: 'movie', label: '영화', solidBg: '#e0f2fe', solidText: '#0369a1' },
    { id: 'exhibition', label: '전시', solidBg: '#dcfce7', solidText: '#166534' },
    { id: 'popup', label: '팝업스토어', solidBg: '#ffe4e6', solidText: '#9f1239' },
    { id: 'collab_cafe', label: '콜라보카페', solidBg: '#ffedd5', solidText: '#9a3412' },
    { id: 'festival', label: '축제', solidBg: '#fef9c3', solidText: '#854d0e' },
  ];

  const hotspotsByCategory: Record<string, { name: string; label: string }[]> = {
    performance: [
      { name: '전체', label: '전체' },
      { name: '잠실', label: '샤롯데씨어터' },
      { name: '서초', label: '예술의전당' },
      { name: '대학로', label: '대학로 TOM' },
    ],
    movie: [
      { name: '전체', label: '전체' },
      { name: '홍대', label: '상상마당 시네마' },
      { name: '광화문', label: '씨네큐브' },
    ],
    exhibition: [
      { name: '전체', label: '전체' },
      { name: '성수', label: '그라운드시소' },
      { name: '더현대', label: 'ALT.1' },
      { name: '종로', label: '국립현대미술관' },
    ],
    popup: [
      { name: '전체', label: '전체' },
      { name: '성수', label: '성수 에스팩토리' },
      { name: '더현대', label: '더현대 서울' },
      { name: '한남/도산', label: '한남/도산' },
    ],
    collab_cafe: [
      { name: '전체', label: '전체' },
      { name: '성수', label: '성수 아틀리에' },
      { name: '홍대', label: 'AK PLAZA' },
    ],
    festival: [
      { name: '전체', label: '전체' },
      { name: '성수', label: '성수 연무장길' },
      { name: '부산', label: '광안리 해변' },
    ],
    all: [
      { name: '전체', label: '전체' },
      { name: '성수', label: '성수' },
      { name: '잠실', label: '잠실' },
      { name: '더현대', label: '더현대' },
      { name: '홍대', label: '홍대' },
    ],
  };

  const hotspots = hotspotsByCategory[selectedCategory] || hotspotsByCategory.all;

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-2 border-stone-900 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-[3px_3px_0px_#1c1917] select-none">
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        
        {/* 6 Equal Categories Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 lg:pb-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectLocation('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all border-2 flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-[2px_2px_0px_#1c1917]'
                    : 'border-stone-200 text-stone-700 hover:border-stone-900 hover:bg-white'
                }`}
                style={!isActive ? { backgroundColor: cat.solidBg } : undefined}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Hotspot Region / Venue Filter */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto scrollbar-none">
          <span className="text-stone-700 font-bold flex items-center gap-1 mr-0.5 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-stone-600" /> 지역/공간:
          </span>
          {hotspots.map((loc) => {
            const isActive = selectedLocation === (loc.name === '전체' ? '' : loc.name);
            return (
              <button
                key={loc.name}
                onClick={() => onSelectLocation(loc.name === '전체' ? '' : loc.name)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                {loc.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
