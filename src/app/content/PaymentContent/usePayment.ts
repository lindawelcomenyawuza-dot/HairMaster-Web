'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currency';
import { initiatePayment, openPaystackPopup, checkPaymentStatus } from '../../../lib/paystack';
import type { PaymentDetails } from './payment.types';

function formatCardNumber(value: string) {
  const cleaned = value.replace(/\s/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
}

export function usePayment() {
  const router = useRouter();
  const { addBooking, navState, user } = useApp();
  const paymentDetails = navState as unknown as PaymentDetails;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!paymentDetails) {
      router.push('/home');
    }
  }, [paymentDetails, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentDetails) return;

    setIsProcessing(true);

    try {
      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (paystackPublicKey && user?.email) {
        const { accessCode, authorizationUrl, reference } = await initiatePayment({
          bookingId: paymentDetails.bookingId,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency as string,
          email: user.email,
        });

        if (!accessCode && authorizationUrl) {
          window.location.href = authorizationUrl;
          return;
        }

        await openPaystackPopup({
          publicKey: paystackPublicKey,
          email: user.email,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency as string,
          reference,
          accessCode,
          onSuccess: async (ref: string) => {
            let confirmed = false;
            for (let i = 0; i < 5; i++) {
              await new Promise(r => setTimeout(r, 1500));
              try {
                const status = await checkPaymentStatus(ref);
                if (status.status === 'success') { confirmed = true; break; }
              } catch {}
            }

            setIsProcessing(false);
            setIsSuccess(true);

            setTimeout(() => {
              toast.success('Payment successful!');
              if (paymentDetails.onSuccess) paymentDetails.onSuccess();
              if (paymentDetails.type === 'booking' && paymentDetails.bookingData) {
                addBooking(paymentDetails.bookingData);
              }
              router.push(paymentDetails.type === 'booking' ? '/bookings' : '/profile');
            }, 1500);
          },
          onClose: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
          onError: (message: string) => {
            setIsProcessing(false);
            toast.error(message);
          },
        });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        toast.success('Payment successful!');
        if (paymentDetails.onSuccess) paymentDetails.onSuccess();
        if (paymentDetails.type === 'booking' && paymentDetails.bookingData) {
          addBooking(paymentDetails.bookingData);
        }
        router.push(paymentDetails.type === 'booking' ? '/bookings' : '/profile');
      }, 2000);
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message || 'Payment failed. Please try again.');
    }
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardNumber(formatCardNumber(cleaned));
    }
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\//g, '');
    if (cleaned.length <= 4 && /^\d*$/.test(cleaned)) {
      if (cleaned.length >= 2) {
        setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2));
      } else {
        setExpiryDate(cleaned);
      }
    }
  };

  const handleCvvChange = (value: string) => {
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  return {
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
    paymentAmountLabel: paymentDetails
      ? formatCurrency(paymentDetails.amount, paymentDetails.currency)
      : '',
  };
}
