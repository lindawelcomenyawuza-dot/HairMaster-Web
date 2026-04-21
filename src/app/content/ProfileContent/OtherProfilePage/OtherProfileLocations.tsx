'use client';

import { MapPin } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import type { OtherProfileLocationsProps } from './otherProfile.types';

export function OtherProfileLocations({
  accountType,
  shopLocations,
  phone,
}: OtherProfileLocationsProps) {
  if (accountType !== 'business' || shopLocations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Locations</h3>
        <div className="space-y-3">
          {shopLocations.map((location, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">{location}</p>
                {phone && (
                  <p className="text-sm text-gray-600">{phone}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
