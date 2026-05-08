'use client';

import { Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { CreatePostButtonProps } from './home.types';

export function CreatePostButton({ onCreatePost }: CreatePostButtonProps) {
  return (
    <div className="flex justify-end mb-6">
      <Button
        onClick={onCreatePost}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
      >
        <Send className="w-5 h-5 mr-2" />
        Create Post
      </Button>
    </div>
  );
}
