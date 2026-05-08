'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { EditProfileDialog } from '../content/ProfileContent/UserProfilePage/EditProfileDialog';
import { ProfileActions } from '../content/ProfileContent/UserProfilePage/ProfileActions';
import { ProfileHeader } from '../content/ProfileContent/UserProfilePage/ProfileHeader';
import { ProfileInfo } from '../content/ProfileContent/UserProfilePage/ProfileInfo';
import { ProfilePosts } from '../content/ProfileContent/UserProfilePage/ProfilePosts';
import { ProfileStats } from '../content/ProfileContent/UserProfilePage/ProfileStats';
import { VerificationBanner } from '../content/ProfileContent/UserProfilePage/VerificationBanner';

export function ProfilePage() {
  const router = useRouter();
  const { user, logout, updateProfile, posts, bookings } = useApp();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const userPosts = posts.filter(p => p.userId === user.id);
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.price, 0);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: editName,
        bio: editBio,
        avatar: editAvatar,
        location: editLocation,
      });
      setShowEditProfile(false);
    } catch (err: any) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProfileHeader
        onBack={() => router.push('/home')}
        onOpenSettings={() => router.push('/settings')}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <VerificationBanner
          isVerified={user.isVerified}
          onVerify={() => router.push('/settings/verification')}
        />

        <ProfileActions
          accountType={user.accountType}
          onOpenBusinessDashboard={() => router.push('/business-dashboard')}
        />

        <ProfileInfo
          user={user}
          userPostsCount={userPosts.length}
          onEditProfile={() => setShowEditProfile(true)}
        />

        <ProfileStats
          totalSpent={totalSpent}
          bookingsCount={bookings.length}
        />

        <ProfilePosts
          userPosts={userPosts}
          completedBookings={completedBookings}
          onCreateFirstPost={() => router.push('/create-post')}
        />

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
        >
          Logout
        </Button>
      </div>

      <EditProfileDialog
        open={showEditProfile}
        onOpenChange={(open) => {
          if (open) {
            setEditName(user?.name || '');
            setEditBio(user?.bio || '');
            setEditAvatar(user?.avatar || '');
            setEditLocation(user?.location || '');
          }
          setShowEditProfile(open);
        }}
        editName={editName}
        editBio={editBio}
        editAvatar={editAvatar}
        editLocation={editLocation}
        setEditName={setEditName}
        setEditBio={setEditBio}
        setEditAvatar={setEditAvatar}
        setEditLocation={setEditLocation}
        onSave={handleSaveProfile}
        saving={saving}
      />
    </div>
  );
}
