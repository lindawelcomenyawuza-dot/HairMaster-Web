'use client';

import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { ProfileHeaderProps } from './profile.types';

export function ProfileHeader({ onBack, onOpenSettings }: ProfileHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">Profile</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
