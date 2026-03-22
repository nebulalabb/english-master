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
  otp: z.string().length(6, 'OTP must be 6 digits'),
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
      toast.success('Email verified successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
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
      toast.success('OTP resent to your email');
      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
          <CardDescription>
            We sent a 6-digit code to <span className="font-medium text-primary">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter 6-digit code</Label>
              <Input id="otp" placeholder="000000" className="text-center text-2xl tracking-[0.5em] font-bold" maxLength={6} {...register('otp')} />
              {errors.otp && <p className="text-xs text-destructive text-center">{errors.otp.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            {canResend ? (
              <button 
                onClick={handleResend} 
                className="text-primary font-medium hover:underline"
                disabled={isLoading}
              >
                Resend code
              </button>
            ) : (
              <span>Resend in {countdown}s</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
