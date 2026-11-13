'use client';

import React from 'react';

const CAPTURES = [
  { id: '01', name: '01_메인_홈_피드', file: '/captures/01_home_feed.png' },
  { id: '02', name: '02_뮤지컬공연_카테고리', file: '/captures/02_category_performance.png' },
  { id: '03', name: '03_팝업스토어_카테고리', file: '/captures/03_category_popup.png' },
  { id: '04', name: '04_전시_카테고리', file: '/captures/04_category_exhibition.png' },
  { id: '05', name: '05_영화시사회_카테고리', file: '/captures/05_category_movie.png' },
  { id: '06', name: '06_콜라보카페_카테고리', file: '/captures/06_category_collab_cafe.png' },
  { id: '07', name: '07_월간_문화_캘린더', file: '/captures/07_tab_calendar.png' },
  { id: '08', name: '08_핫플_지도_탐색', file: '/captures/08_tab_map.png' },
  { id: '09', name: '09_실시간_동행모임_G01', file: '/captures/09_tab_gatherings.png' },
  { id: '10', name: '10_모바일_티켓북', file: '/captures/10_tab_ticketbook.png' },
  { id: '11', name: '11_취소표_대기신청_W01', file: '/captures/11_tab_waitlist.png' },
  { id: '12', name: '12_관심_찜_목록', file: '/captures/12_tab_wishlist.png' },
  { id: '13', name: '13_취향월드컵_성향분석', file: '/captures/13_tab_taste.png' },
  { id: '14', name: '14_상세_데스노트_티켓팅워룸', file: '/captures/14_detail_deathnote_warroom.png' },
  { id: '15', name: '15_상세_데스노트_포스터펼침', file: '/captures/15_detail_deathnote_poster_unrolled.png' },
  { id: '16', name: '16_상세_데스노트_오시는길_지도', file: '/captures/16_detail_deathnote_location_map.png' },
  { id: '17', name: '17_상세_데스노트_스케줄캐스팅', file: '/captures/17_detail_deathnote_schedule_casting.png' },
  { id: '18', name: '18_티켓팅_10초_카운트다운', file: '/captures/18_ticketing_countdown_overlay.png' },
  { id: '19', name: '19_티켓팅_0초_오픈축포', file: '/captures/19_ticketing_opened_splash.png' },
  { id: '20', name: '20_예매_1단계_스마트대기열', file: '/captures/20_booking_step1_queue.png' },
  { id: '21', name: '21_예매_2단계_실시간좌석선택', file: '/captures/21_booking_step2_seats.png' },
  { id: '22', name: '22_예매_3단계_간편결제_분할정산', file: '/captures/22_booking_step3_payment.png' },
  { id: '23', name: '23_예매_4단계_예매완료_티켓발권', file: '/captures/23_booking_step4_complete.png' },
  { id: '24', name: '24_상세_지킬앤하이드_샤롯데', file: '/captures/24_detail_jekyll_musical.png' },
  { id: '25', name: '25_상세_모네_미디어아트_전시', file: '/captures/25_detail_monet_exhibition.png' },
  { id: '26', name: '26_상세_잔망루피_팝업스토어', file: '/captures/26_detail_loopy_popup.png' },
  { id: '27', name: '27_상세_인터스텔라_IMAX영화', file: '/captures/27_detail_interstellar_imax.png' },
];

export default function CleanCapturesPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans">
      {/* Top Floating Action Bar */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-stone-800 px-6 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-xl">📸</span>
          <div>
            <h1 className="text-sm font-black text-white">
              POP-CON 전체 27개 순수 화면 캡쳐 갤러리
            </h1>
            <p className="text-[11px] text-stone-400">
              불필요한 프레임이나 설명 없이 실제 웹 화면만 100% 원본 해상도로 수록
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
          >
            ← 메인 서비스
          </a>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-colors cursor-pointer"
          >
            🖨️ 전체 캡쳐 PDF 인쇄
          </button>
        </div>
      </div>

      {/* Screen Images Full Display */}
      <div className="max-w-[1440px] mx-auto p-4 sm:p-6 space-y-10 print:space-y-0 print:p-0 print:m-0 print:max-w-none">
        {CAPTURES.map((item) => (
          <div
            key={item.id}
            className="space-y-2 print:space-y-0 print:break-after-page print:m-0 print:p-0"
            style={{
              pageBreakAfter: 'always',
              breakAfter: 'page',
            }}
          >
            {/* Screen Title Tag */}
            <div className="flex items-center justify-between text-xs text-stone-400 px-1 print:hidden">
              <span className="font-mono font-bold text-amber-400">[{item.id}/27] {item.name}</span>
              <a
                href={item.file}
                download
                className="text-stone-400 hover:text-white underline text-[11px]"
              >
                원본 다운로드
              </a>
            </div>

            {/* Clean Edge-to-Edge Pure Screenshot Image */}
            <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl print:rounded-none print:border-none print:shadow-none">
              <img
                src={item.file}
                alt={item.name}
                className="w-full h-auto block select-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
