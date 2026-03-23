'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

/* ─── Validation Schema ─────────────────────────────────────── */
const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/* ─── SVG Icon Components ────────────────────────────────────── */

function IconEmail() {
  return (
    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m2 7 10 7 10-7" />
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

function IconCheckmark() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" 
      stroke="#6BCB77" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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
      <text x="30" y="50" fontSize="22" opacity="0.9">📧</text>
      <text x="320" y="70" fontSize="18" opacity="0.8">🔒</text>
      <text x="50" y="180" fontSize="16" opacity="0.7">⚡</text>
      <text x="310" y="160" fontSize="16" opacity="0.7">🔑</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FORGOT PASSWORD PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setIsSent(true);
      toast.success('Mã xác thực đã được gửi đến email của bạn!');
      
      // Chuyển hướng sau 2 giây để người dùng kịp thấy thông báo thành công
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
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
              Quên mật khẩu?<br />
              Đừng lo lắng! <span>🔑</span>
            </h1>
            <p>Chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản.</p>
          </div>

          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100">
                  <IconCheckmark />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Đã gửi yêu cầu!</h3>
                <p className="text-slate-500 mb-8 text-sm font-medium">
                  Vui lòng kiểm tra hộp thư đến của bạn để thực hiện các bước tiếp theo.
                </p>
                <Link href={`/reset-password?email=${encodeURIComponent(watch('email'))}`} className="btn-submit">
                  Tiến hành đặt lại mật khẩu
                  <IconArrowRight />
                </Link>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit(onSubmit)} 
                noValidate
              >
                <div className="field">
                  <label htmlFor="email">
                    Email của bạn <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <IconEmail />
                    <input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p style={{ color: 'var(--primary)', fontSize: '11px', marginTop: '4px', fontWeight: 600 }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? 'Đang gửi yêu cầu…' : 'Gửi yêu cầu đặt lại'}
                    {!isLoading && <IconArrowRight />}
                  </button>
                </div>

                <div className="register-row !mt-10">
                  <Link href="/login" className="font-bold flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Quay lại đăng nhập
                  </Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
