'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockPosts as initialPosts } from '../data/mockData';

export type AccountType = 'personal' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  location?: string;
  businessName?: string;
  posts: number;
  totalSpent: number;
  discountTokens: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  accountType: AccountType;
  image: string;
  images?: string[];
  styleName: string;
  barberName: string;
  barberShop?: string;
  location: string;
  price: number;
  currency?: string;
  rating: number;
  likes: number;
  isLiked: boolean;
  isSaved?: boolean;
  description: string;
  gender: 'male' | 'female' | 'unisex';
  createdAt: Date;
  products?: { name: string; price: number; type: string }[];
  hashtags?: string[];
  taggedUsers?: { id: string; name: string }[];
  comments?: Comment[];
  commentsCount?: number;
  sharesCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
}

export interface Booking {
  id: string;
  postId: string;
  styleName: string;
  barberName: string;
  location: string;
  price: number;
  date: Date;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentMethod: 'online' | 'offline';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  toggleLike: (postId: string) => void;
  ratePost: (postId: string, rating: number) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  likedStyles: Post[];
  doneStyles: Post[];
  addToLikedStyles: (post: Post) => void;
  addToDoneStyles: (post: Post) => void;
  conversations: Conversation[];
  messages: ChatMessage[];
  sendMessage: (receiverId: string, message: string) => void;
  isFollowing: (userId: string) => boolean;
  toggleFollow: (userId: string) => void;
  navState: Record<string, unknown>;
  setNavState: (state: Record<string, unknown>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [likedStyles, setLikedStyles] = useState<Post[]>([]);
  const [doneStyles, setDoneStyles] = useState<Post[]>([]);
  const [navState, setNavState] = useState<Record<string, unknown>>({});
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      userId: '1',
      userName: 'Marcus Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
      lastMessage: 'Yes, I have availability tomorrow at 2pm',
      lastMessageTime: new Date('2026-03-21T14:30:00'),
      unreadCount: 1,
    },
    {
      userId: '2',
      userName: 'Sarah Williams',
      userAvatar: 'https://images.unsplash.com/photo-1583331030595-6601e6c7b5d5?w=150',
      lastMessage: 'The braids usually take about 4-5 hours',
      lastMessageTime: new Date('2026-03-20T10:15:00'),
      unreadCount: 0,
    },
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const addPost = (post: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const ratePost = (postId: string, rating: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, rating }
        : post
    ));
  };

  const toggleSavePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      userId: user?.id || '1',
      userName: user?.name || 'Guest',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1583331030595-6601e6c7b5d5?w=150',
      content,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    };
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...(post.comments || []), newComment], commentsCount: (post.commentsCount || 0) + 1 }
        : post
    ));
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
    };
    setBookings([...bookings, newBooking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(bookings.map(booking => 
      booking.id === id 
        ? { ...booking, ...updates }
        : booking
    ));
  };

  const addToLikedStyles = (post: Post) => {
    if (!likedStyles.find(p => p.id === post.id)) {
      setLikedStyles([...likedStyles, post]);
    }
  };

  const addToDoneStyles = (post: Post) => {
    if (!doneStyles.find(p => p.id === post.id)) {
      setDoneStyles([...doneStyles, post]);
    }
  };

  const sendMessage = (receiverId: string, message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      receiverId,
      message,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const isFollowing = (userId: string) => {
    return followingIds.includes(userId);
  };

  const toggleFollow = (userId: string) => {
    if (followingIds.includes(userId)) {
      setFollowingIds(followingIds.filter(id => id !== userId));
    } else {
      setFollowingIds([...followingIds, userId]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        posts,
        addPost,
        toggleLike,
        ratePost,
        toggleSavePost,
        addComment,
        bookings,
        addBooking,
        updateBooking,
        likedStyles,
        doneStyles,
        addToLikedStyles,
        addToDoneStyles,
        conversations,
        messages,
        sendMessage,
        isFollowing,
        toggleFollow,
        navState,
        setNavState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
