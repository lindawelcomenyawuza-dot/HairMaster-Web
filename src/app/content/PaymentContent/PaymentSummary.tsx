'use client';

import { Card, CardContent } from '../../components/ui/card';
import type { PaymentSummaryProps } from './payment.types';

export function PaymentSummary({
  paymentDetails,
  paymentAmountLabel,
}: PaymentSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Payment Summary</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="font-medium">{paymentDetails.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Type</p>
            <p className="font-medium capitalize">{paymentDetails.type}</p>
          </div>
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">
                {paymentAmountLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> This is a demo payment page. No real transactions will be processed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
