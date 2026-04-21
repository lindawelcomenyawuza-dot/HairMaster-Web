'use client';

import { Ticket, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { HomeHeaderProps } from './home.types';

export function HomeHeader({
  onNavigateToDiscounts,
  onNavigateToProfile,
}: HomeHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Hair Master
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToDiscounts}
              className="relative"
            >
              <Ticket className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToProfile}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
