'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useApp, AccountType } from '../context/AppContext';
import { Scissors } from 'lucide-react';

export function LoginPage() {
  const router = useRouter();
  const { setUser } = useApp();
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login
    setUser({
      id: '1',
      name: accountType === 'business' ? 'My Barbershop' : 'John Doe',
      email,
      accountType: accountType!,
      avatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
      bio: accountType === 'business' ? 'Professional barbershop' : 'Hair enthusiast',
      followers: 523,
      following: 234,
      location: 'New York, NY',
      businessName: accountType === 'business' ? 'My Barbershop' : undefined,
      posts: 0,
      totalSpent: 0,
      discountTokens: 2,
    });
    
    router.push('/home');
  };

  const handleGoogleSignIn = () => {
    // Mock Google sign in
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@gmail.com',
      accountType: accountType!,
      avatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
      bio: 'Hair enthusiast',
      followers: 523,
      following: 234,
      location: 'New York, NY',
      posts: 0,
      totalSpent: 0,
      discountTokens: 2,
    });
    router.push('/home');
  };

  if (!accountType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
                <Scissors className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Hair Master</CardTitle>
            <CardDescription>Choose your account type to login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setAccountType('personal')}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              Personal Account
            </Button>
            <Button
              onClick={() => setAccountType('business')}
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              size="lg"
            >
              Business Account
            </Button>
            <div className="text-center pt-4">
              <button
                onClick={() => router.push('/signup')}
                className="text-sm text-purple-600 hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
              <Scissors className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl">Welcome Back</CardTitle>
          <CardDescription>
            Login to your {accountType} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Login
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setAccountType(null)}
                className="text-sm text-gray-600 hover:underline"
              >
                ← Back to account type
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
