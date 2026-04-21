'use client';

import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { PaymentHeaderProps } from './payment.types';

export function PaymentHeader({ onBack }: PaymentHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Secure Payment</h1>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Lock className="w-3 h-3" />
              <span>Powered by Paystack</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
