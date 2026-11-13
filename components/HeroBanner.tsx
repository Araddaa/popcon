'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { HeroBannerItem } from '../data/mockData';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, MapPin } from 'lucide-react';

interface HeroBannerProps {
  banners: HeroBannerItem[];
  selectedCategory: string;
  onSelectEvent: (id: number) => void;
}

interface SlideItem extends HeroBannerItem {
  slideKey: string;
  originalIndex: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners,
  selectedCategory,
  onSelectEvent,
}) => {
  // Filter banners based on selected category if not 'all'
  const filteredBanners = useMemo(() => {
    if (selectedCategory === 'all') return banners;
    return banners.filter((b) => b.category === selectedCategory);
  }, [banners, selectedCategory]);

  const total = filteredBanners.length;

  // Base list ensuring at least 5 items for cloning stability in 5-card cylinder
  const baseItems = useMemo(() => {
    if (total === 0) return [];
    if (total === 1) return filteredBanners;
    let list = [...filteredBanners];
    while (list.length < 5) {
      list = [...list, ...filteredBanners];
    }
    return list;
  }, [filteredBanners, total]);

  const baseCount = baseItems.length;

  // 5-Card 3D Cylinder: 4 prefix clones and 4 suffix clones
  const slides = useMemo<SlideItem[]>(() => {
    if (baseCount <= 1) {
      return baseItems.map((b, i) => ({
        ...b,
        slideKey: `single-${b.id}-${i}`,
        originalIndex: i % total,
      }));
    }

    const prefixClones = baseItems.slice(-4).map((b, i) => ({
      ...b,
      slideKey: `prefix-${b.id}-${i}`,
      originalIndex: (baseCount - 4 + i) % total,
    }));

    const middleItems = baseItems.map((b, i) => ({
      ...b,
      slideKey: `mid-${b.id}-${i}`,
      originalIndex: i % total,
    }));

    const suffixClones = baseItems.slice(0, 4).map((b, i) => ({
      ...b,
      slideKey: `suffix-${b.id}-${i}`,
      originalIndex: i % total,
    }));

    return [...prefixClones, ...middleItems, ...suffixClones];
  }, [baseItems, baseCount, total]);

  // Real items start at trackIndex = 4 (middle items start)
  const [trackIndex, setTrackIndex] = useState(4);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isSliding, setIsSliding] = useState(false);
  const [isCenterHovered, setIsCenterHovered] = useState(false);

  // Measure ACTUAL available container width via ResizeObserver
  const rootRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(860);

  // Touch swipe support
  const touchStartXRef = useRef<number | null>(null);

  // Reset track index when category or total changes
  useEffect(() => {
    setEnableTransition(false);
    setTrackIndex(baseCount > 1 ? 4 : 0);
    setIsSliding(false);
  }, [selectedCategory, total, baseCount]);

  // Real-time ResizeObserver
  useEffect(() => {
    if (!rootRef.current) return;
    const updateSize = () => {
      if (rootRef.current) {
        const measured = rootRef.current.clientWidth;
        if (measured > 0) {
          setContainerWidth(measured);
        }
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(rootRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // 유저 요청: "카드의 크기를 살짝만 키워볼까"
  // 기존보다 가로/세로를 살짝 키워(268x415 -> 298x460) 더욱 시원하고 몰입감 넘치는 5-카드 3D 원통 뷰 제공!
  const isMobile = containerWidth < 600;
  const isTablet = containerWidth >= 600 && containerWidth < 820;

  const cardWidth = isMobile
    ? Math.min(280, containerWidth - 80)
    : isTablet
    ? 265
    : 298;

  const cardHeight = isMobile ? 410 : isTablet ? 435 : 460;

  // 3D 원통형 위치 오프셋 (수평 간격 및 원근감 계산: 카드 크기 증가에 맞춘 자연스러운 원통 곡면)
  const step1 = isMobile ? 128 : isTablet ? 155 : 185; // 내측 1단계 카드 간격
  const step2 = isMobile ? 225 : isTablet ? 275 : 335; // 외측 2단계 카드 간격

  // Re-enable transition after teleporting instant jumps
  useEffect(() => {
    if (!enableTransition) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setEnableTransition(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [enableTransition]);

  const handlePrev = useCallback(() => {
    if (baseCount <= 1 || isSliding) return;
    setIsCenterHovered(false);
    setIsSliding(true);
    setEnableTransition(true);
    setTrackIndex((prev) => prev - 1);
  }, [baseCount, isSliding]);

  const handleNext = useCallback(() => {
    if (baseCount <= 1 || isSliding) return;
    setIsCenterHovered(false);
    setIsSliding(true);
    setEnableTransition(true);
    setTrackIndex((prev) => prev + 1);
  }, [baseCount, isSliding]);

  // Seamless wrap-around when reaching clone boundaries
  const handleTransitionEnd = () => {
    setIsSliding(false);
    if (baseCount <= 1) return;

    if (trackIndex >= baseCount + 4) {
      setEnableTransition(false);
      setTrackIndex(4);
    } else if (trackIndex <= 3) {
      setEnableTransition(false);
      setTrackIndex(baseCount + 3);
    }
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
  };

  if (total === 0) return null;

  // Determine current active original index for pagination dots
  const currentActiveSlide = slides[trackIndex] || slides[4] || slides[0];
  const activeDotIndex = currentActiveSlide ? currentActiveSlide.originalIndex : 0;

  return (
    <div
      ref={rootRef}
      className="w-full flex flex-col items-center justify-center select-none my-2 select-none"
    >
      {/* 1. Carousel Row: 3D Cylindrical Revolving Stage + Floating Arrows */}
      <div className="relative w-full max-w-5xl lg:max-w-6xl flex items-center justify-center">
        
        {/* Left Arrow Button (위치 살짝 상향 top-[46%], 화이트 플로팅 캡슐로 시인성 100% 확보) */}
        {total > 1 && (
          <button
            onClick={handlePrev}
            disabled={isSliding}
            className="absolute left-1 sm:left-3 lg:left-4 top-[46%] -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-stone-900 border border-stone-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.22)] active:scale-90 flex items-center justify-center transition-all duration-200 cursor-pointer group"
            aria-label="이전 행사 카드"
            title="이전 카드 (중앙으로 회전)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.4] text-stone-800 group-hover:text-black group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* 3D Cylindrical Stage: 시원하게 키운 카드(298x460)로 5장이 유려한 원통 곡면으로 회전 */}
        <div
          className="relative w-full h-[460px] sm:h-[515px] [perspective:1400px] select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((item, idx) => {
            const diff = idx - trackIndex;
            const isCenter = diff === 0;
            const isInnerLeft = diff === -1;
            const isInnerRight = diff === 1;
            const isOuterLeft = diff === -2;
            const isOuterRight = diff === 2;

            // 5개 카드의 원통형 3D 좌표 (X축 이동, Z축 깊이, Y축 회전, 스케일)
            let xOffset = 0;
            let zOffset = -120;
            let rotateY = 0;
            let scale = 0.65;
            let opacity = 0;
            let zIndex = 0;
            let pointerEvents = 'pointer-events-none';

            let cardBoxShadow = 'none';

            if (isCenter) {
              // [중앙 메인 카드]: 전면을 향해 앞으로 나오며 100% 선명도
              // 유저 요청: 마우스 갖다대면 조금 커지는 연출 (scale 1.05 -> 1.09, zOffset 30 -> 48px, 소프트 앰비언트 섀도우)
              xOffset = 0;
              zOffset = isCenterHovered ? 48 : 30;
              rotateY = 0;
              scale = isCenterHovered ? 1.09 : 1.05;
              opacity = 1;
              zIndex = isCenterHovered ? 35 : 30;
              pointerEvents = 'pointer-events-auto';
              cardBoxShadow = isCenterHovered
                ? '0 24px 50px -12px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255, 255, 255, 0.15)'
                : '0 12px 28px -10px rgba(0, 0, 0, 0.28)';
            } else if (isInnerLeft) {
              // [좌측 1단계 카드]: 중앙 쪽을 향해 회전(22deg)하며 원통 곡면 형성
              xOffset = -step1;
              zOffset = -15;
              rotateY = 22;
              scale = 0.90;
              opacity = 0.82;
              zIndex = 20;
              pointerEvents = 'pointer-events-auto';
            } else if (isInnerRight) {
              // [우측 1단계 카드]: 중앙 쪽을 향해 회전(-22deg)하며 원통 곡면 형성
              xOffset = step1;
              zOffset = -15;
              rotateY = -22;
              scale = 0.90;
              opacity = 0.82;
              zIndex = 20;
              pointerEvents = 'pointer-events-auto';
            } else if (isOuterLeft) {
              // [좌측 2단계 카드]: 원통 가장자리 곡면 (너무 흐리지 않게 65% 선명도로 원통의 볼륨감 완성)
              xOffset = -step2;
              zOffset = -60;
              rotateY = 38;
              scale = 0.78;
              opacity = 0.65;
              zIndex = 10;
              pointerEvents = 'pointer-events-auto';
            } else if (isOuterRight) {
              // [우측 2단계 카드]: 원통 가장자리 곡면 (너무 흐리지 않게 65% 선명도로 원통의 볼륨감 완성)
              xOffset = step2;
              zOffset = -60;
              rotateY = -38;
              scale = 0.78;
              opacity = 0.65;
              zIndex = 10;
              pointerEvents = 'pointer-events-auto';
            } else if (diff === -3) {
              xOffset = -step2 - 70;
              zOffset = -110;
              rotateY = 50;
              scale = 0.68;
              opacity = 0;
            } else if (diff === 3) {
              xOffset = step2 + 70;
              zOffset = -110;
              rotateY = -50;
              scale = 0.68;
              opacity = 0;
            }

            return (
              <div
                key={item.slideKey}
                onTransitionEnd={isCenter ? handleTransitionEnd : undefined}
                onClick={() => {
                  if (isCenter) {
                    onSelectEvent(item.id);
                  } else if (diff < 0) {
                    handlePrev();
                  } else if (diff > 0) {
                    handleNext();
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `translate(-50%, -50%) translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  boxShadow: cardBoxShadow,
                  transition: enableTransition
                    ? 'transform 420ms cubic-bezier(0.25, 1, 0.5, 1), opacity 420ms ease, box-shadow 360ms ease'
                    : 'none',
                  WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                  isolation: 'isolate',
                }}
                onMouseEnter={() => {
                  if (isCenter) setIsCenterHovered(true);
                }}
                onMouseLeave={() => {
                  if (isCenter) setIsCenterHovered(false);
                }}
                className={`rounded-3xl overflow-hidden cursor-pointer border-2 transition-colors select-none outline-none group ${pointerEvents} ${
                  isCenter
                    ? 'border-stone-900'
                    : 'border-stone-800'
                }`}
                title={
                  isCenter
                    ? '클릭하여 상세 페이지로 이동'
                    : diff < 0
                    ? '클릭하여 이전 카드를 중앙으로 회전'
                    : '클릭하여 다음 카드를 중앙으로 회전'
                }
              >
                {/* [Full-Bleed Poster Image] 마우스 호버 시 네모로 깜빡이는 크롬 렌더링 버그 방지를 위해 이미지 자체에도 rounded-3xl 적용 */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl pointer-events-none select-none"
                />

                {/* Top Gradient for badges */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none rounded-t-3xl" />
                
                {/* Bottom Gradient for text (참조 이미지 스타일) */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none rounded-b-3xl" />

                {/* Card Content Container */}
                <div className="relative z-10 w-full h-full p-4 sm:p-5 flex flex-col justify-between">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white text-[10.5px] font-black tracking-wider border border-white/20">
                        {item.tag}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-[#3b82f6]/90 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs border border-blue-400/30">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>예약 가능</span>
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold backdrop-blur-xs border bg-black/65 text-white border-white/20">
                      {item.dDay}
                    </span>
                  </div>

                  {/* Bottom Info: 큰 타이틀 + 기간 + 📍 장소 */}
                  <div className="space-y-1.5 pt-2 text-left">
                    {/* 1. Large Bold White Title */}
                    <h3 className={`font-black tracking-tight leading-snug drop-shadow-md truncate transition-colors ${
                      isCenter
                        ? 'text-white text-lg sm:text-xl group-hover:text-stone-200'
                        : 'text-stone-200 text-sm sm:text-base'
                    }`}>
                      {item.title}
                    </h3>

                    {/* 2. Date Period */}
                    <p className="text-xs sm:text-[12.5px] font-medium text-stone-200 tracking-tight drop-shadow-sm truncate">
                      {item.period}
                    </p>

                    {/* 3. Location with MapPin + Hover CTA */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-1 text-xs text-stone-300 font-medium truncate drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-stone-300 flex-shrink-0" />
                        <span className="truncate">{item.spot}</span>
                      </div>

                      {/* Center Hover 시 '상세보기 →' 뱃지 노출, 평소에는 카운터 뱃지 */}
                      {isCenter && isCenterHovered ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-white text-stone-950 text-[11px] font-black tracking-tight flex-shrink-0 shadow-lg ml-2 flex items-center gap-1 transition-all duration-200">
                          <span>상세보기</span>
                          <span className="text-[12px] font-bold">&rarr;</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-stone-300 text-[10px] font-mono font-bold flex-shrink-0 border border-white/20 ml-2">
                          {item.originalIndex + 1} / {total}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button (위치 살짝 상향 top-[46%], 화이트 플로팅 캡슐로 시인성 100% 확보) */}
        {total > 1 && (
          <button
            onClick={handleNext}
            disabled={isSliding}
            className="absolute right-1 sm:right-3 lg:right-4 top-[46%] -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-stone-900 border border-stone-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.22)] active:scale-90 flex items-center justify-center transition-all duration-200 cursor-pointer group"
            aria-label="다음 행사 카드"
            title="다음 카드 (중앙으로 회전)"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.4] text-stone-800 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

      </div>

      {/* 2. Bottom Center Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {filteredBanners.map((b, idx) => {
          const isActive = idx === activeDotIndex;
          return (
            <button
              key={b.id}
              onClick={() => {
                if (isSliding) return;
                setEnableTransition(true);
                setTrackIndex(4 + idx);
              }}
              className={`h-2.5 transition-all duration-300 border cursor-pointer ${
                isActive
                  ? 'w-7 bg-stone-900 border-stone-900 rounded-full'
                  : 'w-2.5 bg-stone-300 border-stone-400 hover:bg-stone-500 rounded-full'
              }`}
              aria-label={`행사 ${idx + 1} (${b.title})로 이동`}
              title={`${idx + 1}. ${b.title}`}
            />
          );
        })}
      </div>

    </div>
  );
};
