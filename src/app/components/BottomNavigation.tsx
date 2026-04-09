'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, Calendar, Package, MessageCircle, Settings } from 'lucide-react';
import { Button } from './ui/button';

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
      <div className="max-w-2xl mx-auto px-2 py-2">
        <div className="grid grid-cols-6 gap-1">
          <Button
            variant="ghost"
            className={`flex-col h-auto gap-1 px-2 ${
              isActive('/home') ? 'text-purple-600' : ''
            }`}
            onClick={() => router.push('/home')}
          >
            <Home className={`w-5 h-5 ${isActive('/home') ? 'fill-purple-600' : ''}`} />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto gap-1 px-2 ${
              isActive('/hairstyles') ? 'text-purple-600' : ''
            }`}
            onClick={() => router.push('/hairstyles')}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto gap-1 px-2 ${
              isActive('/bookings') ? 'text-purple-600' : ''
            }`}
            onClick={() => router.push('/bookings')}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Bookings</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto gap-1 px-2 ${
              isActive('/orders') ? 'text-purple-600' : ''
            }`}
            onClick={() => router.push('/orders')}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs">Orders</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto gap-1 px-2 ${
              isActive('/chat') ? 'text-purple-600' : ''
            }`}
            onClick={() => router.push('/chat')}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto gap-1 px-2 ${
              isActive('/settings') ? 'text-purple-600' : ''
            }`}
            onClick={() => router.push('/settings')}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
