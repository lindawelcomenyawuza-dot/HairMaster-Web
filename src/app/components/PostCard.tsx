'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star, Share2, MapPin, DollarSign, Calendar, Building2, UserCircle2, Users, MessageCircle, Bookmark, Send, CheckCircle, Twitter, Facebook } from 'lucide-react';
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

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { toggleLike, ratePost, addBooking, addToLikedStyles, isFollowing, toggleFollow, toggleSavePost, addComment, setNavState } = useApp();
  const [showRating, setShowRating] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    toggleLike(post.id);
    if (!post.isLiked) {
      addToLikedStyles(post);
    }
  };

  const handleRate = (rating: number) => {
    ratePost(post.id, rating);
    setShowRating(false);
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
        status: 'upcoming',
        paymentMethod,
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
        // Fallback: Copy to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        toast.success('Link copied to clipboard!');
      }
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        // Fallback: Copy to clipboard
        try {
          const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
          await navigator.clipboard.writeText(shareText);
          toast.success('Link copied to clipboard!');
        } catch (clipboardError) {
          toast.error('Unable to share');
        }
      }
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
      setShowComments(true);
    }
  };

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
              <AvatarFallback>{post.userName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{post.userName}</p>
                {post.accountType === 'business' ? (
                  <Building2 className="w-4 h-4 text-purple-600" />
                ) : (
                  <UserCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {post.accountType === 'business' ? 'Business Account' : 'Personal Account'}
              </p>
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
          <Badge className="absolute top-2 right-2 bg-purple-600">
            {post.gender}
          </Badge>
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
              formatCurrencySimple(post.price, post.currency ?? 'USD')
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">{post.styleName}</h3>
            <p className="text-sm text-gray-600">{post.description}</p>
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-sm text-blue-600 hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {post.taggedUsers && post.taggedUsers.length > 0 && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>with</span>
                {post.taggedUsers.map((user, idx) => (
                  <span key={user.id}>
                    <span 
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => router.push(`/profile/${user.id}`)}
                    >
                      @{user.name}
                    </span>
                    {idx < post.taggedUsers!.length - 1 && ', '}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Barber:</span>
              <span>{post.barberName}</span>
            </div>
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

          {post.products && post.products.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">Available Products:</p>
              <div className="space-y-1">
                {post.products.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{product.name}</span>
                    <span className="text-green-600 font-medium">${product.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={() => { setNavState({ post }); router.push('/book'); }}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={showRating} onOpenChange={setShowRating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate this style</DialogTitle>
            <DialogDescription>Share your experience with this hairstyle</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className="hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-10 h-10 ${
                    rating <= post.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
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
                  <input
                    type="radio"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                  />
                  Pay Online
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="offline"
                    checked={paymentMethod === 'offline'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'offline')}
                  />
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

      {/* Share Dialog */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this style</DialogTitle>
            <DialogDescription>Share this hairstyle with your friends</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-4">
            <button
              onClick={() => {
                const shareData = {
                  title: post.styleName,
                  text: `Check out this ${post.styleName} by ${post.barberName}!`,
                  url: window.location.href,
                };
                if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                  navigator.share(shareData);
                } else {
                  // Fallback: Copy to clipboard
                  const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
                  navigator.clipboard.writeText(shareText);
                  toast.success('Link copied to clipboard!');
                }
                setShowShare(false);
              }}
              className="hover:scale-110 transition-transform"
            >
              <Share2
                className={`w-10 h-10 text-gray-300`}
              />
            </button>
            <button
              onClick={() => {
                const shareData = {
                  title: post.styleName,
                  text: `Check out this ${post.styleName} by ${post.barberName}!`,
                  url: window.location.href,
                };
                if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                  navigator.share(shareData);
                } else {
                  // Fallback: Copy to clipboard
                  const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
                  navigator.clipboard.writeText(shareText);
                  toast.success('Link copied to clipboard!');
                }
                setShowShare(false);
              }}
              className="hover:scale-110 transition-transform"
            >
              <Twitter
                className={`w-10 h-10 text-gray-300`}
              />
            </button>
            <button
              onClick={() => {
                const shareData = {
                  title: post.styleName,
                  text: `Check out this ${post.styleName} by ${post.barberName}!`,
                  url: window.location.href,
                };
                if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                  navigator.share(shareData);
                } else {
                  // Fallback: Copy to clipboard
                  const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
                  navigator.clipboard.writeText(shareText);
                  toast.success('Link copied to clipboard!');
                }
                setShowShare(false);
              }}
              className="hover:scale-110 transition-transform"
            >
              <Facebook
                className={`w-10 h-10 text-gray-300`}
              />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>View and add comments to this hairstyle</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                    <Avatar
                      className="cursor-pointer"
                      onClick={() => router.push(`/profile/${comment.userId}`)}
                    >
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{comment.userName}</p>
                      <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {comment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
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
