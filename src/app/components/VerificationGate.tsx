'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth/success',
  '/auth/google/success',
];

export function VerificationGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, authLoading } = useApp();

  useEffect(() => {
    if (authLoading || !user || user.authProvider === 'google' || user.isVerified !== false) return;
    const isPublic = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
    if (!isPublic) {
      router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
    }
  }, [authLoading, pathname, router, user]);

  return <>{children}</>;
}
