'use client';

import React, { useState } from 'react';
import { MapPin, Coffee, Sparkles, Navigation, Share2, Heart, Check, ArrowRight } from 'lucide-react';

interface SeongsuCourseGuideProps {
  onSelectEvent: (id: number) => void;
  onTriggerConfetti?: () => void;
}

export const SeongsuCourseGuide: React.FC<SeongsuCourseGuideProps> = ({
  onSelectEvent,
  onTriggerConfetti,
}) => {
  const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [savedCourses, setSavedCourses] = useState<number[]>([]);

  const courses = [
    {
      id: 1,
      name: '성수 팝업 & 카페 코스',
      tag: '인기 코스',
      tagColor: 'bg-rose-50 text-rose-800 border-rose-200',
      duration: '약 2시간 30분',
      distance: '도보 750m',
      summary: '베이커리 카페부터 팝업스토어와 라이프스타일 샵을 잇는 코스',
      steps: [
        {
          num: '01',
          name: '카페 어니언 성수',
          category: '카페',
          desc: '루프탑 베이커리 카페',
          icon: '☕',
        },
        {
          num: '02',
          name: '잔망루피 윈터 팝업스토어',
          category: '팝업',
          desc: '에스팩토리 D동 포토존 및 굿즈',
          icon: '🧸',
          eventId: 1,
        },
        {
          num: '03',
          name: '성수연방 복합문화공간',
          category: '라이프스타일',
          desc: '소품샵 및 포토부스',
          icon: '🎞️',
        },
      ],
    },
    {
      id: 2,
      name: '실내 전시 코스',
      tag: '실내 동선',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      duration: '약 3시간',
      distance: '도보 400m',
      summary: '미디어아트 전시와 레스토랑 중심의 실내 중심 코스',
      steps: [
        {
          num: '01',
          name: '모네 인사이즈 미디어아트',
          category: '전시',
          desc: '그라운드시소 성수 미디어아트',
          icon: '🎨',
          eventId: 2,
        },
        {
          num: '02',
          name: '대림창고',
          category: '레스토랑',
          desc: '갤러리 카페 & 화덕 피자',
          icon: '🍕',
        },
        {
          num: '03',
          name: '서울숲 아뜰리에길',
          category: '산책',
          desc: '서울숲 인근 카페 거리 산책',
          icon: '🌿',
        },
      ],
    },
    {
      id: 3,
      name: '전시 & 영화 코스',
      tag: '전시 & 영화',
      tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
      duration: '약 4시간',
      distance: '지하철 15분',
      summary: '더현대 전시와 독립영화 상영을 함께 즐기는 주말 코스',
      steps: [
        {
          num: '01',
          name: '스튜디오 지브리 비하인드전',
          category: '전시',
          desc: '더현대 서울 ALT.1 원화전',
          icon: '✨',
          eventId: 5,
        },
        {
          num: '02',
          name: '2026 청춘 단편 독립영화제',
          category: '영화',
          desc: '상상마당 시네마 GV 상영',
          icon: '🎬',
          eventId: 3,
        },
        {
          num: '03',
          name: '연남동 거리',
          category: '동행',
          desc: '동행 관람 후 대화와 티타임',
          icon: '🍵',
        },
      ],
    },
  ];

  const currentCourse = courses[selectedCourseIdx];
  const isSaved = savedCourses.includes(currentCourse.id);

  const toggleSave = () => {
    if (isSaved) {
      setSavedCourses(savedCourses.filter((id) => id !== currentCourse.id));
    } else {
      setSavedCourses([...savedCourses, currentCourse.id]);
      onTriggerConfetti?.();
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    onTriggerConfetti?.();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1c1917] relative select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border-2 border-stone-900 text-stone-800 text-xs font-black shadow-2xs">
            <Navigation className="w-3.5 h-3.5 text-stone-700" />
            <span>도보 코스</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>추천 코스 가이드</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            팝업과 주변 공간을 잇는 추천 동선
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black border-2 border-stone-900 transition-all ${
              isSaved
                ? 'bg-rose-100 text-rose-700 shadow-[2px_2px_0px_#1c1917]'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-800 shadow-[2px_3px_0px_#1c1917] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
            <span>{isSaved ? '저장됨' : '저장'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 text-xs font-black border-2 border-stone-900 shadow-[2px_3px_0px_#1c1917] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
            <span>{copied ? '복사됨' : '공유'}</span>
          </button>
        </div>
      </div>

      {/* Course Tab Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {courses.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourseIdx(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap border-2 border-stone-900 transition-all ${
              selectedCourseIdx === idx
                ? 'bg-stone-900 text-white shadow-[2px_3px_0px_#1c1917]'
                : 'bg-[#faf8f5] text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>{c.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${c.tagColor} border`}>
              {c.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Course Itinerary Card */}
      <div className="bg-[#faf8f5] border-2 border-stone-900 rounded-3xl p-5 sm:p-6 space-y-5">
        
        {/* Course Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-dashed border-stone-200 pb-3">
          <p className="text-xs sm:text-sm text-stone-700 font-bold">
            {currentCourse.summary}
          </p>
          <div className="flex items-center gap-3 text-xs font-mono font-black text-stone-600">
            <span className="flex items-center gap-1">⏱️ {currentCourse.duration}</span>
            <span>·</span>
            <span className="flex items-center gap-1">📍 {currentCourse.distance}</span>
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {currentCourse.steps.map((st, i) => (
            <div
              key={st.num}
              onClick={() => {
                if (st.eventId) onSelectEvent(st.eventId);
              }}
              className={`bg-white p-4 rounded-2xl border-2 border-stone-900 shadow-sm space-y-2 relative ${
                st.eventId ? 'cursor-pointer hover:border-amber-400 hover:scale-102 transition-transform' : ''
              }`}
            >
              {/* Step Number Badge */}
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-white font-mono font-black text-xs flex items-center justify-center">
                  {st.num}
                </span>
                <span className="text-2xl">{st.icon}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {st.category}
                </span>
                <h5 className="text-sm font-black text-stone-900 mt-1 truncate">
                  {st.name}
                </h5>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                  {st.desc}
                </p>
              </div>

              {st.eventId && (
                <div className="pt-1 flex items-center gap-1 text-[11px] font-black text-rose-600">
                  <span>팝콘에서 바로 예매하기</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
