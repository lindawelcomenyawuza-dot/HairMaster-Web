'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../../src/app/context/AppContext';

function AuthSuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useApp();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      router.replace(`/login?error=${encodeURIComponent(error || 'google_failed')}`);
      return;
    }

    loginWithGoogle(token)
      .then(() => router.replace('/home'))
      .catch(() => router.replace('/login?error=google_failed'));
  }, [searchParams, loginWithGoogle, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 font-medium">Signing you in with Google...</p>
      </div>
    </div>
  );
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <AuthSuccessInner />
    </Suspense>
  );
}
