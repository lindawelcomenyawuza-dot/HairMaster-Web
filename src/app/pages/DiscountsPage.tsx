'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ticket, Trophy, Gift, Clock, Users, Star, Zap, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { format, parseISO, isAfter } from 'date-fns';

const TIER_ICONS: Record<string, React.ReactNode> = {
  Bronze: <Star className="w-5 h-5 text-amber-600" />,
  Silver: <Star className="w-5 h-5 text-gray-400" />,
  Gold: <Star className="w-5 h-5 text-yellow-500" />,
  Platinum: <Zap className="w-5 h-5 text-purple-500" />,
};

const TIER_COLORS: Record<string, string> = {
  Bronze: 'bg-amber-100 border-amber-300',
  Silver: 'bg-gray-100 border-gray-300',
  Gold: 'bg-yellow-100 border-yellow-300',
  Platinum: 'bg-purple-100 border-purple-300',
};

export function DiscountsPage() {
  const router = useRouter();
  const { user, myTokens, tokenTiers, tokensLoading, redeemPoints, refetchTokens } = useApp();
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loyaltyPoints = user?.loyaltyPoints ?? 0;

  const availableTokens = myTokens.filter(t => !t.used && isAfter(parseISO(t.expiresAt), new Date()));
  const expiredTokens = myTokens.filter(t => !t.used && !isAfter(parseISO(t.expiresAt), new Date()));
  const usedTokens = myTokens.filter(t => t.used);

  const nextTier = tokenTiers.find(t => t.pointCost > loyaltyPoints) || tokenTiers[tokenTiers.length - 1];
  const prevTierPoints = tokenTiers.filter(t => t.pointCost <= loyaltyPoints).pop()?.pointCost ?? 0;
  const progress = nextTier
    ? Math.min(((loyaltyPoints - prevTierPoints) / (nextTier.pointCost - prevTierPoints)) * 100, 100)
    : 100;

  const handleRedeem = async (pointCost: number) => {
    if (loyaltyPoints < pointCost) {
      toast.error(`You need ${pointCost - loyaltyPoints} more points for this reward`);
      return;
    }
    setRedeeming(pointCost);
    try {
      await redeemPoints(pointCost);
      toast.success('Discount token earned! Check your available discounts.');
      refetchTokens();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to redeem points');
    } finally {
      setRedeeming(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(null), 2000);
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">Sign in to view your discounts</p>
          <Button className="mt-4" onClick={() => router.push('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Discounts & Rewards</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Loyalty Points Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Loyalty Points</h3>
                <p className="text-sm text-purple-100">Keep booking to earn rewards!</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-bold">{loyaltyPoints}</p>
                <p className="text-xs text-purple-100">points</p>
              </div>
            </div>
            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{loyaltyPoints} pts</span>
                  <span>{nextTier.pointCost - loyaltyPoints} pts to {nextTier.label}</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Redeem Points — Tiers */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Redeem Points for Discounts</h2>
          <div className="grid grid-cols-2 gap-3">
            {tokenTiers.map((tier) => {
              const canAfford = loyaltyPoints >= tier.pointCost;
              const isLoading = redeeming === tier.pointCost;
              return (
                <Card
                  key={tier.label}
                  className={`border-2 transition-all ${TIER_COLORS[tier.label] || 'bg-gray-100 border-gray-300'} ${canAfford ? 'opacity-100' : 'opacity-60'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {TIER_ICONS[tier.label] || <Gift className="w-5 h-5" />}
                      <span className="font-semibold">{tier.label}</span>
                    </div>
                    <p className="text-2xl font-bold mb-1">{tier.discount}% OFF</p>
                    <p className="text-xs text-gray-600 mb-3">{tier.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{tier.pointCost} pts</Badge>
                      <Button
                        size="sm"
                        disabled={!canAfford || isLoading}
                        onClick={() => handleRedeem(tier.pointCost)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3"
                      >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Redeem'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Available Discount Tokens */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Available Discounts</h2>
            {availableTokens.length > 0 && <Badge>{availableTokens.length}</Badge>}
          </div>

          {tokensLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : availableTokens.length > 0 ? (
            <div className="space-y-3">
              {availableTokens.map((token) => (
                <Card key={token.id} className="overflow-hidden border-2 border-purple-100">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 flex flex-col items-center justify-center min-w-[110px]">
                        <Gift className="w-8 h-8 mb-2" />
                        <p className="text-3xl font-bold">{token.discount}%</p>
                        <p className="text-xs text-purple-100">OFF</p>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base font-mono tracking-wider">{token.code}</h3>
                          <button
                            onClick={() => copyCode(token.code)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                          >
                            {copied === token.code
                              ? <CheckCircle className="w-4 h-4 text-green-500" />
                              : <Copy className="w-4 h-4" />
                            }
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {token.discount}% off your next booking
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Expires {format(parseISO(token.expiresAt), 'MMM d, yyyy')}</span>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          onClick={() => {
                            copyCode(token.code);
                            router.push('/bookings');
                          }}
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
                <p className="text-gray-500 font-medium">No available discounts</p>
                <p className="text-sm text-gray-400 mt-1">Redeem your points above to earn discount tokens!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* How to Earn */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">How to Earn Points</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-purple-100 p-2 rounded-full h-fit">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Complete Bookings</h4>
                  <p className="text-sm text-gray-600">Earn 10 points for every completed booking</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-blue-100 p-2 rounded-full h-fit">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Refer Friends</h4>
                  <p className="text-sm text-gray-600">Get 50 points for each successful referral</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-green-100 p-2 rounded-full h-fit">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Monthly Bonuses</h4>
                  <p className="text-sm text-gray-600">Special rewards for loyal customers every month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expired Tokens */}
        {expiredTokens.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-semibold text-gray-500">Expired</h2>
            </div>
            <div className="space-y-2">
              {expiredTokens.map((token) => (
                <Card key={token.id} className="opacity-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold font-mono">{token.code}</h3>
                        <p className="text-sm text-gray-600">{token.discount}% discount</p>
                      </div>
                      <Badge variant="outline" className="text-orange-500 border-orange-300">Expired</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Used Tokens */}
        {usedTokens.length > 0 && (
          <div>
            <h2 className="text-base font-semibold mb-3 text-gray-500">Used Discounts</h2>
            <div className="space-y-2">
              {usedTokens.map((token) => (
                <Card key={token.id} className="opacity-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold font-mono">{token.code}</h3>
                        <p className="text-sm text-gray-600">{token.discount}% discount</p>
                        {token.usedAt && (
                          <p className="text-xs text-gray-400 mt-1">Used {format(parseISO(token.usedAt), 'MMM d, yyyy')}</p>
                        )}
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
