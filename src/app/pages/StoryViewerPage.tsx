'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Heart, Send, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Story } from '../types';

// Mock stories
const mockStories: Story[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Alex Turner',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
    views: 234,
    hasViewed: false,
  },
  {
    id: '2',
    userId: 'user1',
    userName: 'Alex Turner',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1599351431613-5e506c7d5881?w=800',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
    views: 189,
    hasViewed: false,
  },
];

export function StoryViewerPage() {
  const router = useRouter();
  const { userId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const currentStory = mockStories[currentIndex];
  const totalStories = mockStories.length;

  // Auto-advance story
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    if (currentIndex < totalStories - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      router.back();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    // In a real app, send the reply here
    setReplyMessage('');
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    return `${hours}h ago`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Story Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-20 px-2 pt-2">
        <div className="flex gap-1 max-w-md mx-auto">
          {mockStories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-20 px-4 mt-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold text-sm">{currentStory.userName}</p>
              <p className="text-white/80 text-xs">{formatTimeAgo(currentStory.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div 
        className="h-full flex items-center justify-center"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="relative max-w-md w-full h-full">
          <img
            src={currentStory.image}
            alt="Story"
            className="w-full h-full object-cover"
          />

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex">
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={handlePrevious}
            />
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={handleNext}
            />
          </div>

          {/* Navigation Buttons (Desktop) */}
          <div className="hidden md:block">
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}
            {currentIndex < totalStories - 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Input
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Send message"
            className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
            onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Heart className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendReply}
            className="text-white hover:bg-white/20"
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Views Counter */}
      <div className="absolute bottom-20 left-4 right-4 z-20">
        <div className="max-w-md mx-auto">
          <p className="text-white/80 text-sm">
            👁️ {currentStory.views} views
          </p>
        </div>
      </div>
    </div>
  );
}
