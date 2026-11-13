import specJson from './specScreens.json';
import { SpecScreenItem } from '../types';

export const SPEC_PARTS: Record<string, string> = {
  '0': '공통 레이아웃 (헤더·배너)',
  '1': '파트 1 · 회원 · 권한 · 관리자 · 모임 · 티켓북 · 펀딩',
  '2': '파트 2 · 컨텐츠 · 수집 · 탐색 · 검색 · 판매처 중개',
  '3': '파트 3 · 티켓팅 (좌석 · 예매 · 결제 · 양도)',
  '4': '파트 4 · 대기열 · 추천 · 알림 · 추첨 · 숙소'
};

export const specScreens: SpecScreenItem[] = specJson as SpecScreenItem[];
