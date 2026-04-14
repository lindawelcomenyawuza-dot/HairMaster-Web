'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { useApp } from '../context/AppContext';

export function HairstylesPage() {
  const router = useRouter();
  const { likedStyles, doneStyles } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">My Hairstyles</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="liked" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="liked" className="gap-2">
              <Heart className="w-4 h-4" />
              Liked ({likedStyles.length})
            </TabsTrigger>
            <TabsTrigger value="done" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Done ({doneStyles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liked" className="mt-6">
            {likedStyles.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {likedStyles.map((style) => (
                  <Card key={style.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <img
                      src={style.image}
                      alt={style.styleName}
                      className="w-full aspect-square object-cover"
                    />
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm truncate">{style.styleName}</h3>
                      <p className="text-xs text-gray-500 truncate">{style.barberName}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">${style.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No liked hairstyles yet</p>
                <p className="text-sm text-gray-400 mt-2">Like posts to save them here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-6">
            {doneStyles.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {doneStyles.map((style) => (
                  <Card key={style.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <img
                      src={style.image}
                      alt={style.styleName}
                      className="w-full aspect-square object-cover"
                    />
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm truncate">{style.styleName}</h3>
                      <p className="text-xs text-gray-500 truncate">{style.barberName}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">${style.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No completed hairstyles yet</p>
                <p className="text-sm text-gray-400 mt-2">Your booking history will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
