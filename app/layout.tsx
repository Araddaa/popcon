import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '팝콘 (POPCORN) | 팝업·전시·영화 예매 플랫폼',
  description: '팝가, 팝플 감성의 핫플 팝업스토어 큐레이션 및 실시간 동행 분할 결제 티켓팅 플랫폼 팝콘',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
