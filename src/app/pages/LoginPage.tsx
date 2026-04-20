
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../components/ui/card';
import { useApp, AccountType } from '../context/AppContext';
import { LoginActions } from '../content/LoginAuth/LoginActions';
import { LoginForm } from '../content/LoginAuth/LoginForm';
import { LoginHeader } from '../content/LoginAuth/LoginHeader';

export function LoginPage() {
  const router = useRouter();
  const { login, user, authLoading } = useApp();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/home');
    }
  }, [authLoading, user, router]);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (!accountType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <LoginHeader
            title="Hair Master"
            description="Choose your account type to login"
          />
          <CardContent className="space-y-4">
            <LoginActions
              variant="account-selection"
              onSelectAccountType={setAccountType}
              onNavigateToSignup={() => router.push('/signup')}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <LoginHeader
          title="Welcome Back"
          description={<>Login to your {accountType} account</>}
        />
        <CardContent>
          <LoginForm
            email={email}
            password={password}
            error={error}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            footer={(
              <LoginActions
                variant="form"
                onBackToAccountType={() => setAccountType(null)}
              />
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
