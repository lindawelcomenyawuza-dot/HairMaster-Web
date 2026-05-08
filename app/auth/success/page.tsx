'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../../src/app/context/AppContext';

const AUTH_TIMEOUT_MS = 15000;

function AuthSuccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useApp();
  const hasStartedRef = useRef(false);
  const [statusMessage, setStatusMessage] = useState('Signing you in with Google...');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      router.replace(`/login?error=${encodeURIComponent(error || 'google_failed')}`);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setErrorMessage('Google sign-in took too long. Redirecting back to login.');
      window.setTimeout(() => router.replace('/login?error=google_timeout'), 1200);
    }, AUTH_TIMEOUT_MS);

    setStatusMessage('Setting up your HairMaster session...');

    loginWithGoogle(token)
      .then(() => {
        window.clearTimeout(timeoutId);
        setStatusMessage('Almost there...');
        router.replace('/home');
      })
      .catch((err) => {
        window.clearTimeout(timeoutId);
        const nextMessage = err instanceof Error ? err.message : 'Google sign-in failed';
        setErrorMessage(nextMessage);
        window.setTimeout(() => router.replace('/login?error=google_failed'), 1200);
      });

    return () => window.clearTimeout(timeoutId);
  }, [searchParams, loginWithGoogle, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-700 font-medium">{errorMessage || statusMessage}</p>
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
