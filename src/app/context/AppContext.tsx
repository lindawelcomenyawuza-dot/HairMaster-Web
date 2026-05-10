'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { GET_POSTS, GET_BOOKINGS, GET_ME, GET_CONVERSATIONS, GET_MESSAGES, GET_MY_TOKENS, GET_TOKEN_TIERS } from '../../lib/graphql/queries';
import {
  LOGIN,
  REGISTER,
  CREATE_POST,
  REPOST,
  TOGGLE_LIKE,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT,
  REPORT_COMMENT,
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
export type PostType = 'verified' | 'portfolio' | 'repost';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  accountType: AccountType;
  avatar: string;
  avatarKey?: string;
  bio: string;
  followers: number;
  following: number;
  location?: string;
  country?: string;
  currency?: string;
  businessName?: string;
  isVerified?: boolean;
  authProvider?: 'email' | 'google';
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
  type: PostType;
  userId: string;
  userName: string;
  userAvatar: string;
  userAvatarKey?: string;
  accountType: AccountType;
  image: string;
  imageKey?: string;
  images?: string[];
  imageKeys?: string[];
  styleName: string;
  barberName: string;
  barberId?: string;
  barberShop?: string;
  salonId?: string;
  salonName?: string;
  stylistId?: string;
  stylistName?: string;
  stylistAvatar?: string;
  salonLogo?: string;
  location: string;
  bookingId?: string;
  originalPostId?: string;
  price: number;
  currency?: string;
  isService?: boolean;
  rating: number;
  likes: number;
  isLiked: boolean;
  isSaved?: boolean;
  description: string;
  gender: 'male' | 'female' | 'unisex';
  createdAt: Date;
  hashtags?: string[];
  products?: { name: string; price: number; type: string }[];
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
  userId?: string;
  barberId?: string;
  locationId?: string;
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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'upcoming';
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

export interface Chat {
  id: string;
  type: 'booking' | 'enquiry';
  bookingId?: string;
  participants: string[];
  status: 'active' | 'locked' | 'expired';
  expiresAt?: string;
  messages?: { id: string; senderId: string; content: string; createdAt: string }[];
  createdAt: string;
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
  loginWithGoogle: (token: string) => Promise<void>;
  register: (name: string, email: string, password: string, accountType: string | undefined, phone: string, consentAccepted: boolean) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { bio?: string; avatar?: string; avatarKey?: string; location?: string; country?: string; currency?: string; businessName?: string; darkMode?: boolean; language?: string }) => Promise<void>;
  posts: Post[];
  postsLoading: boolean;
  refetchPosts: () => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => Promise<void>;
  repost: (originalPostId: string) => Promise<void>;
  toggleLike: (postId: string) => void;
  ratePost: (postId: string, rating: number) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, content: string) => Promise<void>;
  editComment: (postId: string, commentId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  reportComment: (postId: string, commentId: string, reason?: string) => Promise<void>;
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

type GetMeResponse = { me: User };
type GetPostsResponse = { posts: Post[] };
const GOOGLE_AUTH_TIMEOUT_MS = 12000;

function persistAuthToken(token: string) {
  localStorage.setItem('hm_token', token);
  sessionStorage.setItem('hm_token', token);
}

function clearPersistedAuthToken() {
  localStorage.removeItem('hm_token');
  sessionStorage.removeItem('hm_token');
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function normalizePost(p: any): Post {
  return {
    ...p,
    type: p.type || 'portfolio',
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
  return !!localStorage.getItem('hm_token') || !!sessionStorage.getItem('hm_token');
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
    useQuery<GetMeResponse>(GET_ME, { skip: !hasToken() });

  useEffect(() => {
    if (meData?.me) setUser(meData.me);
    if (!meLoading) setAuthLoading(false);
  }, [meData, meLoading]);

  useEffect(() => {
    if (meError) {
      clearPersistedAuthToken();
      setAuthLoading(false);
    }
  }, [meError]);

  useEffect(() => {
    if (!hasToken()) setAuthLoading(false);
  }, []);

  const { data: postsData, loading: postsLoading, refetch: refetchPosts } =
    useQuery<GetPostsResponse>(GET_POSTS);
  const { data: bookingsData } = useQuery(GET_BOOKINGS, { skip: !user });
  const { data: conversationsData } = useQuery(GET_CONVERSATIONS, { skip: !user });
  const { data: tokensData, loading: tokensLoading, refetch: refetchTokens } = useQuery(GET_MY_TOKENS, { skip: !user });
  const { data: tiersData } = useQuery(GET_TOKEN_TIERS);

  const posts: Post[] = (postsData?.posts || []).map(normalizePost);
  const bookings = ((bookingsData as any)?.bookings || []).map(normalizeBooking);
  const conversations = ((conversationsData as any)?.conversations || []).map(normalizeConversation);
  const myTokens: DiscountToken[] = (tokensData as any)?.myTokens || [];
  const tokenTiers: TokenTier[] = (tiersData as any)?.tokenTiers || [];

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [createPostMutation] = useMutation(CREATE_POST);
  const [repostMutation] = useMutation(REPOST);
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE);
  const [addCommentMutation] = useMutation(ADD_COMMENT);
  const [editCommentMutation] = useMutation(EDIT_COMMENT);
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT);
  const [reportCommentMutation] = useMutation(REPORT_COMMENT);
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
    const d = data as any;
    if (d?.login) {
      localStorage.setItem('hm_token', d.login.token);
      sessionStorage.setItem('hm_token', d.login.token);
      setUser(d.login.user);
      setFollowingIds(d.login.user.followingIds || []);
      await apolloClient.refetchQueries({ include: ['GetPosts', 'GetBookings', 'GetConversations'] });
    }
  };

  const loginWithGoogle = async (token: string) => {
    persistAuthToken(token);

    try {
      const { data } = await withTimeout(
        apolloClient.query<GetMeResponse>({
          query: GET_ME,
          fetchPolicy: 'network-only',
        }),
        GOOGLE_AUTH_TIMEOUT_MS,
        'Google sign-in timed out'
      );

      const me = data?.me;
      if (!me) {
        throw new Error('Google login failed');
      }

      setUser(me);
      setFollowingIds((me as any).followingIds || []);
      void apolloClient.refetchQueries({ include: ['GetPosts', 'GetBookings', 'GetConversations'] });
    } catch (error) {
      clearPersistedAuthToken();
      throw error instanceof Error ? error : new Error('Google login failed');
    }
  };

  const register = async (name: string, email: string, password: string, accountType: string | undefined, phone: string, consentAccepted: boolean) => {
    const { data } = await registerMutation({ variables: { name, email, password, accountType, phone, consentAccepted } });
    const d = data as any;
    if (d?.register) {
      if (d.register.token) {
        localStorage.setItem('hm_token', d.register.token);
        sessionStorage.setItem('hm_token', d.register.token);
        setUser(d.register.user);
      }
    }
  };

  const logout = () => {
    clearPersistedAuthToken();
    setUser(null);
    apolloClient.clearStore();
  };

  const updateProfile = async (updates: any) => {
    const { data } = await updateProfileMutation({ variables: updates });
    const d = data as any;
    if (d?.updateProfile) {
      setUser((prev: any) => prev ? { ...prev, ...d.updateProfile } : d.updateProfile);
    }
  };

  const redeemPoints = async (pointCost: number) => {
    const { data } = await redeemPointsMutation({
      variables: { pointCost },
      refetchQueries: ['GetMyTokens', 'GetMe'],
    });
    const d = data as any;
    if (d?.redeemPoints) {
      setUser((prev: any) => prev ? { ...prev, loyaltyPoints: d.redeemPoints.newLoyaltyPoints } : prev);
    }
  };

  const useDiscountToken = async (code: string) => {
    await useTokenMutation({ variables: { code }, refetchQueries: ['GetMyTokens', 'GetMe'] });
  };

  const addPost = async (post: Omit<Post, 'id' | 'createdAt'>) => {
    await createPostMutation({
      variables: {
        type: post.type || 'portfolio',
        image: post.image,
        imageKey: post.imageKey,
        images: post.images,
        imageKeys: post.imageKeys,
        styleName: post.styleName,
        barberName: post.barberName,
        barberShop: post.barberShop,
        salonId: post.salonId,
        stylistId: post.stylistId,
        location: post.location,
        price: post.price,
        currency: post.currency,
        isService: post.isService,
        description: post.description,
        gender: post.gender,
        hashtags: post.hashtags,
        bookingId: post.bookingId,
      },
      refetchQueries: ['GetPosts'],
    });
  };

  const repost = async (originalPostId: string) => {
    await repostMutation({
      variables: { originalPostId },
      refetchQueries: ['GetPosts'],
    });
  };

  const toggleLike = (postId: string) => {
    toggleLikeMutation({ variables: { postId }, refetchQueries: ['GetPosts'] });
  };

  const ratePost = (_postId: string, _rating: number) => {};

  const toggleSavePost = (postId: string) => {
    toggleSaveMutation({ variables: { postId }, refetchQueries: ['GetPosts', 'GetMe'] });
  };

  const addComment = async (postId: string, content: string) => {
    await addCommentMutation({ variables: { postId, content }, refetchQueries: ['GetPosts'] });
  };

  const editComment = async (postId: string, commentId: string, content: string) => {
    await editCommentMutation({ variables: { postId, commentId, content }, refetchQueries: ['GetPosts'] });
  };

  const deleteComment = async (postId: string, commentId: string) => {
    await deleteCommentMutation({ variables: { postId, commentId }, refetchQueries: ['GetPosts'] });
  };

  const reportComment = async (postId: string, commentId: string, reason?: string) => {
    await reportCommentMutation({ variables: { postId, commentId, reason } });
  };

  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    await createBookingMutation({
      variables: {
        postId: booking.postId,
        barberId: booking.barberId,
        locationId: booking.locationId,
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

  const isFollowing = (userId: string) => followingIds.includes(userId);

  const toggleFollow = async (userId: string) => {
    await toggleFollowMutation({ variables: { userId } });
    setFollowingIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser, authLoading, login, loginWithGoogle, register, logout, updateProfile,
        posts, postsLoading, refetchPosts, addPost, repost,
        toggleLike, ratePost, toggleSavePost, addComment, editComment, deleteComment, reportComment,
        bookings, addBooking, updateBooking,
        likedStyles, doneStyles, addToLikedStyles, addToDoneStyles,
        conversations, messages: localMessages, sendMessage,
        isFollowing, toggleFollow,
        navState, setNavState,
        myTokens, tokenTiers, tokensLoading, redeemPoints, useDiscountToken, refetchTokens,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}
