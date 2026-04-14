'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, Send, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function CommentsPage() {
  const router = useRouter();
  const { postId } = useParams();
  const { posts, addComment } = useApp();
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const post = posts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Post not found</p>
      </div>
    );
  }

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    addComment(post.id, commentText);
    setCommentText('');
    setReplyingTo(null);
    toast.success('Comment posted!');
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Comments</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Post Preview */}
        <Card className="rounded-none border-x-0 border-t-0">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{post.userName}</span>
                  <span className="text-gray-500 text-sm">
                    {formatTimeAgo(post.createdAt)}
                  </span>
                </div>
                <p className="text-gray-900 mb-2">{post.description}</p>
                {post.image && (
                  <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.styleName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Count */}
        <div className="px-4 py-3 bg-white border-b">
          <p className="text-sm text-gray-600">
            {post.commentsCount || 0} {(post.commentsCount || 0) === 1 ? 'comment' : 'comments'}
          </p>
        </div>

        {/* Comments List */}
        <div className="bg-white min-h-[60vh]">
          {(!post.comments || post.comments.length === 0) ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-2">No comments yet</p>
              <p className="text-sm text-gray-400">Be the first to comment!</p>
            </div>
          ) : (
            <div className="divide-y">
              {post.comments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={comment.userAvatar || null}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl px-4 py-2">
                        <p className="font-semibold text-sm mb-1">{comment.userName}</p>
                        <p className="text-gray-900">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 px-4">
                        <button
                          className={`text-sm ${comment.isLiked ? 'text-red-600 font-semibold' : 'text-gray-500'}`}
                        >
                          {comment.likes > 0 && `${comment.likes} `}
                          Like
                        </button>
                        <button
                          className="text-sm text-gray-500"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          Reply
                        </button>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <img
                                src={reply.userAvatar || null}
                                alt={reply.userName}
                                className="w-8 h-8 rounded-full bg-gray-200"
                              />
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-2xl px-4 py-2">
                                  <p className="font-semibold text-sm mb-1">{reply.userName}</p>
                                  <p className="text-gray-900 text-sm">{reply.content}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1 px-4">
                                  <button className="text-xs text-gray-500">
                                    {reply.likes > 0 && `${reply.likes} `}
                                    Like
                                  </button>
                                  <span className="text-xs text-gray-400">
                                    {formatTimeAgo(reply.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment Input - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {replyingTo && (
            <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
              <span>Replying to comment</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                Cancel
              </Button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <img
              src={post.userAvatar || null}
              alt="Your avatar"
              className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              />
              <Button
                onClick={handleSendComment}
                disabled={!commentText.trim()}
                size="icon"
                className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 h-8 w-8"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
