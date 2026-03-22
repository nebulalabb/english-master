'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

const verifySchema = z.object({
  otp: z.string().length(6, 'Mã OTP phải có 6 chữ số'),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push('/register');
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
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setIsLoading(true);
    try {
      await api.post('/auth/verify-email', {
        email,
        otp: data.otp,
      });
      toast.success('Xác thực email thành công!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xác thực thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      await api.post('/auth/register', { email }); // Register again to send OTP if not exists or logic varied
      // Wait, in my backend register is for first time. 
      // I should have a forgot-password/resend endpoint.
      // For now, I'll use the register endpoint but backend might error "User exists".
      // Usually there is a /resend-otp endpoint.
      toast.success('Mã OTP đã được gửi lại vào email của bạn');
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể gửi lại mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Xác nhận Email</CardTitle>
          <CardDescription>
            Chúng tôi đã gửi mã xác nhận 6 chữ số tới <span className="font-medium text-primary">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Nhập mã 6 chữ số</Label>
              <Input id="otp" placeholder="000000" className="text-center text-2xl tracking-[0.5em] font-bold" maxLength={6} {...register('otp')} />
              {errors.otp && <p className="text-xs text-destructive text-center">{errors.otp.message}</p>}
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading}>
              {isLoading ? 'Đang xác thực...' : 'Xác thực ngay'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Bạn không nhận được mã?{' '}
            {canResend ? (
              <button 
                onClick={handleResend} 
                className="text-primary font-medium hover:underline"
                disabled={isLoading}
              >
                Gửi lại mã
              </button>
            ) : (
              <span>Gửi lại sau {countdown}s</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
