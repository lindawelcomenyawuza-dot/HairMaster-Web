'use client';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  hasViewed: boolean;
}

const mockStories: Story[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Marcus Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
    hasViewed: false,
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Williams',
    userAvatar: 'https://images.unsplash.com/photo-1583331030595-6601e6c7b5d5?w=150',
    hasViewed: false,
  },
  {
    id: '3',
    userId: '3',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1618049049816-43a00d5b0c3d?w=150',
    hasViewed: true,
  },
];

export function StoriesBar() {
  const router = useRouter();

  return (
    <div className="bg-white border-b">
      <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
        {/* Add Story Button */}
        <button
          onClick={() => router.push('/create-story')}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-gray-200">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center border-2 border-white">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700">Your Story</span>
        </button>

        {/* Stories from followed users */}
        {mockStories.map((story) => (
          <button
            key={story.id}
            onClick={() => router.push(`/stories/${story.userId}`)}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div
              className={`rounded-full p-0.5 ${
                story.hasViewed
                  ? 'bg-gray-300'
                  : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
              }`}
            >
              <Avatar className="w-16 h-16 border-2 border-white">
                <AvatarImage src={story.userAvatar} />
                <AvatarFallback>{story.userName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs font-medium text-gray-700 max-w-[64px] truncate">
              {story.userName.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
