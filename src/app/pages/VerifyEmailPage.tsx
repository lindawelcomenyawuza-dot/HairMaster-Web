'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Mail, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { getRequiredPublicApiUrl } from '../../lib/api';
import { toast } from 'sonner';

const API_URL = getRequiredPublicApiUrl();

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<'pending' | 'verifying' | 'verified' | 'error'>(token ? 'verifying' : 'pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || 'Verification failed');
        setStatus('verified');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      toast.error('Enter your email address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Could not resend verification email');
      toast.success('Verification email sent');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not resend verification email');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle2 className="w-14 h-14 mx-auto text-green-600 mb-2" />
            <CardTitle>Email Verified</CardTitle>
            <CardDescription>Your account is ready. You can now log in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'error' ? (
            <XCircle className="w-14 h-14 mx-auto text-red-600 mb-2" />
          ) : (
            <Mail className="w-14 h-14 mx-auto text-purple-600 mb-2" />
          )}
          <CardTitle>{status === 'verifying' ? 'Verifying Email...' : 'Verify Your Email'}</CardTitle>
          <CardDescription>
            {status === 'error'
              ? 'This verification link is invalid or expired. Request a new one below.'
              : 'Check your inbox and click the verification link to unlock Hair Master.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button onClick={handleResend} disabled={loading} variant="outline" className="w-full">
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <Button onClick={() => router.push('/login')} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
