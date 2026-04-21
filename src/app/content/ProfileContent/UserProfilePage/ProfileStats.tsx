'use client';

import { Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import type { ProfileStatsProps } from './profile.types';

export function ProfileStats({ totalSpent, bookingsCount }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-bold">${totalSpent}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-xl font-bold">{bookingsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
