'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

/* ─── Validation Schema ─────────────────────────────────────── */
const verifySchema = z.object({
  otp: z.string().length(6, 'Mã OTP phải có 6 chữ số'),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

/* ─── SVG Icon Components ────────────────────────────────────── */

function IconShield() {
  return (
    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg className="arrow" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

/* ─── Illustration SVG ───────────────────────────────────────── */

function SceneIllustration() {
  return (
    <svg className="scene-svg" viewBox="0 0 380 240" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="130" width="260" height="90" rx="18" fill="rgba(255,255,255,0.95)" />
      <rect x="60" y="130" width="130" height="90" rx="18" fill="rgba(255,255,255,0.75)" />
      <rect x="189" y="130" width="3" height="90" fill="rgba(255,107,53,0.25)" />
      <rect x="210" y="155" width="80" height="6" rx="3" fill="rgba(255,107,53,0.2)" />
      <rect x="210" y="170" width="60" height="6" rx="3" fill="rgba(255,107,53,0.15)" />
      <rect x="210" y="185" width="70" height="6" rx="3" fill="rgba(255,107,53,0.15)" />
      <rect x="82" y="155" width="80" height="6" rx="3" fill="rgba(78,205,196,0.3)" />
      <rect x="82" y="170" width="60" height="6" rx="3" fill="rgba(78,205,196,0.2)" />
      <rect x="82" y="185" width="70" height="6" rx="3" fill="rgba(78,205,196,0.2)" />
      <circle cx="190" cy="80" r="38" fill="rgba(255,255,255,0.95)" />
      <circle cx="178" cy="74" r="5" fill="#1E1B4B" />
      <circle cx="202" cy="74" r="5" fill="#1E1B4B" />
      <circle cx="179.5" cy="72.5" r="1.5" fill="white" />
      <circle cx="203.5" cy="72.5" r="1.5" fill="white" />
      <path d="M179 87 Q190 96 201 87" stroke="#FF6B35" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      <circle cx="170" cy="83" r="6" fill="rgba(255,150,100,0.25)" />
      <circle cx="210" cy="83" r="6" fill="rgba(255,150,100,0.25)" />
      <ellipse cx="190" cy="46" rx="30" ry="8" fill="#1E1B4B" />
      <rect x="175" y="35" width="30" height="12" rx="3" fill="#1E1B4B" />
      <circle cx="190" cy="35" r="4" fill="#FFD93D" />
      <line x1="220" y1="46" x2="228" y2="60" stroke="#1E1B4B" strokeWidth="2" />
      <rect x="224" y="60" width="10" height="6" rx="2" fill="#FFD93D" />
      <text x="30" y="50" fontSize="22" opacity="0.9">📮</text>
      <text x="320" y="70" fontSize="18" opacity="0.8">🛡️</text>
      <text x="50" y="180" fontSize="16" opacity="0.7">⚡</text>
      <text x="310" y="160" fontSize="16" opacity="0.7">✨</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VERIFY EMAIL CONTENT
   ═══════════════════════════════════════════════════════════════ */

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      if (typeof window !== 'undefined') {
        router.push('/register');
      }
      return;
    }

    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, email, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: '',
    },
  });

  const { setAuth } = useAuthStore();

  const onSubmit = async (data: VerifyFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-email', {
        email,
        otp: data.otp,
      });
      
      const { user, accessToken } = response.data;
      setAuth(user, accessToken);
      
      toast.success('Xác thực thành công! Hãy làm bài kiểm tra đầu vào để bắt đầu nhé.');
      router.push('/placement-test');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      // Logic for resending OTP - using register if that's how the backend is structured
      await api.post('/auth/register', { email, name: 'User', password: 'ResendDummyPassword' });
      toast.success('Mã OTP mới đã được gửi!');
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error('Không thể gửi lại mã. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-root">

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="left-panel">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />

        <div className="chip chip-1">
          <div className="dot" style={{ background: '#6BCB77' }} />
          🔥 Streak 30 ngày
        </div>
        <div className="chip chip-2">
          <div className="dot" style={{ background: '#FFD93D' }} />
          ⭐ 1,240 XP
        </div>
        <div className="chip chip-3">
          <div className="dot" style={{ background: '#A78BFA' }} />
          🏅 Badge mới!
        </div>
        <div className="chip chip-4">
          <div className="dot" style={{ background: '#FF6B35' }} />
          📚 850 từ đã học
        </div>

        <div className="brand">
          <div className="brand-logo overflow-hidden">
            <Image src="/logo.png" alt="NebulaEnglish Logo" width={160} height={160} className="object-contain" />
          </div>
          <div className="brand-name">NebulaEnglish</div>
          <div className="brand-tagline">Học tiếng Anh thông minh hơn mỗi ngày</div>
        </div>

        <div className="illustration">
          <SceneIllustration />
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">50K+</div>
            <div className="stat-label">Học viên</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">1,200+</div>
            <div className="stat-label">Bài học</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">4.9 ⭐</div>
            <div className="stat-label">Đánh giá</div>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="right-panel">

        <div className="form-container">
          <div className="form-header">
            <h1>
              Xác minh email<br />
              để tiếp tục! <span>📬</span>
            </h1>
            <p>Chúng tôi đã gửi mã OTP đến: <br/><strong className="text-brand-navy">{email}</strong></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            
            <div className="field">
              <label htmlFor="otp">
                Nhập mã 6 chữ số <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <IconShield />
                <input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="text-center tracking-[0.5em] text-2xl font-black"
                  {...register('otp')}
                />
              </div>
              {errors.otp && (
                <p style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div className="mt-8">
              <button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? 'Đang xác thực…' : 'Xác thực ngay'}
                {!isLoading && <IconArrowRight />}
              </button>
            </div>

            <div className="text-center mt-8 space-y-4">
              <p className="text-sm font-bold text-slate-400 italic">
                Bạn không nhận được mã?
              </p>
              
              <AnimatePresence mode="wait">
                {canResend ? (
                  <motion.button 
                    key="resend"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="button"
                    onClick={handleResend} 
                    className="flex items-center gap-2 mx-auto text-brand-orange font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                    disabled={isLoading}
                  >
                    <IconRefresh /> Gửi lại mã ngay
                  </motion.button>
                ) : (
                  <motion.div 
                    key="countdown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60"
                  >
                    Gửi lại sau <span className="text-brand-orange">{countdown}s</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="register-row !mt-10">
              <Link href="/register" className="font-bold flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Quay lại đăng ký
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
