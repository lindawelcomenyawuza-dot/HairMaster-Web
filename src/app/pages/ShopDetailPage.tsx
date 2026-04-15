'use client';
import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockBarberShops } from '../data/mockData';
import { useApp } from '../context/AppContext';

export function ShopDetailPage() {
  const router = useRouter();
  const { shopId } = useParams();
  const searchParams = useSearchParams();
  const styleQuery = searchParams.get('style') || '';
  const { posts, setNavState } = useApp();

  const shop = mockBarberShops.find(s => s.id === shopId);

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Shop not found</p>
          <Button onClick={() => router.push('/home')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Get posts from this shop filtered by style
  const shopPosts = posts.filter(post => 
    post.barberShop === shop.name && 
    (styleQuery ? post.styleName.toLowerCase().includes(styleQuery.toLowerCase()) : true)
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">{shop.name}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Shop Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">{shop.name}</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{shop.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span>{shop.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${shop.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => { setNavState({ shop, styleQuery }); router.push('/book'); }}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="styles" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="styles">Styles</TabsTrigger>
            <TabsTrigger value="barbers">Our Barbers</TabsTrigger>
          </TabsList>

          <TabsContent value="styles" className="mt-6">
            {shopPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shopPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.styleName}
                        className="w-full aspect-square object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-purple-600">
                        ${post.price}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{post.styleName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{post.barberName}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm">{post.rating}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => { setNavState({ post, shop }); router.push('/book'); }}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No styles available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="barbers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.barbers.map((barber) => (
                <Card key={barber.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={barber.avatar || undefined}
                        alt={barber.name}
                        className="w-24 h-24 rounded-full object-cover mb-4"
                      />
                      <h3 className="text-lg font-semibold mb-2">{barber.name}</h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{barber.rating}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {barber.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
