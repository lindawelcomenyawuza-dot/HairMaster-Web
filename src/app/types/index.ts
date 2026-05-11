export type AccountType = 'personal' | 'business';

export type Currency = 'USD' | 'ZAR' | 'EUR' | 'GBP';

export type PostType = 'verified' | 'portfolio' | 'repost';

export interface Subscription {
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  isTrial: boolean;
  trialEndsAt: Date;
  monthlyFee: number;
  currency: Currency;
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: Currency;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  type: 'subscription' | 'booking';
}

export interface Documents {
  companyDocuments?: string[];
  proofOfAddress?: string;
  idDocument?: string;
  idNumber?: string;
}

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
  currency: Currency;
  businessName?: string;
  isFollowing?: boolean;
  isVerified?: boolean;
  emailVerified?: boolean;
  authProvider?: 'email' | 'google';
  verificationBadge?: 'verified' | 'business' | 'pro';
  subscription?: Subscription;
  documents?: Documents;
  staff?: StaffMember[];
  savedPosts?: string[];
  referralCode?: string;
  loyaltyPoints?: number;
  darkMode?: boolean;
  language?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  specialties: string[];
}

export interface Post {
  id: string;
  type: PostType;
  userId: string;
  userName: string;
  userAvatar: string;
  accountType: AccountType;
  image: string;
  images?: string[];
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
  currency: Currency;
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

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'booking' | 'payment' | 'subscription' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
}

export interface SavedCollection {
  id: string;
  name: string;
  postIds: string[];
  createdAt: Date;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  price: number;
  currency?: Currency;
  images?: string[];
  description?: string;
  category?: string;
  deliveryAvailable: boolean;
  deliveryFee?: number;
  deliveryAreas?: string[];
  inStock: boolean;
  createdAt?: Date;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productType: 'wig' | 'frontal' | 'extension' | 'accessory';
  productImage: string;
  quantity: number;
  price: number;
  currency: Currency;
  totalAmount: number;
  orderDate: Date;
  deliveryDate?: Date;
  status: 'pending' | 'processing' | 'accepted' | 'shipped' | 'on_the_way' | 'delivered' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: 'online' | 'offline';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  trackingNumber?: string;
  sellerId: string;
  sellerName: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  createdAt: Date;
  expiresAt: Date;
  views: number;
  hasViewed: boolean;
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
  currency: Currency;
  depositAmount?: number;
  depositPaid: boolean;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'upcoming';
  paymentMethod: 'online' | 'offline';
  paymentStatus?: 'pending' | 'partial' | 'completed';
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface ChatMsg {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

export interface Chat {
  id: string;
  type: 'booking' | 'enquiry';
  bookingId?: string;
  participants: string[];
  status: 'active' | 'locked' | 'expired';
  expiresAt?: Date;
  messages?: ChatMsg[];
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
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
  expiresAt: Date;
  used: boolean;
}
