'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import type { VerificationBannerProps } from './profile.types';

export function VerificationBanner({
  isVerified,
  onVerify,
}: VerificationBannerProps) {
  if (isVerified) {
    return null;
  }

  return (
    <Card
      className="border-yellow-200 bg-yellow-50 cursor-pointer hover:bg-yellow-100 transition-colors"
      onClick={onVerify}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Account Unverified</h3>
              <p className="text-xs text-gray-600">Complete verification to unlock all features</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
          >
            Verify Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
