import type { Dispatch, SetStateAction } from 'react';
import type { Booking, Post, User } from '../../../context/AppContext';

export interface ProfileHeaderProps {
  onBack: () => void;
  onOpenSettings: () => void;
}

export interface VerificationBannerProps {
  isVerified?: boolean;
  onVerify: () => void;
}

export interface ProfileActionsProps {
  accountType: User['accountType'];
  onOpenBusinessDashboard: () => void;
}

export interface ProfileInfoProps {
  user: User;
  userPostsCount: number;
  onEditProfile: () => void;
}

export interface ProfileStatsProps {
  totalSpent: number;
  bookingsCount: number;
}

export interface ProfilePostsProps {
  userPosts: Post[];
  completedBookings: Booking[];
  onCreateFirstPost: () => void;
}

export interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editName: string;
  editBio: string;
  editAvatar: string;
  editLocation: string;
  setEditName: Dispatch<SetStateAction<string>>;
  setEditBio: Dispatch<SetStateAction<string>>;
  setEditAvatar: Dispatch<SetStateAction<string>>;
  setEditLocation: Dispatch<SetStateAction<string>>;
  onSave: () => void;
  saving: boolean;
}
