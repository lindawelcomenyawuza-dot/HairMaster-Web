'use client';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { mockUsers, mockBarberShops } from '../data/mockData';
import { OtherProfileActions } from '../content/ProfileContent/OtherProfilePage/OtherProfileActions';
import { OtherProfileHeader } from '../content/ProfileContent/OtherProfilePage/OtherProfileHeader';
import { OtherProfileInfo } from '../content/ProfileContent/OtherProfilePage/OtherProfileInfo';
import { OtherProfileLocations } from '../content/ProfileContent/OtherProfilePage/OtherProfileLocations';
import { OtherProfilePosts } from '../content/ProfileContent/OtherProfilePage/OtherProfilePosts';

export function OtherUserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId as string;
  const { posts, isFollowing, toggleFollow, setNavState } = useApp();

  const profileUser = mockUsers.find(u => u.id === userId);

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">User not found</p>
          <Button onClick={() => router.push('/home')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter(p => p.userId === userId);
  const shop = mockBarberShops.find(s => s.name === profileUser.businessName);
  const shopLocations = shop ? [shop.location] : profileUser.location ? [profileUser.location] : [];
  const following = isFollowing(userId!);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <OtherProfileHeader onBack={() => router.back()} />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <OtherProfileInfo
          profileUser={profileUser}
          userPostsCount={userPosts.length}
        />

        <OtherProfileActions
          userId={userId}
          accountType={profileUser.accountType}
          isFollowing={following}
          onToggleFollow={() => toggleFollow(userId!)}
          onCall={() => window.open(`tel:${shop?.phone || ''}`)}
          onChat={() => router.push(`/chat/${userId}`)}
          onBookAppointment={() => { setNavState({ barberId: userId, barberName: profileUser.name }); router.push('/book'); }}
        />

        <OtherProfileLocations
          accountType={profileUser.accountType}
          shopLocations={shopLocations}
          phone={shop?.phone}
        />

        <OtherProfilePosts userPosts={userPosts} />
      </div>
    </div>
  );
}
