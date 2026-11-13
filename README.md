# 🍿 POP-CON (팝콘) — 문화 · 팝업 · 공연 실시간 예매 & 주최사 관리자 콘솔 플랫폼

> **실시간 티켓팅 워룸, 동행 연석 분할 결제, 30초 동적 QR 티켓 지갑, 대화형 위치 피커 지도 및 비정형 좌석 배치도 스튜디오가 결합된 차세대 컬처 플랫폼**

[![Deploy to GitHub Pages](https://github.com/Araddaa/popcon/actions/workflows/deploy.yml/badge.svg)](https://github.com/Araddaa/popcon/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-f59e0b?style=flat-square&logo=github)](https://araddaa.github.io/popcon/)

---

## 🌐 라이브 접속 링크
* **공식 웹 서비스 (GitHub Pages)**: [https://araddaa.github.io/popcon/](https://araddaa.github.io/popcon/)
* **통합 관리자 콘솔 (/admin)**: [https://araddaa.github.io/popcon/admin](https://araddaa.github.io/popcon/admin)

---

## 🌟 주요 핵심 기능

### 1. 🎟️ 엔드투엔드 티켓팅 워룸 & 예매 시스템
* **10초 팝콘 카운트다운 오버레이**: 티켓 오픈 10초 전 심장박동 효과음과 팝콘 축포 폭발
* **4단계 스마트 예매 플로우**:
  1. 가상 대기열 (순번 대기표 및 예상 대기시간)
  2. 실시간 좌석 선택 (VIP, R, S, OP석)
  3. 간편 결제 & 동행 1/N 연석 분할 결제
  4. 예매 완료 및 모바일 티켓 발권
* **30초 회전 동적 QR 티켓 지갑**: 캡처 방지 워터마크 타이머 및 오프라인 모드 지원

### 2. 👑 주최사 & 통합 관리자 콘솔 (Admin Studio)
* **회원 관리 & 제재 시스템**:
  * 실시간 회원 검색 및 필터링
  * 영구 정지 (Ban), 임시 비활성화 (3일/7일/14일/30일), 경고 부여 (+1), 정상 복구
  * 일괄 제재 및 관리자 조치 감사 로그 (Audit Trail)
* **행사 콘텐츠 & 포스터 에디터**:
  * 타이틀, 슬로건, 카테고리, 일정, 러닝타임, 시놉시스 및 캐스팅 라인업 관리
* **오시는 길 & 대화형 지도 위치 피커**:
  * 지도 위 클릭 또는 핀 드래그로 실시간 GPS 좌표 및 주소 자동 확정
  * Google 지도, 위성 지도, 카카오맵/네이버/Google 길찾기 링크 연동
* **자유 비정형 좌석 배치도 스튜디오**:
  * 사각 네모 모양의 한계를 탈피한 **실제 극장 건축 기반 5대 프리셋**:
    1. 샤롯데씨어터형 3구역 부채꼴 대극장 (좌/우 사선 날개석 + OP석)
    2. KSPO DOME형 T자 돌출무대 아레나 (돌출 런웨이 + VIP 스탠딩 펜스석)
    3. 예술의전당형 다층 발코니 & 박스석 (1층 오케스트라 + 2층 발코니)
    4. 성수 에스팩토리 비정형 아일랜드 라운지 (비대칭 패션쇼 런웨이)
    5. 대학로 소극장 지그재그 시야보장형
  * 곡률 슬라이더 (0%~100%), 날개 회전각 슬라이더, 지그재그(Stagger) 시야각 토글
  * 좌석 지우개 / 브러시 도구로 자유롭게 깎아내기 및 실시간 매출 시뮬레이터

---

## 🛠️ 기술 스택 (Tech Stack)
* **Framework**: Next.js 16 (App Router, Static Export)
* **UI & Styling**: React 19, Tailwind CSS v4, Lucide React
* **Maps & Visuals**: Leaflet.js, Canvas Confetti
* **CI/CD & Hosting**: GitHub Pages, GitHub Actions

---

## 🚀 로컬 실행 방법 (Local Development)

```bash
# 1. 저장소 클론
git clone https://github.com/Araddaa/popcon.git
cd popcon

# 2. 의존성 패키지 설치
npm install

# 3. 로컬 개발 서버 시작
npm run dev

# 4. 브라우저에서 확인
# http://localhost:3000
```
