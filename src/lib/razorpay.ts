/**
 * Helper to dynamically load and interact with the Razorpay Checkout SDK.
 */

export interface RazorpayPaymentError {
  code?: string;
  description?: string;
  source?: string;
  step?: string;
  reason?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface RazorpayFailureResponse {
  error?: RazorpayPaymentError;
  [key: string]: unknown;
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: RazorpayFailureResponse) => void) => void;
}

export type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OpenRazorpayOptions {
  keyId: string;
  orderId: string;
  razorpayOrderId: string;
  amountInPaise: number;
  currency?: string;
  eventName: string;
  userName: string;
  userEmail: string;
  userPhone?: string | null;
  onSuccess: (response: RazorpayPaymentSuccessResponse) => Promise<void> | void;
  onFailure?: (error: RazorpayPaymentError) => void;
  onDismiss?: () => void;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(options: OpenRazorpayOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Could not load payment gateway. Please check your internet connection and try again.');
  }

  const rzpOptions = {
    key: options.keyId,
    amount: options.amountInPaise,
    currency: options.currency || 'INR',
    name: 'TantraFiesta 2026',
    description: `Registration fee for ${options.eventName}`,
    image: '/assets/logo.png',
    order_id: options.razorpayOrderId,
    prefill: {
      name: options.userName,
      email: options.userEmail,
      contact: options.userPhone || '',
    },
    notes: {
      orderId: options.orderId,
      eventName: options.eventName,
    },
    theme: {
      color: '#E7137D',
    },
    handler: function (response: RazorpayPaymentSuccessResponse) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
  };

  const rzp = new window.Razorpay(rzpOptions);
  if (options.onFailure) {
    rzp.on('payment.failed', function (resp: RazorpayFailureResponse) {
      options.onFailure?.((resp.error || resp) as RazorpayPaymentError);
    });
  }
  rzp.open();
}
