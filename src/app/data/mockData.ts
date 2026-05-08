import { User, Post, Booking, DiscountToken, Conversation } from '../types';

export interface Barber {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  avatar: string;
}

export interface Hairstylist {
  id: string;
  barberId: string;
  name: string;
  image: string;
  specialty: string;
  experience: string;
}

export interface BarberShop {
  id: string;
  name: string;
  location: string;
  city: string;
  barbers: Barber[];
  hairstyles: string[];
  phone: string;
}

export const mockBarberShops: BarberShop[] = [
  {
    id: '1',
    name: 'Elite Cuts Barbershop',
    location: '123 Main St, New York, NY',
    city: 'New York',
    phone: '(212) 555-0123',
    hairstyles: ['Mid Fade with Textured Top', 'Classic Taper Fade', 'Buzz Cut', 'Crew Cut'],
    barbers: [
      {
        id: 'b1',
        name: 'Marcus Johnson',
        specialties: ['Fades', 'Modern Cuts', 'Beard Trimming'],
        rating: 4.8,
        avatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
      },
      {
        id: 'b2',
        name: 'James Wilson',
        specialties: ['Classic Cuts', 'Hot Towel Shave'],
        rating: 4.7,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
    ],
  },
  {
    id: '2',
    name: 'Glamour Hair Studio',
    location: '456 Sunset Blvd, Los Angeles, CA',
    city: 'Los Angeles',
    phone: '(310) 555-0456',
    hairstyles: ['Box Braids with Curly Ends', 'Balayage Highlights', 'Silk Press', 'Knotless Braids'],
    barbers: [
      {
        id: 'b3',
        name: 'Sarah Williams',
        specialties: ['Braids', 'Weaves', 'Natural Hair'],
        rating: 5.0,
        avatar: 'https://images.unsplash.com/photo-1583331030595-6601e6c7b5d5?w=150',
      },
      {
        id: 'b4',
        name: 'Jessica Martinez',
        specialties: ['Color', 'Highlights', 'Extensions'],
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      },
    ],
  },
  {
    id: '3',
    name: 'Style Haven',
    location: '789 Michigan Ave, Chicago, IL',
    city: 'Chicago',
    phone: '(312) 555-0789',
    hairstyles: ['Mid Fade with Textured Top', 'Pompadour', 'Undercut'],
    barbers: [
      {
        id: 'b5',
        name: 'Michael Chen',
        specialties: ['Modern Styles', 'Asian Hair'],
        rating: 4.6,
        avatar: 'https://images.unsplash.com/photo-1618049049816-43a00d5b0c3d?w=150',
      },
    ],
  },
];

export const mockHairstylists: Hairstylist[] = [
  {
    id: 'hs1',
    barberId: 'b1',
    name: 'Alex Rivera',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300',
    specialty: 'Fade Specialist',
    experience: '5 years',
  },
  {
    id: 'hs2',
    barberId: 'b1',
    name: 'Chris Thompson',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    specialty: 'Texture Expert',
    experience: '7 years',
  },
  {
    id: 'hs3',
    barberId: 'b2',
    name: 'Daniel Brooks',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    specialty: 'Classic Cuts',
    experience: '10 years',
  },
  {
    id: 'hs4',
    barberId: 'b3',
    name: 'Emily Davis',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    specialty: 'Braiding Expert',
    experience: '8 years',
  },
  {
    id: 'hs5',
    barberId: 'b3',
    name: 'Ashley Johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    specialty: 'Natural Hair Specialist',
    experience: '6 years',
  },
  {
    id: 'hs6',
    barberId: 'b4',
    name: 'Maria Garcia',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    specialty: 'Color Specialist',
    experience: '9 years',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    email: 'marcus@email.com',
    accountType: 'business',
    avatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
    bio: 'Professional barber with 10+ years of experience. Specializing in fades and modern cuts.',
    followers: 1245,
    following: 320,
    location: 'New York, NY',
    country: 'USA',
    currency: 'USD',
    businessName: 'Elite Cuts Barbershop',
    subscription: {
      isActive: true,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-03-01'),
      isTrial: false,
      trialEndsAt: new Date('2026-02-15'),
      monthlyFee: 100,
      currency: 'ZAR',
      paymentHistory: [
        {
          id: 'pay1',
          amount: 100,
          currency: 'ZAR',
          date: new Date('2026-02-01'),
          status: 'completed',
          type: 'subscription',
        },
      ],
    },
    staff: [
      {
        id: 's1',
        name: 'James Wilson',
        role: 'Senior Barber',
        email: 'james@elitecuts.com',
        phone: '(212) 555-0124',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        specialties: ['Classic Cuts', 'Hot Towel Shave'],
      },
    ],
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@email.com',
    accountType: 'business',
    avatar: 'https://images.unsplash.com/photo-1583331030595-6601e6c7b5d5?w=150',
    bio: 'Celebrity hairstylist. Braids, weaves, and natural hair expert.',
    followers: 3420,
    following: 890,
    location: 'Los Angeles, CA',
    country: 'USA',
    currency: 'USD',
    businessName: 'Glamour Hair Studio',
    subscription: {
      isActive: true,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-15'),
      isTrial: true,
      trialEndsAt: new Date('2026-03-15'),
      monthlyFee: 100,
      currency: 'ZAR',
      paymentHistory: [],
    },
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@email.com',
    accountType: 'personal',
    avatar: 'https://images.unsplash.com/photo-1618049049816-43a00d5b0c3d?w=150',
    bio: 'Hair enthusiast sharing my journey',
    followers: 542,
    following: 678,
    location: 'Chicago, IL',
    country: 'USA',
    currency: 'USD',
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Marcus Johnson',
    userAvatar: 'https://images.unsplash.com/photo-7591420 16096-a9d1a5ebcc09?w=150',
    accountType: 'business',
    image: 'https://images.unsplash.com/photo-1618049049816-43a00d5b0c3d?w=800',
    styleName: 'Mid Fade with Textured Top',
    barberName: 'Marcus Johnson',
    barberShop: 'Elite Cuts Barbershop',
    location: 'New York, NY',
    price: 45,
    currency: 'USD',
    rating: 4.8,
    likes: 234,
    isLiked: false,
    isSaved: false,
    description: 'Clean mid fade with textured styling on top. Perfect for a professional yet stylish look.',
    gender: 'male',
    createdAt: new Date('2026-03-20'),
    hashtags: ['fade', 'menscut', 'hairstyle', 'barber'],
    taggedUsers: [],
    comments: [],
    commentsCount: 0,
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Williams',
    userAvatar: 'https://images.unsplash.com/photo-1583331030595-6601e6c7b5d5?w=150',
    accountType: 'business',
    image: 'https://images.unsplash.com/photo-1702236240794-58dc4c6895e5?w=800',
    styleName: 'Box Braids with Curly Ends',
    barberName: 'Sarah Williams',
    barberShop: 'Glamour Hair Studio',
    location: 'Los Angeles, CA',
    price: 180,
    currency: 'USD',
    rating: 5.0,
    likes: 567,
    isLiked: true,
    isSaved: false,
    description: 'Beautiful box braids with curly ends. Protective style that lasts 6-8 weeks.',
    gender: 'female',
    createdAt: new Date('2026-03-19'),
    products: [
      { name: 'Curly Frontal 18"', price: 120, type: 'frontal' },
      { name: 'Edge Control', price: 15, type: 'extension' },
    ],
    hashtags: ['boxbraids', 'protectivestyles', 'braids', 'naturalhair'],
    taggedUsers: [{ id: '3', name: 'David Chen' }],
    comments: [],
    commentsCount: 0,
  },
  {
    id: '3',
    userId: '2',
    userName: 'Sarah Williams',
    userAvatar: 'https://images.unsplash.com/photo-1583331030595-6601e6c7b5d5?w=150',
    accountType: 'business',
    image: 'https://images.unsplash.com/photo-1565699774381-d421d9e7ad41?w=800',
    styleName: 'Balayage Highlights',
    barberName: 'Sarah Williams',
    barberShop: 'Glamour Hair Studio',
    location: 'Los Angeles, CA',
    price: 250,
    currency: 'USD',
    rating: 4.9,
    likes: 892,
    isLiked: false,
    description: 'Stunning balayage highlights with blonde tones. Includes cut and style.',
    gender: 'female',
    createdAt: new Date('2026-03-18'),
  },
  {
    id: '4',
    userId: '1',
    userName: 'Marcus Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1759142016096-a9d1a5ebcc09?w=150',
    accountType: 'business',
    image: 'https://images.unsplash.com/photo-1761064039763-0d9aa5124510?w=800',
    styleName: 'Classic Taper Fade',
    barberName: 'Marcus Johnson',
    barberShop: 'Elite Cuts Barbershop',
    location: 'New York, NY',
    price: 40,
    currency: 'USD',
    rating: 4.7,
    likes: 156,
    isLiked: false,
    description: 'Timeless taper fade with a clean lineup.',
    gender: 'male',
    createdAt: new Date('2026-03-17'),
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    postId: '2',
    styleName: 'Box Braids with Curly Ends',
    barberName: 'Sarah Williams',
    location: 'Los Angeles, CA',
    price: 180,
    currency: 'USD',
    depositAmount: 90,
    depositPaid: true,
    date: new Date('2026-03-25'),
    time: '10:00 AM',
    status: 'upcoming',
    paymentMethod: 'online',
    paymentStatus: 'partial',
  },
  {
    id: '2',
    postId: '1',
    styleName: 'Mid Fade with Textured Top',
    barberName: 'Marcus Johnson',
    location: 'New York, NY',
    price: 45,
    currency: 'USD',
    depositAmount: 45,
    depositPaid: true,
    date: new Date('2026-03-15'),
    time: '2:00 PM',
    status: 'completed',
    paymentMethod: 'offline',
    paymentStatus: 'completed',
  },
];

export const mockDiscountTokens: DiscountToken[] = [
  {
    id: '1',
    code: 'LOYALTY10',
    discount: 10,
    expiresAt: new Date('2026-04-30'),
    used: false,
  },
  {
    id: '2',
    code: 'NEWCLIENT20',
    discount: 20,
    expiresAt: new Date('2026-03-31'),
    used: false,
  },
  {
    id: '3',
    code: 'REFER15',
    discount: 15,
    expiresAt: new Date('2026-02-28'),
    used: true,
  },
];

export const mockConversations: Conversation[] = [
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
];

export const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];