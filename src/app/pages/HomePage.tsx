'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Send, User, Ticket, Filter, X, Home, Calendar, MessageCircle, Package, Settings } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { Slider } from '../components/ui/slider';
import { PostCard } from '../components/PostCard';
import { StoriesBar } from '../components/StoriesBar';
import { useApp } from '../context/AppContext';

export function HomePage() {
  const router = useRouter();
  const { posts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePriceFilterApply = () => {
    setPriceFilter('custom');
    setShowPriceFilter(false);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.barberName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'all' || post.gender === genderFilter;
    
    let matchesPrice = true;
    if (priceFilter === 'low') {
      matchesPrice = post.price < 50;
    } else if (priceFilter === 'medium') {
      matchesPrice = post.price >= 50 && post.price < 150;
    } else if (priceFilter === 'high') {
      matchesPrice = post.price >= 150;
    } else if (priceFilter === 'custom') {
      matchesPrice = post.price >= priceRange[0] && post.price <= priceRange[1];
    }
    
    const matchesLocation = locationFilter === 'all' || post.location.includes(locationFilter);

    return matchesSearch && matchesGender && matchesPrice && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Hair Master
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/discounts')}
                className="relative"
              >
                <Ticket className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/profile')}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stories Bar */}
      <StoriesBar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search hairstyles and press Enter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          <div className="grid grid-cols-4 gap-2">
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowPriceFilter(true)}
              className="justify-start"
            >
              <Filter className="w-4 h-4 mr-2" />
              {priceFilter === 'custom' 
                ? `$${priceRange[0]}-$${priceRange[1]}`
                : priceFilter === 'all' 
                  ? 'Price'
                  : priceFilter === 'low'
                    ? 'Under $50'
                    : priceFilter === 'medium'
                      ? '$50-$150'
                      : 'Over $150'}
            </Button>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              onClick={() => {
                setGenderFilter('all');
                setPriceFilter('all');
                setLocationFilter('all');
                setPriceRange([0, 500]);
              }}
              className="text-sm"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Post Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => router.push('/create-post')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Posts Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No posts found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Filter Dialog */}
      <Dialog open={showPriceFilter} onOpenChange={setShowPriceFilter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter by Price Range</DialogTitle>
            <DialogDescription>Select your preferred price range for hairstyles</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Minimum: ${priceRange[0]}</span>
                <span>Maximum: ${priceRange[1]}</span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium mb-3">Quick Filters</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceFilter('low');
                    setShowPriceFilter(false);
                  }}
                >
                  Under $50
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceFilter('medium');
                    setShowPriceFilter(false);
                  }}
                >
                  $50 - $150
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceFilter('high');
                    setShowPriceFilter(false);
                  }}
                >
                  Over $150
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceFilter('all');
                    setPriceRange([0, 500]);
                    setShowPriceFilter(false);
                  }}
                >
                  All Prices
                </Button>
              </div>
            </div>
            <Button
              onClick={handlePriceFilterApply}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Apply Custom Range
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
        <div className="max-w-2xl mx-auto px-2 py-2">
          <div className="grid grid-cols-6 gap-1">
            <Button
              variant="ghost"
              className="flex-col h-auto gap-1 px-2"
              onClick={() => router.push('/home')}>
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-col h-auto gap-1 px-2"
              onClick={() => router.push('/hairstyles')}
            >
              <Search className="w-5 h-5" />
              <span className="text-xs">Search</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-col h-auto gap-1 px-2"
              onClick={() => router.push('/bookings')}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Bookings</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-col h-auto gap-1 px-2"
              onClick={() => router.push('/orders')}
            >
              <Package className="w-5 h-5" />
              <span className="text-xs">Orders</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-col h-auto gap-1 px-2"
              onClick={() => router.push('/chat')}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Messages</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-col h-auto gap-1 px-2"
              onClick={() => router.push('/settings')}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
