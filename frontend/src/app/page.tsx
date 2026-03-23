'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import LandingPage from '@/components/landing/LandingPage';

export default function RootPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  // If logged in, we are redirecting, but still return null or a loader to avoid flicker
  if (token) return null;

  return <LandingPage />;
}
