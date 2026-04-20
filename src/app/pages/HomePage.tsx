'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StoriesBar } from '../components/StoriesBar';
import { useApp } from '../context/AppContext';
import { BottomNavigation } from '../content/HomeContent/BottomNavigation';
import { CreatePostButton } from '../content/HomeContent/CreatePostButton';
import { HomeHeader } from '../content/HomeContent/HomeHeader';
import { HomeSearchFilters } from '../content/HomeContent/HomeSearchFilters';
import { PostsFeed } from '../content/HomeContent/PostsFeed';
import { PriceFilterDialog } from '../content/HomeContent/PriceFilterDialog';

export function HomePage() {
  const router = useRouter();
  const { posts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

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

  const handleClearFilters = () => {
    setGenderFilter('all');
    setPriceFilter('all');
    setLocationFilter('all');
    setPriceRange([0, 500]);
  };

  const handleLowPriceFilter = () => {
    setPriceFilter('low');
    setShowPriceFilter(false);
  };

  const handleMediumPriceFilter = () => {
    setPriceFilter('medium');
    setShowPriceFilter(false);
  };

  const handleHighPriceFilter = () => {
    setPriceFilter('high');
    setShowPriceFilter(false);
  };

  const handleResetPrices = () => {
    setPriceFilter('all');
    setPriceRange([0, 500]);
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
      <HomeHeader
        onNavigateToDiscounts={() => router.push('/discounts')}
        onNavigateToProfile={() => router.push('/profile')}
      />

      <StoriesBar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <HomeSearchFilters
          searchQuery={searchQuery}
          genderFilter={genderFilter}
          priceFilter={priceFilter}
          locationFilter={locationFilter}
          priceRange={priceRange}
          onSearchQueryChange={setSearchQuery}
          onGenderFilterChange={setGenderFilter}
          onLocationFilterChange={setLocationFilter}
          onOpenPriceFilter={() => setShowPriceFilter(true)}
          onClearFilters={handleClearFilters}
          onSubmit={handleSearch}
        />

        <CreatePostButton onCreatePost={() => router.push('/create-post')} />

        <PostsFeed filteredPosts={filteredPosts} />
      </div>

      <PriceFilterDialog
        open={showPriceFilter}
        onOpenChange={setShowPriceFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onApplyCustomRange={handlePriceFilterApply}
        onSetLowPrice={handleLowPriceFilter}
        onSetMediumPrice={handleMediumPriceFilter}
        onSetHighPrice={handleHighPriceFilter}
        onResetPrices={handleResetPrices}
      />

      <BottomNavigation
        onNavigateToHome={() => router.push('/home')}
        onNavigateToHairstyles={() => router.push('/hairstyles')}
        onNavigateToBookings={() => router.push('/bookings')}
        onNavigateToOrders={() => router.push('/orders')}
        onNavigateToChat={() => router.push('/chat')}
        onNavigateToSettings={() => router.push('/settings')}
      />
    </div>
  );
}
