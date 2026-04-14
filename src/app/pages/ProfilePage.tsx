'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, MapPin, Calendar, DollarSign, Users, Image as ImageIcon, Edit2, LayoutDashboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

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
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold">Profile</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Verification Status Banner */}
        {!user.isVerified && (
          <Card 
            className="border-yellow-200 bg-yellow-50 cursor-pointer hover:bg-yellow-100 transition-colors"
            onClick={() => router.push('/settings/verification')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Account Unverified</h3>
                    <p className="text-xs text-gray-600">Complete verification to unlock all features</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                >
                  Verify Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Business Dashboard Button */}
        {user.accountType === 'business' && (
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Business Dashboard</h3>
                  <p className="text-sm text-gray-600">Manage bookings, staff, and payments</p>
                </div>
                <Button
                  onClick={() => router.push('/business-dashboard')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Open Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar || null} />
                  <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              {user.businessName && (
                <p className="text-gray-600 mb-2">{user.businessName}</p>
              )}
              <Badge className="mb-3">
                {user.accountType === 'business' ? 'Business Account' : 'Personal Account'}
              </Badge>

              {user.bio && (
                <p className="text-gray-600 mb-3">{user.bio}</p>
              )}

              {user.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}

              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-2xl font-bold">{userPosts.length}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.followers}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.following}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-xl font-bold">${totalSpent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bookings</p>
                  <p className="text-xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">
              <ImageIcon className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {userPosts.map((post) => (
                  <div key={post.id} className="aspect-square">
                    <img
                      src={post.image}
                      alt={post.styleName}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No posts yet</p>
                <Button
                  onClick={() => router.push('/create-post')}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Create First Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {completedBookings.length > 0 ? (
              <div className="space-y-3">
                {completedBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{booking.styleName}</h3>
                          <p className="text-sm text-gray-600">{booking.barberName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(booking.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <p className="text-green-600 font-semibold">${booking.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No booking history</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
        >
          Logout
        </Button>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={(open) => {
        if (open) {
          setEditName(user?.name || '');
          setEditBio(user?.bio || '');
          setEditAvatar(user?.avatar || '');
          setEditLocation(user?.location || '');
        }
        setShowEditProfile(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLocation">Location</Label>
              <Input
                id="editLocation"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="e.g. New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                placeholder="Tell others about yourself..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture URL</Label>
              <Input
                id="avatar"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                placeholder="Paste an image URL"
              />
              {editAvatar && (
                <div className="mt-2">
                  <img
                    src={editAvatar || null}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover bg-gray-200"
                  />
                </div>
              )}
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
