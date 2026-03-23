'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for hydration
    setIsReady(true);

    const publicPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (isReady) {
      if (!token && !isPublicPath) {
        router.push('/login');
      } else if (token && isPublicPath) {
        router.push('/dashboard');
      }
    }
  }, [token, pathname, router, isReady]);

  if (!isReady || (!token && !['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'].some(path => pathname.startsWith(path)))) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
