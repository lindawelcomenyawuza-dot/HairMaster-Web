'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import type { AccountType } from '../context/AppContext';
import type { UseLoginResult } from './login.types';

export function useLogin(): UseLoginResult {
  const router = useRouter();
  const { login, user, authLoading } = useApp();

  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/home');
    }
  }, [authLoading, router, user]);

  const handleLogin: UseLoginResult['handleLogin'] = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return {
    accountType,
    email,
    password,
    error,
    loading,
    selectAccountType: setAccountType,
    setEmail,
    setPassword,
    handleLogin,
    navigateToSignup: () => router.push('/signup'),
    resetAccountType: () => setAccountType(null),
  };
}
