import { participantRequest, fullName, type Person } from './participant';
import { openRazorpayCheckout } from './razorpay';

/** A bookable night, annotated with this participant's own booking for it. */
export type AccommodationNight = {
  id: number;
  date: string;
  label: string;
  priceInr: number;
  isAvailable: boolean;
  booking: {
    id: number;
    status: 'pending_payment' | 'confirmed' | 'cancelled';
    amountPaid: number | null;
    paidAt: string | null;
    orderId: string | null;
  } | null;
};

type AccommodationOrderResponse = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  amountInPaise: number;
  currency?: string;
  keyId: string;
  nights: { id: number; label: string; date: string; priceInr: number }[];
};

export type AccommodationPaymentResult = {
  orderId: string;
  status: string;
  amount: number;
  paidAt: string | null;
  nights: { bookingId: number; configId: number; label: string; status: string }[];
  /** Set when the money landed but no night could be confirmed by it. */
  needsAttention?: string;
};

export const accommodationNights = () =>
  participantRequest<AccommodationNight[]>('/api/accommodation/nights');

/** Nights that are booked but not yet paid for. */
export const isPending = (night: AccommodationNight) => night.booking?.status === 'pending_payment';
export const isConfirmed = (night: AccommodationNight) => night.booking?.status === 'confirmed';

/** A night the participant may still pay for — unbooked, pending or cancelled. */
export const isPayable = (night: AccommodationNight) => night.isAvailable && !isConfirmed(night);

/**
 * Pay for every selected night in one visit to Razorpay.
 *
 * Mirrors `payForEvent`: create the order, open Checkout, then verify the
 * captured payment with the backend — which is what actually confirms the
 * nights. Resolves to the confirmation on success, or `null` if the
 * participant closed Checkout without paying. Rejects on any real failure so
 * the caller can show the message.
 */
export async function payForAccommodation({
  configIds,
  user,
  onProgress,
}: {
  configIds: number[];
  user: Person;
  onProgress?: (message: string) => void;
}): Promise<AccommodationPaymentResult | null> {
  const notify = onProgress || (() => {});

  notify('Creating secure payment order…');
  const order = await participantRequest<AccommodationOrderResponse>('/api/accommodation/pay', { configIds });

  notify('Opening payment gateway…');

  // Checkout is callback-driven; bridge it back to a promise so callers can
  // simply await the outcome.
  return new Promise<AccommodationPaymentResult | null>((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => { if (!settled) { settled = true; fn(); } };

    openRazorpayCheckout({
      keyId: order.keyId,
      orderId: order.orderId,
      razorpayOrderId: order.razorpayOrderId,
      amountInPaise: order.amountInPaise,
      currency: order.currency || 'INR',
      eventName: 'Accommodation',
      description: `Accommodation — ${order.nights.map(n => n.label).join(', ')}`,
      userName: fullName(user),
      userEmail: user.email,
      userPhone: user.phoneNumber,
      onSuccess: async response => {
        notify('Payment received. Confirming with the server…');
        try {
          const result = await participantRequest<AccommodationPaymentResult>('/api/accommodation/pay/verify', {
            orderId: order.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          finish(() => resolve(result));
        } catch (err) {
          // Money has been captured but our records disagree — never swallow this.
          finish(() => reject(err instanceof Error
            ? new Error(`${err.message} Your payment reference is ${response.razorpay_payment_id}. Please contact the organisers with it.`)
            : err));
        }
      },
      onFailure: err => finish(() => reject(new Error(err?.description || err?.message || 'Payment failed. Please try again.'))),
      onDismiss: () => finish(() => resolve(null)),
    }).catch(err => finish(() => reject(err)));
  });
}
