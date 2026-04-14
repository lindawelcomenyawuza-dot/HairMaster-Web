'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { GET_POSTS, GET_BOOKINGS, GET_ME, GET_CONVERSATIONS, GET_MESSAGES, GET_MY_TOKENS, GET_TOKEN_TIERS } from '../../lib/graphql/queries';
import {
  LOGIN,
  REGISTER,
  CREATE_POST,
  TOGGLE_LIKE,
  ADD_COMMENT,
  TOGGLE_SAVE_POST,
  CREATE_BOOKING,
  UPDATE_BOOKING,
  TOGGLE_FOLLOW,
  SEND_MESSAGE,
  UPDATE_PROFILE,
  REDEEM_POINTS,
  USE_TOKEN,
} from '../../lib/graphql/mutations';

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
  country?: string;
  currency?: string;
  businessName?: string;
  isVerified?: boolean;
  verificationBadge?: 'verified' | 'business' | 'pro';
  subscription?: {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    isTrial: boolean;
    trialEndsAt?: Date;
    monthlyFee: number;
    currency: string;
    paymentHistory?: any[];
  };
  staff?: any[];
  documents?: any;
  savedPosts?: string[];
  referralCode?: string;
  loyaltyPoints?: number;
  darkMode?: boolean;
  language?: string;
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
  replies?: Comment[];
}

export interface Booking {
  id: string;
  postId: string;
  styleName: string;
  barberName: string;
  location: string;
  price: number;
  currency?: string;
  depositAmount?: number;
  depositPaid?: boolean;
  date: Date;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentMethod: 'online' | 'offline';
  paymentStatus?: 'pending' | 'partial' | 'completed';
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

export interface DiscountToken {
  id: string;
  code: string;
  discount: number;
  pointCost: number;
  used: boolean;
  usedAt?: string;
  expiresAt: string;
  earnedAt: string;
}

export interface TokenTier {
  label: string;
  pointCost: number;
  discount: number;
  description: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, accountType?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { name?: string; bio?: string; avatar?: string; location?: string; country?: string; currency?: string; businessName?: string; darkMode?: boolean; language?: string }) => Promise<void>;
  posts: Post[];
  postsLoading: boolean;
  refetchPosts: () => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => Promise<void>;
  toggleLike: (postId: string) => void;
  ratePost: (postId: string, rating: number) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
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
  myTokens: DiscountToken[];
  tokenTiers: TokenTier[];
  tokensLoading: boolean;
  redeemPoints: (pointCost: number) => Promise<void>;
  useDiscountToken: (code: string) => Promise<void>;
  refetchTokens: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type GetMeResponse = {
  me: User;
};
type GetPostsResponse = {
  posts: Post[];
};

function normalizePost(p: any): Post {
  return {
    ...p,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    comments: (p.comments || []).map((c: any) => ({
      ...c,
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
    })),
  };
}

function normalizeBooking(b: any): Booking {
  return {
    ...b,
    date: b.date ? new Date(b.date) : new Date(),
  };
}

function normalizeConversation(c: any): Conversation {
  return {
    ...c,
    lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime) : new Date(),
  };
}

function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('hm_token');
}

export function AppProvider({ children }: { children: ReactNode }) {
  const apolloClient = useApolloClient();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(hasToken());
  const [likedStyles, setLikedStyles] = useState<Post[]>([]);
  const [doneStyles, setDoneStyles] = useState<Post[]>([]);
  const [navState, setNavState] = useState<Record<string, unknown>>({});
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const { data: meData, error: meError, loading: meLoading } =
    useQuery<GetMeResponse>(GET_ME, {
      skip: !hasToken(),
    });

  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
    }
    if (!meLoading) {
      setAuthLoading(false);
    }
  }, [meData, meLoading]);

  useEffect(() => {
    if (meError) {
      localStorage.removeItem('hm_token');
      setAuthLoading(false);
    }
  }, [meError]);

  useEffect(() => {
    if (!hasToken()) setAuthLoading(false);
  }, []);

  const { data: postsData, loading: postsLoading, refetch: refetchPosts } =
    useQuery<GetPostsResponse>(GET_POSTS);
  const { data: bookingsData } = useQuery(GET_BOOKINGS, {
    skip: !user,
  });
  const { data: conversationsData } = useQuery(GET_CONVERSATIONS, {
    skip: !user,
  });
  const { data: tokensData, loading: tokensLoading, refetch: refetchTokens } = useQuery(GET_MY_TOKENS, {
    skip: !user,
  });
  const { data: tiersData } = useQuery(GET_TOKEN_TIERS);

  const posts: Post[] = (postsData?.posts || []).map(normalizePost);
  const bookings = ((bookingsData as any)?.bookings || []).map(normalizeBooking);
  const conversations = ((conversationsData as any)?.conversations || []).map(normalizeConversation);
  const myTokens: DiscountToken[] = tokensData?.myTokens || [];
  const tokenTiers: TokenTier[] = tiersData?.tokenTiers || [];

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [createPostMutation] = useMutation(CREATE_POST);
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE);
  const [addCommentMutation] = useMutation(ADD_COMMENT);
  const [toggleSaveMutation] = useMutation(TOGGLE_SAVE_POST);
  const [createBookingMutation] = useMutation(CREATE_BOOKING);
  const [updateBookingMutation] = useMutation(UPDATE_BOOKING);
  const [toggleFollowMutation] = useMutation(TOGGLE_FOLLOW);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const [updateProfileMutation] = useMutation(UPDATE_PROFILE);
  const [redeemPointsMutation] = useMutation(REDEEM_POINTS);
  const [useTokenMutation] = useMutation(USE_TOKEN);

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { email, password } });
    if (data?.login) {
      localStorage.setItem('hm_token', data.login.token);
      setUser(data.login.user);
      setFollowingIds(data.login.user.followingIds || []);
      await apolloClient.refetchQueries({ include: ['GetPosts', 'GetBookings', 'GetConversations'] });
    }
  };

  const register = async (name: string, email: string, password: string, accountType?: string) => {
    const { data } = await registerMutation({ variables: { name, email, password, accountType } });
    if (data?.register) {
      localStorage.setItem('hm_token', data.register.token);
      setUser(data.register.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('hm_token');
    setUser(null);
    apolloClient.clearStore();
  };

  const updateProfile = async (updates: { name?: string; bio?: string; avatar?: string; location?: string; country?: string; currency?: string; businessName?: string; darkMode?: boolean; language?: string }) => {
    const { data } = await updateProfileMutation({ variables: updates });
    if (data?.updateProfile) {
      setUser((prev: any) => prev ? { ...prev, ...data.updateProfile } : data.updateProfile);
    }
  };

  const redeemPoints = async (pointCost: number) => {
    const { data } = await redeemPointsMutation({
      variables: { pointCost },
      refetchQueries: ['GetMyTokens', 'GetMe'],
    });
    if (data?.redeemPoints) {
      setUser((prev: any) => prev ? { ...prev, loyaltyPoints: data.redeemPoints.newLoyaltyPoints } : prev);
    }
  };

  const useDiscountToken = async (code: string) => {
    await useTokenMutation({
      variables: { code },
      refetchQueries: ['GetMyTokens', 'GetMe'],
    });
  };

  const addPost = async (post: Omit<Post, 'id' | 'createdAt'>) => {
    await createPostMutation({
      variables: {
        image: post.image,
        images: post.images,
        styleName: post.styleName,
        barberName: post.barberName,
        barberShop: post.barberShop,
        location: post.location,
        price: post.price,
        currency: post.currency,
        description: post.description,
        gender: post.gender,
        hashtags: post.hashtags,
      },
      refetchQueries: ['GetPosts'],
    });
  };

  const toggleLike = (postId: string) => {
    toggleLikeMutation({
      variables: { postId },
      refetchQueries: ['GetPosts'],
    });
  };

  const ratePost = (_postId: string, _rating: number) => { };

  const toggleSavePost = (postId: string) => {
    toggleSaveMutation({
      variables: { postId },
      refetchQueries: ['GetPosts', 'GetMe'],
    });
  };

  const addComment = (postId: string, content: string) => {
    addCommentMutation({
      variables: { postId, content },
      refetchQueries: ['GetPosts'],
    });
  };

  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    await createBookingMutation({
      variables: {
        postId: booking.postId,
        styleName: booking.styleName,
        barberName: booking.barberName,
        location: booking.location,
        price: booking.price,
        currency: booking.currency,
        depositAmount: booking.depositAmount,
        date: booking.date instanceof Date ? booking.date.toISOString() : booking.date,
        time: booking.time,
        paymentMethod: booking.paymentMethod,
      },
      refetchQueries: ['GetBookings'],
    });
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    updateBookingMutation({
      variables: { id, status: updates.status, paymentStatus: updates.paymentStatus },
      refetchQueries: ['GetBookings'],
    });
  };

  const addToLikedStyles = (post: Post) => {
    if (!likedStyles.find(p => p.id === post.id)) {
      setLikedStyles(prev => [...prev, post]);
    }
  };

  const addToDoneStyles = (post: Post) => {
    if (!doneStyles.find(p => p.id === post.id)) {
      setDoneStyles(prev => [...prev, post]);
    }
  };

  const sendMessage = (receiverId: string, message: string) => {
    sendMessageMutation({
      variables: { receiverId, content: message },
      refetchQueries: ['GetConversations'],
    });
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId,
      message,
      timestamp: new Date(),
    };
    setLocalMessages(prev => [...prev, newMsg]);
  };

  const isFollowing = (userId: string) => {
    return followingIds.includes(userId);
  };

  const toggleFollow = async (userId: string) => {
    await toggleFollowMutation({
      variables: { userId },
    });

    setFollowingIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        login,
        register,
        logout,
        updateProfile,
        posts,
        postsLoading,
        refetchPosts,
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
        messages: localMessages,
        sendMessage,
        isFollowing,
        toggleFollow,
        navState,
        setNavState,
        myTokens,
        tokenTiers,
        tokensLoading,
        redeemPoints,
        useDiscountToken,
        refetchTokens,
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
