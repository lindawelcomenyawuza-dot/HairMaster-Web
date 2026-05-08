const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:10000';

export interface PaystackInitResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
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

export function openPaystackPopup(params: {
  publicKey: string;
  email: string;
  amount: number;
  currency?: string;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) {
  if (typeof window === 'undefined') return;

  const handler = (window as any).PaystackPop?.setup({
    key:       params.publicKey,
    email:     params.email,
    amount:    Math.round(params.amount * 100),
    currency:  params.currency || 'NGN',
    ref:       params.reference,
    callback:  (response: { reference: string }) => params.onSuccess(response.reference),
    onClose:   params.onClose,
  });

  handler?.openIframe();
}
