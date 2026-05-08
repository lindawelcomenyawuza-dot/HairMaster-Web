import type { Post } from '../../../context/AppContext';

export interface OtherProfileUser {
  id: string;
  name: string;
  accountType: 'personal' | 'business';
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  location?: string;
  businessName?: string;
}

export interface OtherProfileHeaderProps {
  onBack: () => void;
}

export interface OtherProfileInfoProps {
  profileUser: OtherProfileUser;
  userPostsCount: number;
}

export interface OtherProfileActionsProps {
  userId: string;
  accountType: OtherProfileUser['accountType'];
  isFollowing: boolean;
  onToggleFollow: () => void;
  onCall: () => void;
  onChat: () => void;
  onBookAppointment: () => void;
}

export interface OtherProfileLocationsProps {
  accountType: OtherProfileUser['accountType'];
  shopLocations: string[];
  phone?: string;
}

export interface OtherProfilePostsProps {
  userPosts: Post[];
}
