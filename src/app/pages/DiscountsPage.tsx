'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ticket, Trophy, Gift, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { mockDiscountTokens } from '../data/mockData';
import { format } from 'date-fns';

export function DiscountsPage() {
  const router = useRouter();

  const availableTokens = mockDiscountTokens.filter(t => !t.used);
  const usedTokens = mockDiscountTokens.filter(t => t.used);
  const loyaltyPoints = 450; // Mock loyalty points
  const nextRewardAt = 500;
  const progress = (loyaltyPoints / nextRewardAt) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Discounts & Rewards</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Loyalty Progress */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Loyalty Points</h3>
                <p className="text-sm text-purple-100">Keep booking to earn rewards!</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{loyaltyPoints} points</span>
                <span>{nextRewardAt - loyaltyPoints} to next reward</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Available Discount Tokens */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Available Discounts</h2>
            <Badge>{availableTokens.length}</Badge>
          </div>

          {availableTokens.length > 0 ? (
            <div className="space-y-3">
              {availableTokens.map((token) => (
                <Card key={token.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 flex flex-col items-center justify-center min-w-[120px]">
                        <Gift className="w-8 h-8 mb-2" />
                        <p className="text-3xl font-bold">{token.discount}%</p>
                        <p className="text-xs text-purple-100">OFF</p>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{token.code}</h3>
                            <p className="text-sm text-gray-600">
                              {token.discount}% discount on your next booking
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                          <Clock className="w-4 h-4" />
                          <span>Expires {format(token.expiresAt, 'MMM d, yyyy')}</span>
                        </div>
                        <Button
                          className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          size="sm"
                        >
                          Apply to Booking
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No available discounts</p>
                <p className="text-sm text-gray-400 mt-2">Keep booking to earn more rewards!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* How to Earn */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">How to Earn Rewards</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-purple-100 p-2 rounded-full h-fit">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Complete Bookings</h4>
                  <p className="text-sm text-gray-600">Earn 10 points for every booking</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-blue-100 p-2 rounded-full h-fit">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Refer Friends</h4>
                  <p className="text-sm text-gray-600">Get 50 points for each referral</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-green-100 p-2 rounded-full h-fit">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Monthly Bonuses</h4>
                  <p className="text-sm text-gray-600">Special rewards for loyal customers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Used Tokens */}
        {usedTokens.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-500">Used Discounts</h2>
            <div className="space-y-3">
              {usedTokens.map((token) => (
                <Card key={token.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{token.code}</h3>
                        <p className="text-sm text-gray-600">{token.discount}% discount</p>
                      </div>
                      <Badge variant="outline">Used</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
