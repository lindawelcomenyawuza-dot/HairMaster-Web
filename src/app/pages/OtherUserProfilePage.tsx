'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, MessageCircle, Calendar, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../context/AppContext';
import { mockUsers, mockBarberShops } from '../data/mockData';

export function OtherUserProfilePage() {
  const router = useRouter();
  const { userId } = useParams();
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={profileUser.avatar} />
                  <AvatarFallback className="text-2xl">{profileUser.name[0]}</AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-bold mb-1">{profileUser.name}</h2>
                {profileUser.businessName && (
                  <p className="text-gray-600 mb-2">{profileUser.businessName}</p>
                )}
                <Badge className="mb-3">
                  {profileUser.accountType === 'business' ? 'Business Account' : 'Personal Account'}
                </Badge>

                {profileUser.bio && (
                  <p className="text-gray-600 mb-3 max-w-md">{profileUser.bio}</p>
                )}

                {profileUser.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}

                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-2xl font-bold">{userPosts.length}</p>
                    <p className="text-sm text-gray-600">Posts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profileUser.followers}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profileUser.following}</p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {profileUser.accountType === 'business' && (
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <Button
                    variant={isFollowing(userId!) ? 'outline' : 'default'}
                    onClick={() => toggleFollow(userId!)}
                    className={!isFollowing(userId!) ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}
                  >
                    {isFollowing(userId!) ? 'Following' : 'Follow'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${shop?.phone || ''}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/chat/${userId}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>

                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => { setNavState({ barberId: userId, barberName: profileUser.name }); router.push('/book'); }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Locations (for business accounts) */}
        {profileUser.accountType === 'business' && shopLocations.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Locations</h3>
              <div className="space-y-3">
                {shopLocations.map((location, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{location}</p>
                      {shop && (
                        <p className="text-sm text-gray-600">{shop.phone}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Grid */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Posts</h3>
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.styleName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-2">
                          <p className="font-semibold text-sm mb-1">{post.styleName}</p>
                          <div className="flex items-center justify-center gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              {post.rating}
                            </span>
                            <span>${post.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No posts yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
