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
  displayName: string;
  editBio: string;
  editAvatar: string;
  editAvatarKey: string;
  pendingAvatarFile: File | null;
  setEditBio: Dispatch<SetStateAction<string>>;
  setEditAvatar: Dispatch<SetStateAction<string>>;
  setEditAvatarKey: Dispatch<SetStateAction<string>>;
  setPendingAvatarFile: Dispatch<SetStateAction<File | null>>;
  onSave: () => void;
  saving: boolean;
}
