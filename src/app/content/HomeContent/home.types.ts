import type { Dispatch, FormEventHandler, SetStateAction } from 'react';
import type { Post } from '../../context/AppContext';

export type HomePriceRange = [number, number];

export interface HomeHeaderProps {
  onNavigateToDiscounts: () => void;
  onNavigateToProfile: () => void;
}

export interface HomeSearchFiltersProps {
  searchQuery: string;
  genderFilter: string;
  priceFilter: string;
  locationFilter: string;
  priceRange: HomePriceRange;
  onSearchQueryChange: (value: string) => void;
  onGenderFilterChange: (value: string) => void;
  onLocationFilterChange: (value: string) => void;
  onOpenPriceFilter: () => void;
  onClearFilters: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export interface CreatePostButtonProps {
  onCreatePost: () => void;
}

export interface PostsFeedProps {
  filteredPosts: Post[];
}

export interface PriceFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceRange: HomePriceRange;
  setPriceRange: Dispatch<SetStateAction<HomePriceRange>>;
  onApplyCustomRange: () => void;
  onSetLowPrice: () => void;
  onSetMediumPrice: () => void;
  onSetHighPrice: () => void;
  onResetPrices: () => void;
}

export interface BottomNavigationProps {
  onNavigateToHome: () => void;
  onNavigateToHairstyles: () => void;
  onNavigateToBookings: () => void;
  onNavigateToOrders: () => void;
  onNavigateToChat: () => void;
  onNavigateToSettings: () => void;
}
