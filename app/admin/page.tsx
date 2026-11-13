'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { AdminConsole } from '../../components/AdminConsole';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Breadcrumb Navigation */}
      <header className="bg-stone-900 text-white px-4 sm:px-8 py-3 border-b-2 border-stone-950 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors cursor-pointer border border-stone-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인 서비스로 돌아가기</span>
          </Link>
          <span className="text-stone-600">/</span>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-black text-sm">POP-CON</span>
            <span className="text-xs font-bold text-stone-300">통합 관리자 및 주최사 콘솔</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-stone-300 bg-stone-800/80 px-3 py-1 rounded-xl border border-stone-700">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>최고 관리자: <strong className="text-white">송민재</strong> (Super Admin)</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold hover:underline"
          >
            <span>유저 화면 보기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Admin Console Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 px-3 sm:px-6">
        <AdminConsole isStandalonePage={true} />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-400 border-t border-stone-200 bg-white">
        POP-CON 문화 플랫폼 · 주최사 &amp; 운영 관리자 전용 보안 세션
      </footer>
    </div>
  );
}
