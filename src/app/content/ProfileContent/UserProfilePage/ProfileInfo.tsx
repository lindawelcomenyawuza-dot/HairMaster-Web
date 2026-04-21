'use client';

import { Edit2, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import type { ProfileInfoProps } from './profile.types';

export function ProfileInfo({
  user,
  userPostsCount,
  onEditProfile,
}: ProfileInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <button
              onClick={onEditProfile}
              className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          {user.businessName && (
            <p className="text-gray-600 mb-2">{user.businessName}</p>
          )}
          <Badge className="mb-3">
            {user.accountType === 'business' ? 'Business Account' : 'Personal Account'}
          </Badge>

          {user.bio && (
            <p className="text-gray-600 mb-3">{user.bio}</p>
          )}

          {user.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}

          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-2xl font-bold">{userPostsCount}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.followers}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.following}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
