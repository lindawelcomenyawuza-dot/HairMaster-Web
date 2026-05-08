'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { OtherProfileHeaderProps } from './otherProfile.types';

export function OtherProfileHeader({ onBack }: OtherProfileHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </div>
    </header>
  );
}
