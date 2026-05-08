import type { Currency } from '../../types';

export interface PaymentDetails {
  amount: number;
  currency: Currency;
  type: 'booking' | 'subscription';
  description: string;
  bookingId?: string;
  bookingData?: any;
  onSuccess?: () => void;
}

export interface PaymentHeaderProps {
  onBack: () => void;
}

export interface PaymentFormProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  isProcessing: boolean;
  paymentAmountLabel: string;
  onCardNameChange: (value: string) => void;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void | Promise<void>;
}

export interface PaymentSummaryProps {
  paymentDetails: PaymentDetails;
  paymentAmountLabel: string;
}

export interface PaymentStatusProps {
  paymentAmountLabel: string;
}
