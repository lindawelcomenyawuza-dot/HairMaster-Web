'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import type { PriceFilterDialogProps } from './home.types';

export function PriceFilterDialog({
  open,
  onOpenChange,
  priceRange,
  setPriceRange,
  onApplyCustomRange,
  onSetLowPrice,
  onSetMediumPrice,
  onSetHighPrice,
  onResetPrices,
}: PriceFilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onValueChange={(value) => setPriceRange(value as [number, number])}
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
                onClick={onSetLowPrice}
              >
                Under $50
              </Button>
              <Button
                variant="outline"
                onClick={onSetMediumPrice}
              >
                $50 - $150
              </Button>
              <Button
                variant="outline"
                onClick={onSetHighPrice}
              >
                Over $150
              </Button>
              <Button
                variant="outline"
                onClick={onResetPrices}
              >
                All Prices
              </Button>
            </div>
          </div>
          <Button
            onClick={onApplyCustomRange}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Apply Custom Range
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
