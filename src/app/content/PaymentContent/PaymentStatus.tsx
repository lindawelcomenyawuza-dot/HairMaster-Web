'use client';

import { Check } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import type { PaymentStatusProps } from './payment.types';

export function PaymentStatus({ paymentAmountLabel }: PaymentStatusProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment of {paymentAmountLabel} has been processed successfully.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
