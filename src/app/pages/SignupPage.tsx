'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useApp, AccountType } from '../context/AppContext';
import { Scissors } from 'lucide-react';

export function SignupPage() {
  const router = useRouter();
  const { setUser } = useApp();
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock signup
    setUser({
      id: Date.now().toString(),
      name: accountType === 'business' ? businessName : name,
      email,
      accountType: accountType!,
      avatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
      bio: '',
      followers: 0,
      following: 0,
      location: '',
      businessName: accountType === 'business' ? businessName : undefined,
      posts: 0,
      totalSpent: 0,
      discountTokens: 1,
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
            <CardTitle className="text-3xl">Join Hair Master</CardTitle>
            <CardDescription>Choose your account type to get started</CardDescription>
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
                onClick={() => router.push('/login')}
                className="text-sm text-purple-600 hover:underline"
              >
                Already have an account? Login
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
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>
            Sign up for a {accountType} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {accountType === 'business' ? (
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Enter business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Create Account
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
