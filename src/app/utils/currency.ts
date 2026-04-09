import { Currency } from '../types';

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  ZAR: 'R',
  EUR: '€',
  GBP: '£',
};

export const currencyByCountry: Record<string, Currency> = {
  'United States': 'USD',
  'USA': 'USD',
  'South Africa': 'ZAR',
  'United Kingdom': 'GBP',
  'UK': 'GBP',
  'France': 'EUR',
  'Germany': 'EUR',
  'Spain': 'EUR',
  'Italy': 'EUR',
  'New York': 'USD',
  'Los Angeles': 'USD',
  'Chicago': 'USD',
  'California': 'USD',
  'Johannesburg': 'ZAR',
  'Cape Town': 'ZAR',
  'Pretoria': 'ZAR',
  'Durban': 'ZAR',
};

export function getCurrencyFromLocation(location?: string): Currency {
  if (!location) return 'USD';
  
  for (const [region, currency] of Object.entries(currencyByCountry)) {
    if (location.toLowerCase().includes(region.toLowerCase())) {
      return currency;
    }
  }
  
  return 'USD';
}

function getSymbol(currency: string): string {
  return currencySymbols[currency as Currency] ?? '$';
}

export function formatCurrency(amount: number, currency?: string): string {
  const symbol = getSymbol(currency ?? 'USD');
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatCurrencySimple(amount: number, currency?: string): string {
  const symbol = getSymbol(currency ?? 'USD');
  return `${symbol}${amount}`;
}
