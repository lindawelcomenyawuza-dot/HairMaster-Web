'use client';

import { PostCard } from '../../components/PostCard';
import type { PostsFeedProps } from './home.types';

export function PostsFeed({ filteredPosts }: PostsFeedProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No posts found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
