'use client';
import { PaymentForm } from '../content/PaymentContent/PaymentForm';
import { PaymentHeader } from '../content/PaymentContent/PaymentHeader';
import { PaymentStatus } from '../content/PaymentContent/PaymentStatus';
import { PaymentSummary } from '../content/PaymentContent/PaymentSummary';
import { usePayment } from '../content/PaymentContent/usePayment';

export function PaystackPaymentPage() {
  const {
    router,
    paymentDetails,
    cardNumber,
    expiryDate,
    cvv,
    cardName,
    isProcessing,
    isSuccess,
    setCardName,
    handlePayment,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvvChange,
    paymentAmountLabel,
  } = usePayment();

  if (!paymentDetails || !paymentDetails.amount) {
    return null;
  }

  if (isSuccess) {
    return <PaymentStatus paymentAmountLabel={paymentAmountLabel} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PaymentHeader onBack={() => router.back()} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PaymentForm
              cardNumber={cardNumber}
              expiryDate={expiryDate}
              cvv={cvv}
              cardName={cardName}
              isProcessing={isProcessing}
              paymentAmountLabel={paymentAmountLabel}
              onCardNameChange={setCardName}
              onCardNumberChange={handleCardNumberChange}
              onExpiryChange={handleExpiryChange}
              onCvvChange={handleCvvChange}
              onSubmit={handlePayment}
            />
          </div>

          <div className="lg:col-span-1">
            <PaymentSummary
              paymentDetails={paymentDetails}
              paymentAmountLabel={paymentAmountLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
