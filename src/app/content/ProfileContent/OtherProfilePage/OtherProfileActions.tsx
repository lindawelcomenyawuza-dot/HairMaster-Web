'use client';

import { Calendar, MessageCircle, Phone } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import type { OtherProfileActionsProps } from './otherProfile.types';

export function OtherProfileActions({
  accountType,
  isFollowing,
  onToggleFollow,
  onCall,
  onChat,
  onBookAppointment,
}: OtherProfileActionsProps) {
  if (accountType !== 'business') {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <Button
            variant={isFollowing ? 'outline' : 'default'}
            onClick={onToggleFollow}
            className={!isFollowing ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>

          <Button
            variant="outline"
            onClick={onCall}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>

          <Button
            variant="outline"
            onClick={onChat}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </Button>

          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={onBookAppointment}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
