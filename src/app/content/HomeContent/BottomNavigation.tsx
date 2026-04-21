'use client';

import { Calendar, Home, MessageCircle, Package, Search, Settings } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { BottomNavigationProps } from './home.types';

export function BottomNavigation({
  onNavigateToHome,
  onNavigateToHairstyles,
  onNavigateToBookings,
  onNavigateToOrders,
  onNavigateToChat,
  onNavigateToSettings,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
      <div className="max-w-2xl mx-auto px-2 py-2">
        <div className="grid grid-cols-6 gap-1">
          <Button
            variant="ghost"
            className="flex-col h-auto gap-1 px-2"
            onClick={onNavigateToHome}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto gap-1 px-2"
            onClick={onNavigateToHairstyles}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto gap-1 px-2"
            onClick={onNavigateToBookings}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Bookings</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto gap-1 px-2"
            onClick={onNavigateToOrders}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs">Orders</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto gap-1 px-2"
            onClick={onNavigateToChat}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-col h-auto gap-1 px-2"
            onClick={onNavigateToSettings}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
