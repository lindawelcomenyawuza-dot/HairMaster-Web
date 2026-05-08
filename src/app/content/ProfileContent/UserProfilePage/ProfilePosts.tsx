'use client';

import { Calendar, Image as ImageIcon, ShoppingBag, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import type { ProfilePostsProps } from './profile.types';

export function ProfilePosts({
  userPosts,
  completedBookings,
  onCreateFirstPost,
}: ProfilePostsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">
          <ImageIcon className="w-4 h-4 mr-2" />
          Posts
        </TabsTrigger>
        <TabsTrigger value="products">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Products
        </TabsTrigger>
        <TabsTrigger value="reviews">
          <Star className="w-4 h-4 mr-2" />
          Reviews
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {userPosts.map((post) => (
              <div key={post.id} className="aspect-square relative">
                <img
                  src={post.image}
                  alt={post.styleName}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
                {post.type === 'verified' && (
                  <div className="absolute top-1 left-1">
                    <Badge className="bg-green-600 text-xs px-1 py-0">✓</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No posts yet</p>
            <Button
              onClick={onCreateFirstPost}
              className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Create First Post
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="products" className="mt-6">
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No products yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Business accounts can add products from the business dashboard.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
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
                        {format(new Date(booking.date), 'MMM d, yyyy')}
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Verified Customer</Badge>
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
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-2">Reviews appear after completed bookings.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
