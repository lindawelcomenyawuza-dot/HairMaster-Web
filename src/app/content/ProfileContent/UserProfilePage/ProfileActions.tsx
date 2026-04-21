'use client';

import { LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import type { ProfileActionsProps } from './profile.types';

export function ProfileActions({
  accountType,
  onOpenBusinessDashboard,
}: ProfileActionsProps) {
  if (accountType !== 'business') {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Business Dashboard</h3>
            <p className="text-sm text-gray-600">Manage bookings, staff, and payments</p>
          </div>
          <Button
            onClick={onOpenBusinessDashboard}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Open Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
