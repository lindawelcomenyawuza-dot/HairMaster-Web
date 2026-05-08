'use client';

import { MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import type { OtherProfileInfoProps } from './otherProfile.types';

export function OtherProfileInfo({
  profileUser,
  userPostsCount,
}: OtherProfileInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={profileUser.avatar} />
              <AvatarFallback className="text-2xl">{profileUser.name[0]}</AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold mb-1">{profileUser.name}</h2>
            {profileUser.businessName && (
              <p className="text-gray-600 mb-2">{profileUser.businessName}</p>
            )}
            <Badge className="mb-3">
              {profileUser.accountType === 'business' ? 'Business Account' : 'Personal Account'}
            </Badge>

            {profileUser.bio && (
              <p className="text-gray-600 mb-3 max-w-md">{profileUser.bio}</p>
            )}

            {profileUser.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{profileUser.location}</span>
              </div>
            )}

            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-2xl font-bold">{userPostsCount}</p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profileUser.followers}</p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profileUser.following}</p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
