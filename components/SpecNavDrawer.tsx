'use client';

import React, { useState } from 'react';
import { X, Search, Layers, ExternalLink, CheckCircle, Sparkles } from 'lucide-react';
import { specScreens, SPEC_PARTS } from '../data/specScreens';
import { SpecScreenItem } from '../types';

interface SpecNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen: (screen: SpecScreenItem) => void;
}

export const SpecNavDrawer: React.FC<SpecNavDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToScreen,
}) => {
  const [filterPart, setFilterPart] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredScreens = specScreens.filter((s) => {
    if (filterPart !== 'all' && s.part !== filterPart) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = s.name.toLowerCase().includes(q);
      const inUrl = s.url.toLowerCase().includes(q);
      const inFeats = s.feats.some(([id, desc]) => id.toLowerCase().includes(q) || desc.toLowerCase().includes(q));
      if (!inName && !inUrl && !inFeats) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l-2 border-stone-900 select-none animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-900 bg-[#faf8f5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-stone-900 text-base leading-tight">
                C팀 기능설계서 v1.6 화면 목록
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">
                총 {specScreens.length}개 화면 및 기능 ID 매핑 (클릭 시 해당 화면으로 즉시 이동)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls (Part Tabs + Search) */}
        <div className="p-3 border-b border-stone-200 space-y-2 bg-white">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setFilterPart('all')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                filterPart === 'all'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              전체 ({specScreens.length})
            </button>
            {Object.entries(SPEC_PARTS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterPart(key)}
                className={`px-2.5 py-1 rounded-lg font-bold border whitespace-nowrap transition-all ${
                  filterPart === key
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {key === '0' ? '공통' : `파트 ${key}`}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="화면명, URL, 기능 ID (예: S-04, T-06, W-01) 검색..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        {/* Screens List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2">
          {filteredScreens.map((screen) => (
            <div
              key={screen.no + screen.url}
              onClick={() => {
                onNavigateToScreen(screen);
                onClose();
              }}
              className="p-3 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors group space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-stone-400">
                    #{screen.no}
                  </span>
                  <h3 className="font-black text-xs sm:text-sm text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {screen.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    screen.kind === 'core'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {screen.kind === 'core' ? '필수' : '확장'}
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {screen.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>{screen.url}</span>
                <span className="text-stone-400 group-hover:text-indigo-600 flex items-center gap-0.5 font-sans font-bold">
                  이동 <ExternalLink className="w-3 h-3" />
                </span>
              </div>

              {/* Function Badges */}
              {screen.feats && screen.feats.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {screen.feats.slice(0, 4).map(([fId, fDesc]) => (
                    <span
                      key={fId}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200"
                    >
                      <strong className="text-stone-900 font-mono">{fId}</strong>
                      <span className="truncate max-w-[140px]">{fDesc}</span>
                    </span>
                  ))}
                  {screen.feats.length > 4 && (
                    <span className="text-[10px] text-stone-400 font-mono py-0.5 px-1">
                      +{screen.feats.length - 4}개
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredScreens.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-400">
              일치하는 화면이 없습니다.
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-stone-200 bg-[#faf8f5] text-[11px] text-stone-500 text-center">
          팝콘 (POP-CON) 기능설계서 v1.6 기반 풀 인터랙티브 목업
        </div>

      </div>
    </div>
  );
};
