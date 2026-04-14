'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Phone, Map } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockBarberShops } from '../data/mockData';
import { useApp } from '../context/AppContext';

export function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { posts } = useApp();

  // Filter barbershops that offer this hairstyle
  const results = mockBarberShops.filter(shop =>
    shop.hairstyles.some(style =>
      style.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Search Results</h1>
                <p className="text-sm text-gray-500">"{searchQuery}"</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/map')}
              className="flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              Map View
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {results.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              Found {results.length} nearby {results.length === 1 ? 'shop' : 'shops'} offering this hairstyle
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((shop) => {
                // Get posts from this shop
                const shopPosts = posts.filter(post => 
                  post.barberShop === shop.name && 
                  post.styleName.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                  <Card key={shop.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div 
                        className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50"
                        onClick={() => router.push(`/shop/${shop.id}?style=${encodeURIComponent(searchQuery)}`)}
                      >
                        <h3 className="text-lg font-semibold mb-2">{shop.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{shop.phone}</span>
                        </div>
                      </div>

                      {/* Barbers Section */}
                      <div className="p-4 border-b">
                        <p className="text-sm font-medium text-gray-700 mb-3">Available Barbers:</p>
                        <div className="space-y-2">
                          {shop.barbers.map((barber) => (
                            <div key={barber.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={barber.avatar || null}
                                  alt={barber.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="text-sm font-medium">{barber.name}</p>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                    <span className="text-xs text-gray-600">{barber.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {barber.specialties[0]}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Style Examples */}
                      {shopPosts.length > 0 && (
                        <div className="p-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Their work on this style:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {shopPosts.slice(0, 4).map((post) => (
                              <div
                                key={post.id}
                                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => router.push('/home')}
                              >
                                <img
                                  src={post.image}
                                  alt={post.styleName}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                  <p className="text-white text-xs font-medium truncate">
                                    ${post.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 pt-0">
                        <Button
                          onClick={() => router.push(`/shop/${shop.id}?style=${encodeURIComponent(searchQuery)}`)}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          View Details & Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No barbershops found offering "{searchQuery}"</p>
            <p className="text-sm text-gray-400 mt-2">Try searching for a different hairstyle</p>
            <Button
              onClick={() => router.push('/home')}
              className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
