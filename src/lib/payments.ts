import { participantRequest, fullName, type Person } from './participant';
import { openRazorpayCheckout } from './razorpay';

export type PaymentState = {
  /** What the backend charges for this event, in rupees. */
  amount: number;
  /** 'free' | 'before_registration' | 'after_round'. */
  trigger: string;
  /** Internal label the order is filed under (ROUND_1 / ROUND_2). */
  round: string;
  /** The round whose promotion actually opened the fee, or null if not promoted. */
  roundNumber: number | null;
  roundName: string | null;
  paid: boolean;
  pending: boolean;
  /** Promoted into the gating round and the fee is still outstanding. */
  dueNow: boolean;
  /** Not promoted into the gating round — the fee never opens. */
  rejected: boolean;
};

type OrderResponse = {
  orderId: string;
  razorpayOrderId: string;
  amountInPaise: number;
  keyId: string;
  currency?: string;
};

export type PayForEventOptions = {
  eventId: string;
  eventName: string;
  user: Person;
  /** Team events: the team the fee is being paid for. Only the leader may pay. */
  teamId?: number | null;
  /** Progress copy for the caller to surface while the gateway opens. */
  onProgress?: (message: string) => void;
};

/**
 * Create a Razorpay order, open Checkout, and verify the captured payment
 * with the backend — which is what actually confirms the registration.
 *
 * Resolves `true` once the server has verified the payment, `false` if the
 * participant closed Checkout without paying. Rejects on any real failure so
 * the caller can show the message.
 *
 * Shared by the event registration page (upfront fees) and the participant
 * portal (fees that fall due after a round promotion) so both go through the
 * identical create → checkout → verify sequence.
 */
export async function payForEvent({ eventId, eventName, user, teamId, onProgress }: PayForEventOptions): Promise<boolean> {
  const notify = onProgress || (() => {});

  notify('Creating secure payment order…');
  const order = await participantRequest<OrderResponse>('/api/payments/orders', {
    eventId,
    ...(teamId ? { teamData: { teamId } } : {}),
  });

  notify('Opening payment gateway…');

  // Checkout is callback-driven; bridge it back to a promise so callers can
  // simply await the outcome.
  return new Promise<boolean>((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => { if (!settled) { settled = true; fn(); } };

    openRazorpayCheckout({
      keyId: order.keyId,
      orderId: order.orderId,
      razorpayOrderId: order.razorpayOrderId,
      amountInPaise: order.amountInPaise,
      currency: order.currency || 'INR',
      eventName,
      userName: fullName(user),
      userEmail: user.email,
      userPhone: user.phoneNumber,
      onSuccess: async response => {
        notify('Payment received. Confirming with the server…');
        try {
          await participantRequest('/api/payments/orders/verify', {
            orderId: order.orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          finish(() => resolve(true));
        } catch (err) {
          // Money has been captured but our records disagree — never swallow this.
          finish(() => reject(err instanceof Error
            ? new Error(`${err.message} Your payment reference is ${response.razorpay_payment_id}. Please contact the organisers with it.`)
            : err));
        }
      },
      onFailure: err => finish(() => reject(new Error(err?.description || err?.message || 'Payment failed. Please try again.'))),
      onDismiss: () => finish(() => resolve(false)),
    }).catch(err => finish(() => reject(err)));
  });
}
