'use client';

import React, { useState } from 'react';
import { SeatGrade } from '../types';
import { Wrench, RotateCcw, Save, CheckCircle, Sparkles } from 'lucide-react';

export const SeatStudio: React.FC = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  const initialLayout: Record<string, SeatGrade> = {};
  rows.forEach((r) => {
    cols.forEach((c) => {
      const id = `${r}${c}`;
      if (r === 'A' || r === 'B') initialLayout[id] = 'vip';
      else if (r === 'C' || r === 'D') initialLayout[id] = 'r';
      else initialLayout[id] = 's';
    });
  });

  const [layout, setLayout] = useState<Record<string, SeatGrade>>(initialLayout);
  const [selectedTool, setSelectedTool] = useState<SeatGrade>('vip');
  const [savedMessage, setSavedMessage] = useState<boolean>(false);

  const handleSeatClick = (id: string) => {
    setLayout((prev) => ({
      ...prev,
      [id]: selectedTool,
    }));
  };

  const handleReset = () => {
    if (confirm('좌석 배치를 모두 통로(빈칸)로 초기화하시겠습니까?')) {
      const reset: Record<string, SeatGrade> = {};
      rows.forEach((r) => {
        cols.forEach((c) => {
          reset[`${r}${c}`] = 'empty';
        });
      });
      setLayout(reset);
    }
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  let vipCount = 0;
  let rCount = 0;
  let sCount = 0;

  Object.values(layout).forEach((grade) => {
    if (grade === 'vip') vipCount++;
    if (grade === 'r') rCount++;
    if (grade === 's') sCount++;
  });

  const totalSeats = vipCount + rCount + sCount;
  const totalRevenue = vipCount * 50000 + rCount * 35000 + sCount * 20000;

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              행사 주최사 스튜디오
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              성수동 에스팩토리 D동 — 대화형 좌석 배치도 & 티켓 가격 에디터
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              무대, 스크린, VIP/R/S석 등급을 원하는 대로 클릭하여 배치하고 실시간 예상 티켓 매출을 계산합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-600 hover:text-rose-600 hover:border-rose-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>배치 저장 및 예매 오픈</span>
            </button>
          </div>
        </div>

        {savedMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>좌석 레이아웃(JSON 좌표 데이터)이 저장되었습니다! 일반 예매 및 동행 예매 화면에 실시간 동기화됩니다.</span>
          </div>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Tool Palette (Solid Pastel) */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 space-y-5 shadow-sm">
          <h3 className="font-bold text-xs text-stone-400 tracking-wider uppercase">도구 팔레트</h3>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedTool('vip')}
              className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedTool === 'vip'
                  ? 'border-2 border-amber-300 bg-amber-100 text-amber-900'
                  : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-400" />
                VIP석 (₩50,000)
              </span>
              <span className="text-[12px] font-semibold">{vipCount}석</span>
            </button>

            <button
              onClick={() => setSelectedTool('r')}
              className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedTool === 'r'
                  ? 'border-2 border-purple-300 bg-purple-100 text-purple-900'
                  : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-purple-200 border border-purple-400" />
                R석 (₩35,000)
              </span>
              <span className="text-[12px] font-semibold">{rCount}석</span>
            </button>

            <button
              onClick={() => setSelectedTool('s')}
              className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedTool === 's'
                  ? 'border-2 border-sky-300 bg-sky-100 text-sky-900'
                  : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-sky-200 border border-sky-400" />
                S석 (₩20,000)
              </span>
              <span className="text-[12px] font-semibold">{sCount}석</span>
            </button>

            <button
              onClick={() => setSelectedTool('empty')}
              className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedTool === 'empty'
                  ? 'border-2 border-stone-400 bg-stone-100 text-stone-800'
                  : 'border border-stone-200 text-stone-400 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded border border-dashed border-stone-400" />
                통로 / 공백
              </span>
              <span className="text-[12px] font-semibold">빈칸</span>
            </button>
          </div>

          {/* Realtime Stats */}
          <div className="border-t border-stone-100 pt-4 space-y-2 text-xs">
            <div className="text-stone-500 font-semibold mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>실시간 배치 통계</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>총 유효 좌석:</span>
              <span className="font-bold text-stone-900">{totalSeats}석</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>예상 매진 매출:</span>
              <span className="font-bold text-rose-600 font-mono text-sm">
                ₩{totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Studio Canvas Matrix */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[420px] shadow-sm">
          
          <div className="w-full max-w-xl text-center mb-6">
            <div className="border-2 border-dashed border-sky-300 bg-sky-50 rounded-2xl py-2 px-6 text-xs font-bold text-sky-800 inline-block">
              🎪 MAIN STAGE / SCREEN AREA
            </div>
            <p className="text-xs text-stone-400 mt-2">좌석을 클릭하면 선택한 도구 등급으로 즉시 변환됩니다.</p>
          </div>

          <div className="grid grid-cols-8 gap-2.5 max-w-md w-full">
            {rows.map((r) =>
              cols.map((c) => {
                const id = `${r}${c}`;
                const grade = layout[id] || 's';

                let btnStyles = 'w-full aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center ';
                let label = id;

                if (grade === 'vip') {
                  btnStyles += 'bg-amber-100 border border-amber-300 text-amber-900';
                  label = 'VIP';
                } else if (grade === 'r') {
                  btnStyles += 'bg-purple-100 border border-purple-300 text-purple-900';
                  label = 'R';
                } else if (grade === 's') {
                  btnStyles += 'bg-sky-100 border border-sky-300 text-sky-900';
                  label = 'S';
                } else {
                  btnStyles += 'border border-dashed border-stone-300 text-stone-300';
                  label = '•';
                }

                return (
                  <button
                    key={id}
                    onClick={() => handleSeatClick(id)}
                    className={btnStyles}
                    title={`${id} 좌석`}
                  >
                    {label}
                  </button>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
