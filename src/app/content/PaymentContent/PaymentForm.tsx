'use client';

import { CreditCard, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import type { PaymentFormProps } from './payment.types';

export function PaymentForm({
  cardNumber,
  expiryDate,
  cvv,
  cardName,
  isProcessing,
  paymentAmountLabel,
  onCardNameChange,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  onSubmit,
}: PaymentFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <CreditCard className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Card Details</h2>
            <p className="text-sm text-gray-500">Enter your card information</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => onCardNameChange(e.target.value)}
              disabled={isProcessing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => onCardNumberChange(e.target.value)}
              disabled={isProcessing}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Test card: 4111 1111 1111 1111
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => onExpiryChange(e.target.value)}
                disabled={isProcessing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => onCvvChange(e.target.value)}
                disabled={isProcessing}
                type="password"
                className="mt-1"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>Pay {paymentAmountLabel}</>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </CardContent>
    </Card>
  );
}
