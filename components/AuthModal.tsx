'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Mail, Lock, User, Phone, Sparkles, Building2, 
  ShieldCheck, Eye, EyeOff, Calendar, AlertCircle, CheckCircle2, Gift, ArrowRight 
} from 'lucide-react';
import { PopcornLogo } from './PopcornLogo';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: 'user' | 'organizer' }) => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialTab = 'signup'
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [role, setRole] = useState<'user' | 'organizer'>('user');

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeTimer, setCodeTimer] = useState(180); // 3 minutes
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');

  // Agreement Checkboxes
  const [agreedAll, setAgreedAll] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeIdentity, setAgreeIdentity] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // Success Celebration
  const [isSuccess, setIsSuccess] = useState(false);

  // SMS Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showCodeInput && !phoneVerified && codeTimer > 0) {
      interval = setInterval(() => {
        setCodeTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showCodeInput, phoneVerified, codeTimer]);

  if (!isOpen) return null;

  // 약관 전체 동의 토글
  const handleAgreeAll = (checked: boolean) => {
    setAgreedAll(checked);
    setAgreeAge(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeIdentity(checked);
    setAgreeMarketing(checked);
  };

  // 개별 체크박스 변경 시 전체 동의 상태 업데이트
  const checkIndividualAgree = (
    age = agreeAge,
    terms = agreeTerms,
    privacy = agreePrivacy,
    identity = agreeIdentity,
    marketing = agreeMarketing
  ) => {
    setAgreedAll(age && terms && privacy && identity && marketing);
  };

  // 소셜 간편 가입/로그인
  const handleSocialAuth = (provider: 'kakao' | 'naver' | 'apple' | 'google') => {
    const providerName = 
      provider === 'kakao' ? '카카오' : 
      provider === 'naver' ? '네이버' : 
      provider === 'apple' ? 'Apple' : 'Google';

    setIsSuccess(true);
    setTimeout(() => {
      onLoginSuccess({
        name: `${providerName} 회원`,
        email: `user@${provider}.com`,
        role: 'user',
      });
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  // 휴대폰 인증번호 발송 요청
  const handleSendVerificationCode = () => {
    if (!phone || phone.length < 10) {
      alert('올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)');
      return;
    }
    setShowCodeInput(true);
    setCodeTimer(180);
    alert(`[POP-CON 본인인증]\n${phone} 번호로 인증번호 [7788]이 발송되었습니다.\n(테스트용 인증번호: 7788)`);
  };

  // 휴대폰 인증번호 확인
  const handleVerifyCode = () => {
    if (verificationCode === '7788' || verificationCode.length === 4) {
      setPhoneVerified(true);
      setShowCodeInput(false);
      alert('✅ PASS 본인인증이 정상 완료되었습니다!');
    } else {
      alert('인증번호가 일치하지 않습니다. (테스트 번호: 7788)');
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = () => {
    if (!email || !email.includes('@')) {
      alert('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    setEmailChecked(true);
    alert(`✨ [${email}]은(는) 가입 가능한 이메일입니다.`);
  };

  // 비밀번호 보안 강도 계산
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: 'bg-stone-200' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) || /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, text: '위험 (8자 이상 영문·숫자 조합)', color: 'bg-red-500' };
    if (score === 3) return { level: 2, text: '보통 (특수문자 포함 권장)', color: 'bg-amber-500' };
    return { level: 3, text: '안전 (강력한 보안)', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength();
  const isPasswordMatch = password && passwordConfirm && password === passwordConfirm;
  const isPasswordMismatch = passwordConfirm && password !== passwordConfirm;

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'login') {
      if (!email || !password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
      }
      onLoginSuccess({
        name: email.split('@')[0],
        email: email,
        role: 'user',
      });
      onClose();
      return;
    }

    // 회원가입 유효성 검사
    if (!name.trim()) {
      alert('이름(닉네임)을 입력해주세요.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('올바른 이메일을 입력해주세요.');
      return;
    }
    if (!phoneVerified) {
      alert('휴대폰 본인인증을 완료해주세요. (인증번호 받기 후 7788 입력)');
      return;
    }
    if (!password || password.length < 8) {
      alert('비밀번호를 8자리 이상 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (!agreeAge || !agreeTerms || !agreePrivacy || !agreeIdentity) {
      alert('필수 이용약관에 모두 동의해주세요.');
      return;
    }

    // 회원가입 성공
    setIsSuccess(true);
    setTimeout(() => {
      onLoginSuccess({
        name: name,
        email: email,
        role: role,
      });
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border-2 border-stone-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-[8px_8px_0px_#1c1917] my-6 relative max-h-[92vh] flex flex-col">
        
        {/* 가입 완료 축하 스플래시 오버레이 */}
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-amber-400 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center mb-4 shadow-xl animate-bounce">
              <Gift className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-stone-950 mb-2">
              🎉 팝콘에 오신 것을 환영합니다!
            </h3>
            <p className="text-stone-900 font-bold text-sm mb-4">
              회원가입 기념 <strong className="underline decoration-2">3,000P 웰컴 포인트</strong>와 <strong className="underline decoration-2">예매 수수료 무료 쿠폰</strong>이 지급되었습니다.
            </p>
            <div className="px-4 py-1.5 rounded-full bg-stone-950 text-white font-mono text-xs font-bold">
              잠시 후 자동으로 로그인됩니다...
            </div>
          </div>
        )}

        {/* 1. Modal Header Bar */}
        <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <PopcornLogo size="sm" />
            <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-300 font-mono text-[10px] font-black">
              {tab === 'signup' ? 'SIGN UP' : 'LOGIN'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Header Title & Welcoming Badge */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-stone-950 tracking-tight">
              {tab === 'signup' ? 'POP-CON 회원가입' : 'POP-CON 로그인'}
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              {tab === 'signup' 
                ? '3초 만에 가입하고 실시간 티켓팅 & 동행 모임 혜택을 누리세요.'
                : '문화 행사 통합 예매와 실시간 동행 플랫폼으로 로그인합니다.'}
            </p>

            {/* 신규 가입 혜택 배너 (회원가입 시 상시 노출) */}
            {tab === 'signup' && (
              <div className="mt-2.5 p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-2.5 text-xs text-amber-950 font-bold shadow-2xs">
                <Gift className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>가입 즉시 <strong>3,000P 적립</strong> + <strong>티켓팅 예매수수료 0원 쿠폰</strong> 증정!</span>
              </div>
            )}
          </div>

          {/* 3. Tab Switcher: [로그인] vs [회원가입] */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl text-xs font-black border border-stone-200">
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              회원가입 (신규 가입)
            </button>
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              로그인 (기존 회원)
            </button>
          </div>

          {/* 4. SNS 1초 간편 가입 버튼 그룹 */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-500 block">
              {tab === 'signup' ? 'SNS 계정으로 1초 만에 가입' : 'SNS 계정으로 간편 로그인'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* 카카오 */}
              <button
                type="button"
                onClick={() => handleSocialAuth('kakao')}
                className="py-2.5 px-3 rounded-xl bg-[#fee500] hover:bg-[#fedd00] text-[#191919] font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.874 5.184 4.675 6.551-.205.76-.74 2.753-.847 3.176-.134.526.193.519.407.377.168-.112 2.673-1.815 3.754-2.55.65.093 1.32.143 2.011.143 5.523 0 10-3.477 10-7.765C22 6.477 17.523 3 12 3z"/>
                </svg>
                <span>카카오로 시작</span>
              </button>

              {/* 네이버 */}
              <button
                type="button"
                onClick={() => handleSocialAuth('naver')}
                className="py-2.5 px-3 rounded-xl bg-[#03c75a] hover:bg-[#02b350] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <span className="font-black text-xs">N</span>
                <span>네이버로 시작</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialAuth('apple')}
                className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.79 1.09-1.89.97-2.89-.94.04-2.07.63-2.74 1.42-.58.68-1.1 1.79-.96 2.87 1.05.08 2.11-.55 2.73-1.4z"/>
                </svg>
                <span>Apple</span>
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98] border border-stone-300 shadow-2xs cursor-pointer"
              >
                <span className="font-bold text-red-500">G</span>
                <span>Google</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] font-bold text-stone-400">
              {tab === 'signup' ? '또는 직접 정보 입력 가입' : '또는 이메일 로그인'}
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* 5. Main Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* 회원 유형 선택 (일반 관람객 vs 행사 주최사) */}
            {tab === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-600 block">
                  가입 회원 유형
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'user'
                        ? 'border-amber-400 bg-amber-50 text-amber-950 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-600" />
                    <div className="text-left">
                      <p className="font-black text-xs">일반 관람객</p>
                      <p className="text-[10px] text-stone-500">예매 &amp; 동행 모임</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      role === 'organizer'
                        ? 'border-purple-400 bg-purple-50 text-purple-950 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <div className="text-left">
                      <p className="font-black text-xs">행사 주최사</p>
                      <p className="text-[10px] text-stone-500">티켓 오픈 &amp; 관객 관리</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 1. 이름 (닉네임) */}
            {tab === 'signup' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-bold text-stone-700">
                    {role === 'organizer' ? '주최사명 / 담당자 이름' : '이름 (실명 또는 닉네임)'}
                    <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <span className="text-stone-400 text-[10px] font-mono">{name.length}/20</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 20))}
                    placeholder={role === 'organizer' ? '예: 쇼노트 기획팀' : '예: 홍길동'}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none text-stone-900 transition-all"
                  />
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                </div>
              </div>
            )}

            {/* 2. 휴대폰 번호 & 본인인증 (PASS/SMS 인증) */}
            {tab === 'signup' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-bold text-stone-700 flex items-center gap-1">
                    <span>휴대폰 번호 (모바일 티켓팅 본인확인용)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  {phoneVerified && (
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10.5px]">
                      <CheckCircle2 className="w-3 h-3" /> 인증완료
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phone}
                      disabled={phoneVerified}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                      placeholder="숫자만 입력 (예: 01012345678)"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-mono focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none text-stone-900 transition-all disabled:bg-stone-100 disabled:text-stone-500"
                    />
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={phoneVerified}
                    className="px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white disabled:text-stone-400 font-bold text-xs flex-shrink-0 cursor-pointer transition-colors"
                  >
                    {phoneVerified ? '인증됨' : showCodeInput ? '재전송' : '인증요청'}
                  </button>
                </div>

                {/* 인증번호 입력 필드 */}
                {showCodeInput && !phoneVerified && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-300 space-y-1 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-950">인증번호 4자리 입력 (테스트: 7788)</span>
                      <span className="font-mono text-rose-600 font-bold">{formatTimer(codeTimer)}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.slice(0, 4))}
                        placeholder="7788"
                        className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs font-mono text-center tracking-widest font-black outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs cursor-pointer transition-colors"
                      >
                        확인
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. 이메일 주소 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-stone-700">
                  이메일 주소 (로그인 계정 ID)
                  <span className="text-rose-500 ml-0.5">*</span>
                </label>
                {emailChecked && (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10.5px]">
                    <CheckCircle2 className="w-3 h-3" /> 확인완료
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailChecked(false);
                    }}
                    placeholder="user@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 pl-9 text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none text-stone-900 transition-all"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                </div>

                {tab === 'signup' && (
                  <button
                    type="button"
                    onClick={handleCheckEmail}
                    className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex-shrink-0 border border-stone-300 cursor-pointer transition-colors"
                  >
                    중복확인
                  </button>
                )}
              </div>
            </div>

            {/* 4. 비밀번호 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-bold text-stone-700">
                  비밀번호
                  <span className="text-rose-500 ml-0.5">*</span>
                </label>
                {tab === 'signup' && password && (
                  <span className={`text-[10px] font-bold ${passwordStrength.level === 3 ? 'text-emerald-600' : passwordStrength.level === 2 ? 'text-amber-600' : 'text-red-500'}`}>
                    보안: {passwordStrength.text}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상 영문, 숫자, 특수문자 조합"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 pl-9 pr-9 text-xs focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none text-stone-900 transition-all font-mono"
                />
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* 비밀번호 보안 강도 바 (회원가입 시) */}
              {tab === 'signup' && password && (
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <div className={`h-1 rounded-full ${passwordStrength.level >= 1 ? passwordStrength.color : 'bg-stone-200'}`} />
                  <div className={`h-1 rounded-full ${passwordStrength.level >= 2 ? passwordStrength.color : 'bg-stone-200'}`} />
                  <div className={`h-1 rounded-full ${passwordStrength.level >= 3 ? passwordStrength.color : 'bg-stone-200'}`} />
                </div>
              )}
            </div>

            {/* 5. 비밀번호 확인 (회원가입 시) */}
            {tab === 'signup' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-bold text-stone-700">
                    비밀번호 확인
                    <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  {isPasswordMatch && (
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10.5px]">
                      <Check className="w-3 h-3" /> 일치합니다
                    </span>
                  )}
                  {isPasswordMismatch && (
                    <span className="text-red-500 font-bold text-[10.5px]">
                      일치하지 않습니다
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="비밀번호를 한 번 더 입력하세요"
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 pl-9 text-xs focus:ring-2 focus:bg-white outline-none text-stone-900 transition-all font-mono ${
                      isPasswordMismatch
                        ? 'border-red-400 focus:ring-red-300'
                        : isPasswordMatch
                        ? 'border-emerald-400 focus:ring-emerald-300'
                        : 'border-stone-300 focus:ring-amber-400'
                    }`}
                  />
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                </div>
              </div>
            )}

            {/* 6. 생년월일 & 성별 (회원가입 시 본인확인용 보조 옵션) */}
            {tab === 'signup' && (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">생년월일 6자리 (선택)</label>
                  <input
                    type="text"
                    value={birth}
                    onChange={(e) => setBirth(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="YYMMDD (예: 981225)"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">성별 (선택)</label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setGender('M')}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        gender === 'M' ? 'border-amber-400 bg-amber-50 text-amber-950 font-black' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      남성
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('F')}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        gender === 'F' ? 'border-amber-400 bg-amber-50 text-amber-950 font-black' : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      여성
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. 약관 동의 체크박스 그룹 (회원가입 시) */}
            {tab === 'signup' && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2.5 text-xs text-stone-700 mt-2">
                {/* 전체 동의 */}
                <label className="flex items-center gap-2 cursor-pointer font-black text-stone-900 pb-2 border-b border-stone-200">
                  <input
                    type="checkbox"
                    checked={agreedAll}
                    onChange={(e) => handleAgreeAll(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <span>약관 전체 동의 (선택 항목 포함)</span>
                </label>

                {/* 개별 항목 */}
                <div className="space-y-1.5 pl-1 text-[11.5px] text-stone-600">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreeAge}
                        onChange={(e) => {
                          setAgreeAge(e.target.checked);
                          checkIndividualAgree(e.target.checked, agreeTerms, agreePrivacy, agreeIdentity, agreeMarketing);
                        }}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-amber-500 accent-amber-500"
                      />
                      <span><strong className="text-amber-800">[필수]</strong> 만 14세 이상 이용 동의</span>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          checkIndividualAgree(agreeAge, e.target.checked, agreePrivacy, agreeIdentity, agreeMarketing);
                        }}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-amber-500 accent-amber-500"
                      />
                      <span><strong className="text-amber-800">[필수]</strong> POP-CON 서비스 이용약관</span>
                    </div>
                    <span className="text-[10px] text-stone-400 hover:text-stone-700 underline">전문</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => {
                          setAgreePrivacy(e.target.checked);
                          checkIndividualAgree(agreeAge, agreeTerms, e.target.checked, agreeIdentity, agreeMarketing);
                        }}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-amber-500 accent-amber-500"
                      />
                      <span><strong className="text-amber-800">[필수]</strong> 개인정보 수집 및 이용 동의</span>
                    </div>
                    <span className="text-[10px] text-stone-400 hover:text-stone-700 underline">전문</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreeIdentity}
                        onChange={(e) => {
                          setAgreeIdentity(e.target.checked);
                          checkIndividualAgree(agreeAge, agreeTerms, agreePrivacy, e.target.checked, agreeMarketing);
                        }}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-amber-500 accent-amber-500"
                      />
                      <span><strong className="text-amber-800">[필수]</strong> 모바일 티켓 본인확인 서비스 동의</span>
                    </div>
                    <span className="text-[10px] text-stone-400 hover:text-stone-700 underline">전문</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-stone-200/60 text-stone-500">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreeMarketing}
                        onChange={(e) => {
                          setAgreeMarketing(e.target.checked);
                          checkIndividualAgree(agreeAge, agreeTerms, agreePrivacy, agreeIdentity, e.target.checked);
                        }}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-amber-500 accent-amber-500"
                      />
                      <span>[선택] 티켓팅 오픈 D-1 및 취소표 알림톡/SMS 수신</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-bold">+500P 적립</span>
                  </label>
                </div>
              </div>
            )}

            {/* 8. Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-stone-950 hover:bg-stone-850 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[4px_4px_0px_#f59e0b] hover:shadow-[2px_2px_0px_#f59e0b] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>
                  {tab === 'signup' 
                    ? `🎉 ${name ? name + ' 님으로' : ''} 가입 완료하고 3,000P 받기`
                    : '팝콘 로그인하기'}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Footer switcher */}
            <div className="text-center pt-2 text-xs text-stone-500">
              {tab === 'signup' ? (
                <p>
                  이미 팝콘 계정이 있으신가요?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-stone-900 font-black hover:underline cursor-pointer ml-1"
                  >
                    로그인하기
                  </button>
                </p>
              ) : (
                <p>
                  아직 팝콘 회원이 아니신가요?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('signup')}
                    className="text-amber-700 font-black hover:underline cursor-pointer ml-1"
                  >
                    3초 회원가입 (+3,000P)
                  </button>
                </p>
              )}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
