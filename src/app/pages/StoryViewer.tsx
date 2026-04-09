'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { X, Heart, Send, MoreVertical, Volume2, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

interface Story {
  id: string;
  image: string;
  createdAt: Date;
}

const mockStories: Story[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1618049049816-43a00d5b0c3d?w=800',
    createdAt: new Date('2026-04-01T10:00:00'),
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1702236240794-58dc4c6895e5?w=800',
    createdAt: new Date('2026-04-01T14:00:00'),
  },
];

export default function StoryViewer() {
  const router = useRouter();
  const { userId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentStory = mockStories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (currentIndex < mockStories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            // End of stories, go back
            router.back();
            return 100;
          }
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, navigate]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < mockStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      router.back();
    }
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Send reply logic here
      setReplyText('');
    }
  };

  const getTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1h ago';
    return `${hours}h ago`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Content */}
      <div className="relative w-full max-w-md h-full bg-black">
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 p-2">
          <div className="flex gap-1">
            {mockStories.map((_, index) => (
              <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
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
        <div className="absolute top-4 left-0 right-0 z-20 px-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage src="https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-semibold text-sm">Marcus Johnson</p>
                <p className="text-white/80 text-xs">{getTimeAgo(currentStory.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Image */}
        <div
          className="absolute inset-0"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img
            src={currentStory.image}
            alt="Story"
            className="w-full h-full object-cover"
          />
          
          {/* Tap Areas for Navigation */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full" onClick={handlePrevious} />
            <div className="w-1/3 h-full" />
            <div className="w-1/3 h-full" onClick={handleNext} />
          </div>
        </div>

        {/* Reply Input */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Send message"
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
            <Button
              size="icon"
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="bg-white/20 hover:bg-white/30 border-white/30"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
