'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, Calendar, Package, MessageCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';
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

const tabs = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Search', path: '/search', icon: Search },
  { label: 'Bookings', path: '/bookings', icon: Calendar },
  { label: 'Orders', path: '/orders', icon: Package },
  { label: 'Messages', path: '/messages', icon: MessageCircle },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, authLoading } = useApp();

  const isPublic = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
  if (authLoading || !user || isPublic) return null;

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t z-50">
      <div className="w-full px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-6 gap-1">
          {tabs.map(({ label, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Button
                key={path}
                variant="ghost"
                aria-current={active ? 'page' : undefined}
                className={`flex-col h-14 gap-1 px-1 rounded-md text-[11px] ${
                  active ? 'text-purple-700 bg-purple-50' : 'text-gray-600'
                }`}
                onClick={() => router.push(path)}
              >
                <Icon className={`w-5 h-5 ${active && path === '/home' ? 'fill-purple-700' : ''}`} />
                <span className="leading-none truncate max-w-full">{label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
