import { getRequiredPublicApiUrl } from './api';

const BACKEND = getRequiredPublicApiUrl();
const PAYSTACK_SCRIPT_ID = 'paystack-inline-v2-script';

export interface PaystackInitResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

declare global {
  interface Window {
    PaystackPop?: new () => {
      resumeTransaction?: (accessCode: string, callbacks?: Record<string, unknown>) => void;
      newTransaction?: (options: Record<string, unknown>) => void;
    };
  }
}

export async function initiatePayment(params: {
  bookingId?: string;
  amount: number;
  currency?: string;
  email?: string;
}): Promise<PaystackInitResult> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('hm_token') : null;
  if (!token) throw new Error('Authentication required');

  const res = await fetch(`${BACKEND}/payments/initiate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Payment initiation failed' }));
    throw new Error(err.error || 'Payment initiation failed');
  }

  return res.json();
}

export async function checkPaymentStatus(reference: string): Promise<{
  status: 'pending' | 'success' | 'failed';
  amount: number;
  currency: string;
}> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('hm_token') : null;
  if (!token) throw new Error('Authentication required');

  const res = await fetch(`${BACKEND}/payments/status/${reference}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Could not fetch payment status' }));
    throw new Error(err.error || 'Could not fetch payment status');
  }

  return res.json();
}

let paystackScriptPromise: Promise<void> | null = null;

function loadPaystackInline() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.PaystackPop) return Promise.resolve();

  if (!paystackScriptPromise) {
    paystackScriptPromise = new Promise<void>((resolve, reject) => {
      if (window.PaystackPop) {
        resolve();
        return;
      }

      const existingScript = document.getElementById(PAYSTACK_SCRIPT_ID) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Could not load Paystack')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = PAYSTACK_SCRIPT_ID;
      script.src = 'https://js.paystack.co/v2/inline.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Could not load Paystack'));
      document.body.appendChild(script);
    });
  }

  return paystackScriptPromise;
}

export async function openPaystackPopup(params: {
  publicKey: string;
  email: string;
  amount: number;
  currency?: string;
  reference: string;
  accessCode?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  onError?: (message: string) => void;
}) {
  if (typeof window === 'undefined') return;
  await loadPaystackInline();

  if (!window.PaystackPop) throw new Error('Could not start Paystack checkout');

  const popup = new window.PaystackPop();

  if (params.accessCode && popup.resumeTransaction) {
    popup.resumeTransaction(params.accessCode, {
      onSuccess: (response: { reference?: string; trxref?: string }) => {
        params.onSuccess(response.reference || response.trxref || params.reference);
      },
      onCancel: params.onClose,
      onError: (error: { message?: string }) => {
        params.onError?.(error.message || 'Payment failed to load');
      },
    });
    return;
  }

  if (!popup.newTransaction) throw new Error('Could not start Paystack checkout');

  popup.newTransaction({
    key: params.publicKey,
    email: params.email,
    amount: Math.round(params.amount * 100),
    currency: params.currency || 'NGN',
    reference: params.reference,
    onSuccess: (response: { reference?: string; trxref?: string }) => {
      params.onSuccess(response.reference || response.trxref || params.reference);
    },
    onCancel: params.onClose,
    onError: (error: { message?: string }) => {
      params.onError?.(error.message || 'Payment failed to load');
    },
  });
}
