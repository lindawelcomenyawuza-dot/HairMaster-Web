'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Share2, MapPin, DollarSign, Calendar, MessageCircle, Bookmark, Send, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { useApp, Post } from '../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import { formatCurrencySimple } from '../utils/currency';

interface PostCardProps {
  post: Post;
}

function getInitial(value?: string) {
  return value?.trim().charAt(0).toUpperCase() || '?';
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { toggleLike, addBooking, addToLikedStyles, isFollowing, toggleFollow, toggleSavePost, addComment, setNavState, repost } = useApp();
  const [showBooking, setShowBooking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    toggleLike(post.id);
    if (!post.isLiked) addToLikedStyles(post);
  };

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      addBooking({
        postId: post.id,
        styleName: post.styleName,
        barberName: post.barberName,
        location: post.location,
        price: post.price,
        date: new Date(selectedDate),
        time: selectedTime,
        status: 'pending',
        paymentMethod,
        depositPaid: false,
      });
      setShowBooking(false);
      router.push('/bookings');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.styleName,
      text: `Check out this ${post.styleName} by ${post.barberName}!`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast.success('Link copied to clipboard!');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
          toast.success('Link copied to clipboard!');
        } catch {
          toast.error('Unable to share');
        }
      }
    }
  };

  const handleRepost = async () => {
    if (repost) {
      await repost(post.id);
      toast.success('Reposted!');
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
      setShowComments(true);
    }
  };

  const postLabel = post.type === 'verified'
    ? { text: 'Verified Cut', color: 'bg-green-600' }
    : post.type === 'repost'
    ? { text: 'Repost', color: 'bg-blue-600' }
    : null;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              className="cursor-pointer"
              onClick={() => router.push(`/profile/${post.userId}`)}
            >
              <AvatarImage src={post.userAvatar} />
              <AvatarFallback>{getInitial(post.userName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{post.userName}</p>
                {post.type === 'verified' && (
                  <span title="Verified" aria-label="Verified">
                    <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                  </span>
                )}
              </div>
              {post.type === 'repost' && (
                <p className="text-xs text-gray-500">Reposted · {post.barberName}</p>
              )}
              {post.type !== 'repost' && (
                <p className="text-sm text-gray-500">{post.barberName}</p>
              )}
            </div>
          </div>
          <Button
            variant={isFollowing(post.userId) ? 'outline' : 'default'}
            size="sm"
            onClick={() => toggleFollow(post.userId)}
          >
            {isFollowing(post.userId) ? 'Following' : 'Follow'}
          </Button>
        </div>

        <div className="relative">
          <img
            src={post.image}
            alt={post.styleName}
            className="w-full aspect-square object-cover"
          />
          {postLabel && (
            <Badge className={`absolute top-2 left-2 ${postLabel.color} flex items-center gap-1`}>
              {post.type === 'verified' && <CheckCircle className="w-3 h-3" />}
              {postLabel.text}
            </Badge>
          )}
          {post.gender && (
            <Badge className="absolute top-2 right-2 bg-purple-600">
              {post.gender}
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button onClick={() => router.push(`/comments/${post.id}`)} className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-6 h-6" />
                <span>{post.commentsCount || 0}</span>
              </button>
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={() => toggleSavePost(post.id)}
                className="flex items-center gap-1 hover:text-purple-500 transition-colors"
              >
                <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-purple-500 text-purple-500' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <DollarSign className="w-5 h-5" />
              {formatCurrencySimple(post.price, post.currency ?? 'ZAR')}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">{post.styleName}</h3>
            {post.description && <p className="text-sm text-gray-600">{post.description}</p>}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-sm text-blue-600 hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {post.barberShop && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Shop:</span>
                <span>{post.barberShop}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{post.location}</span>
            </div>
          </div>

          {post.type === 'repost' ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 text-center">Reposted — original by {post.barberName}</p>
              <Button
                onClick={() => { setNavState({ post }); router.push('/book'); }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book This Barber
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => { setNavState({ post }); router.push('/book'); }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          )}

          {post.type !== 'repost' && (
            <button
              onClick={handleRepost}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors py-1"
            >
              <RotateCcw className="w-4 h-4" />
              Repost
            </button>
          )}
        </CardContent>
      </Card>

      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Book {post.styleName} with {post.barberName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Select Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="">Choose a time</option>
                {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value as 'online')} />
                  Pay Online
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="offline" checked={paymentMethod === 'offline'} onChange={(e) => setPaymentMethod(e.target.value as 'offline')} />
                  Pay at Shop
                </label>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-600">${post.price}</span>
              </div>
            </div>
            <Button
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>View and add comments</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                    <Avatar className="cursor-pointer" onClick={() => router.push(`/profile/${comment.userId}`)}>
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{getInitial(comment.userName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Verified Customer</p>
                      <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
            )}
            <div className="flex items-end gap-2 pt-4 border-t">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
