'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import type { OtherProfilePostsProps } from './otherProfile.types';

export function OtherProfilePosts({ userPosts }: OtherProfilePostsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Posts</h3>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.styleName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-2">
                      <p className="font-semibold text-sm mb-1">{post.styleName}</p>
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          {post.rating}
                        </span>
                        <span>${post.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No posts yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
