'use client';

import { Filter, Search, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import type { HomeSearchFiltersProps } from './home.types';

function getPriceFilterLabel(priceFilter: string, priceRange: [number, number]) {
  return priceFilter === 'custom'
    ? `$${priceRange[0]}-$${priceRange[1]}`
    : priceFilter === 'all'
      ? 'Price'
      : priceFilter === 'low'
        ? 'Under $50'
        : priceFilter === 'medium'
          ? '$50-$150'
          : 'Over $150';
}

export function HomeSearchFilters({
  searchQuery,
  genderFilter,
  priceFilter,
  locationFilter,
  priceRange,
  onSearchQueryChange,
  onGenderFilterChange,
  onLocationFilterChange,
  onOpenPriceFilter,
  onClearFilters,
  onSubmit,
}: HomeSearchFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
      <form onSubmit={onSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search hairstyles and press Enter..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      <div className="grid grid-cols-4 gap-2">
        <Select value={genderFilter} onValueChange={onGenderFilterChange}>
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
          onClick={onOpenPriceFilter}
          className="justify-start"
        >
          <Filter className="w-4 h-4 mr-2" />
          {getPriceFilterLabel(priceFilter, priceRange)}
        </Button>

        <Select value={locationFilter} onValueChange={onLocationFilterChange}>
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
          onClick={onClearFilters}
          className="text-sm"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
