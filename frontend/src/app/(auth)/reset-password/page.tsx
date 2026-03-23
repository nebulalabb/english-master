'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

/* ─── Validation Schema ─────────────────────────────────────── */
const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'Mã OTP phải có 6 chữ số'),
  password: z.string().min(8, 'Mật khẩu mới phải từ 8 ký tự'),
  confirmPassword: z.string().min(8, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/* ─── SVG Icon Components ────────────────────────────────────── */

function IconLock() {
  return (
    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="3" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconEyeOpen() {
  return (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  );
}

function IconEyeClosed() {
  return (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </>
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
      <text x="30" y="50" fontSize="22" opacity="0.9">🏢</text>
      <text x="320" y="70" fontSize="18" opacity="0.8">✨</text>
      <text x="50" y="180" fontSize="16" opacity="0.7">⭐</text>
      <text x="310" y="160" fontSize="16" opacity="0.7">🛡️</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESET PASSWORD CONTENT
   ═══════════════════════════════════════════════════════════════ */

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!email) {
    if (typeof window !== 'undefined') {
       router.push('/forgot-password');
    }
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        otp: data.otp,
        newPassword: data.password,
      });
      toast.success('Đặt lại mật khẩu thành công! Hãy đăng nhập lại.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
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
              Đặt lại mật khẩu<br />
              an toàn & nhanh chóng! <span>🛡️</span>
            </h1>
            <p>Nhập mã OTP đã nhận qua email và mật khẩu mới của bạn.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            
            <div className="field">
              <label htmlFor="otp">
                Mã OTP (6 chữ số) <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <IconShield />
                <input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  {...register('otp')}
                />
              </div>
              {errors.otp && (
                <p style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">
                Mật khẩu mới <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <IconLock />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tối thiểu 8 ký tự"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2">
                    {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <IconLock />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2">
                    {showConfirmPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                  </svg>
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="mt-8">
              <button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? 'Đang thực hiện…' : 'Đổi mật khẩu ngay'}
                {!isLoading && <IconArrowRight />}
              </button>
            </div>

            <div className="register-row !mt-10">
              <Link href="/login" className="font-bold">Quay lại đăng nhập</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
