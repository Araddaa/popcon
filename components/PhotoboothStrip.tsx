'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, Heart, Download, Share2, X, Check } from 'lucide-react';

interface PhotoboothStripProps {
  onTriggerConfetti?: () => void;
}

export const PhotoboothStrip: React.FC<PhotoboothStripProps> = ({ onTriggerConfetti }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const cuts = [
    {
      id: 1,
      time: '14:20',
      caption: '잔망루피 인형탈이랑 하이파이브 🐾',
      image: '/images/loopy_winter.jpg',
      tag: '에스팩토리',
    },
    {
      id: 2,
      time: '15:15',
      caption: '모네 빛의 터널 6m 거울샷 ✨',
      image: '/images/monet_exhibit.jpg',
      tag: '그라운드시소',
    },
    {
      id: 3,
      time: '16:00',
      caption: '토토로 버스정류장 단독 샷 ☂️',
      image: '/images/ghibli_exhibit.jpg',
      tag: '더현대 ALT.1',
    },
    {
      id: 4,
      time: '17:30',
      caption: '팝콘 버킷 키링 굿즈 득템 완료 🍿',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      tag: '팝콘 스튜디오',
    },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    onTriggerConfetti?.();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) onTriggerConfetti?.();
  };

  return (
    <section className="bg-white border-2 border-stone-900 rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1c1917] relative select-none">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 border-2 border-stone-900 text-stone-800 text-xs font-black shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-stone-700" />
            <span>현장 아카이브</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>팝업 포토 아카이브</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            방문객이 남긴 현장 기록
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black border-2 border-stone-900 transition-all ${
              liked
                ? 'bg-rose-100 text-rose-700 shadow-[2px_2px_0px_#1c1917]'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-800 shadow-[2px_3px_0px_#1c1917] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
            <span>{liked ? '1,429' : '1,428'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 text-xs font-black border-2 border-stone-900 shadow-[2px_3px_0px_#1c1917] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
            <span>{copied ? '복사됨' : '공유'}</span>
          </button>
        </div>
      </div>

      {/* The 4-Cut Film Strip Container (Realistic Kodak Photoism Aesthetic) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-2">
        
        {/* Film Strip Body (Deep Charcoal Vintage Frame) */}
        <div className="w-[280px] sm:w-[320px] bg-stone-950 p-4 sm:p-5 rounded-3xl border-2 border-stone-900 shadow-[6px_8px_0px_rgba(28,25,23,0.9)] text-white space-y-3 relative group">
          
          {/* Top Tape Sticker */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-amber-200/90 border border-amber-400/80 -rotate-2 rounded-xs shadow-2xs pointer-events-none flex items-center justify-center">
            <span className="text-[8px] font-mono font-black text-amber-950 tracking-widest">KODAK 400</span>
          </div>

          {/* Film Top Header */}
          <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 px-1 border-b border-stone-800 pb-1.5">
            <span className="tracking-widest font-black text-amber-300">★ POP-CON PHOTOBOOTH</span>
            <span>2026.11.12</span>
          </div>

          {/* The 4 Photographic Cuts */}
          <div className="space-y-2.5">
            {cuts.map((cut, idx) => (
              <div
                key={cut.id}
                onClick={() => setSelectedPhoto(cut.image)}
                className="relative bg-stone-900 rounded-xl overflow-hidden cursor-pointer group/cut border border-stone-800 hover:border-amber-300 transition-all aspect-[4/3]"
              >
                <img
                  src={cut.image}
                  alt={cut.caption}
                  className="w-full h-full object-cover group-hover/cut:scale-105 transition-transform duration-300"
                />
                
                {/* Photo Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-stone-950/80 backdrop-blur-xs p-1.5 flex items-center justify-between text-[10px] text-white">
                  <span className="font-semibold truncate max-w-[180px]">{cut.caption}</span>
                  <span className="text-[9px] font-mono text-amber-300 bg-stone-900/90 px-1.5 py-0.5 rounded border border-amber-300/40">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Film Strip Footer: Barcode & Film Branding */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[9px] font-mono text-stone-400 px-1">
            <div className="flex items-center gap-1 opacity-60">
              <span className="tracking-tighter font-mono">||||| | ||| |||| |</span>
            </div>
            <span className="tracking-wider text-stone-300 font-bold">SEONGSU 4-CUTS MEMORY</span>
          </div>
        </div>

        {/* Right Feature Panel: Archive description */}
        <div className="flex-1 space-y-4 text-left max-w-lg">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-300">
              현장 기록
            </span>
            <h4 className="text-lg sm:text-xl font-black text-stone-900">
              방문 인증 네컷 사진
            </h4>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              현장에서 촬영한 사진을 팝콘 네컷 프레임으로 아카이빙하고 공유할 수 있습니다.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                alert('📸 등록할 사진 4장을 선택해주세요.');
                onTriggerConfetti?.();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs sm:text-sm border-2 border-stone-900 shadow-[2px_3px_0px_#1c1917] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              <Camera className="w-4 h-4 text-stone-300" />
              <span>사진 등록하기</span>
            </button>
            
            <button
              onClick={() => setSelectedPhoto(cuts[0].image)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm border-2 border-stone-300 transition-all hover:border-stone-900"
            >
              크게 보기 🔍
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox / Modal for Preview */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-2 border-stone-900 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-[8px_10px_0px_#1c1917] space-y-4 animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                <span>📸</span> 성수동 팝콘 인생네컷 원본 뷰어
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-stone-900 bg-stone-100">
              <img src={selectedPhoto} alt="확대 사진" className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono text-stone-500">2026.11.12 · POP-CON SEONGSU</span>
              <button
                onClick={() => {
                  alert('🖼️ 사진이 고화질로 저장되었습니다!');
                  onTriggerConfetti?.();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-900 text-white font-black text-xs shadow-md hover:bg-stone-800 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>사진 다운로드</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
