import { API_BASE, authRequest } from './auth';
import { participantRequest, fullName, type Person } from './participant';
import { openRazorpayCheckout } from './razorpay';

/** One thing on sale, annotated with what this participant already owns. */
export type MerchItem = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  priceInr: number;
  imageUrl: string | null;
  /** Colour name shown to the buyer, e.g. "Midnight Black". */
  colorway: string | null;
  /** Fabric colour of the drawn mockup, as a CSS hex. */
  colorHex: string | null;
  sizes: string[];
  isAvailable: boolean;
  /** Null when the item is uncapped. */
  stockRemaining: number | null;
  soldOut: boolean;
  purchases: {
    id: number;
    itemId: number;
    size: string | null;
    quantity: number;
    amountPaid: number;
    paidAt: string | null;
  }[];
};

/** A line in the local basket. Lives only in the page's state until checkout. */
export type BasketLine = { itemId: number; size: string | null; quantity: number };

type MerchOrderResponse = {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  amountInPaise: number;
  currency?: string;
  keyId: string;
  items: { itemId: number; name: string; size: string | null; quantity: number; unitPriceInr: number; amount: number }[];
};

export type MerchPaymentResult = {
  orderId: string;
  status: string;
  amount: number;
  paidAt: string | null;
  items: { purchaseId: number; name: string; size: string | null; quantity: number; status: string; amount: number }[];
  /** Set when the money landed but nothing could be confirmed by it. */
  needsAttention?: string;
};

export type MerchOrder = {
  id: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paidAt: string | null;
  createdAt: string;
  razorpayPaymentId: string | null;
  purchases: {
    id: number;
    size: string | null;
    quantity: number;
    amountPaid: number;
    status: 'pending_payment' | 'confirmed' | 'cancelled';
    fulfilledAt: string | null;
    item: { id: number; name: string; slug: string; imageUrl: string | null };
  }[];
};

/**
 * The store front, readable signed in or not.
 *
 * `participantRequest` is deliberately not used here: it short-circuits when
 * there is no local session hint, and a logged-out visitor must still see the
 * designs. The cookie rides along when there is one, so a signed-in visitor
 * gets the `purchases` annotation from the same call.
 */
export async function merchItems(): Promise<MerchItem[]> {
  const response = await fetch(`${API_BASE}/api/merch/items`, {
    credentials: 'include',
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Could not load the merch store. Please try again.');
  }
  return (payload?.data ?? []) as MerchItem[];
}

/** The participant's own merch orders. Requires a session. */
export const merchOrders = () => participantRequest<MerchOrder[]>('/api/merch/my-orders');

/** A basket line keyed for comparison — same item, same size is the same line. */
export const lineKey = (line: Pick<BasketLine, 'itemId' | 'size'>) => `${line.itemId}::${line.size ?? ''}`;

/** What a basket comes to, priced against the catalogue the page is showing. */
export function basketTotal(basket: BasketLine[], items: MerchItem[]): number {
  return basket.reduce((sum, line) => {
    const item = items.find(i => i.id === line.itemId);
    return item ? sum + item.priceInr * line.quantity : sum;
  }, 0);
}

/**
 * Buy everything in the basket in one visit to Razorpay.
 *
 * Mirrors `payForAccommodation`: create the order, open Checkout, then verify
 * the captured payment with the backend — which is what actually confirms the
 * purchase. Resolves to the confirmation on success, or `null` if the
 * participant closed Checkout without paying. Rejects on any real failure so
 * the caller can show the message.
 */
export async function payForMerch({
  basket,
  user,
  onProgress,
}: {
  basket: BasketLine[];
  user: Person;
  onProgress?: (message: string) => void;
}): Promise<MerchPaymentResult | null> {
  const notify = onProgress || (() => {});

  notify('Creating secure payment order…');
  const order = await participantRequest<MerchOrderResponse>('/api/merch/pay', {
    items: basket.map(line => ({ itemId: line.itemId, size: line.size, quantity: line.quantity })),
  });

  notify('Opening payment gateway…');

  // Checkout is callback-driven; bridge it back to a promise so callers can
  // simply await the outcome.
  return new Promise<MerchPaymentResult | null>((resolve, reject) => {
    let settled = false;
    const finish = (fn: () => void) => { if (!settled) { settled = true; fn(); } };

    const summary = order.items
      .map(i => `${i.quantity}x ${i.name}${i.size ? ` (${i.size})` : ''}`)
      .join(', ');

    openRazorpayCheckout({
      keyId: order.keyId,
      orderId: order.orderId,
      razorpayOrderId: order.razorpayOrderId,
      amountInPaise: order.amountInPaise,
      currency: order.currency || 'INR',
      eventName: 'TF 26 Merch',
      description: `TF 26 Merch — ${summary}`.slice(0, 255),
      userName: fullName(user),
      userEmail: user.email,
      userPhone: user.phoneNumber,
      onSuccess: async response => {
        notify('Payment received. Confirming with the server…');
        try {
          const result = await participantRequest<MerchPaymentResult>('/api/merch/pay/verify', {
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

/**
 * Whether the signed-in participant can actually be sent to the gateway.
 * Razorpay needs a contactable payer, and the backend refuses the checkout
 * without one — so the page checks the same thing before offering the button.
 */
export const canCheckout = (user: Person | null) =>
  Boolean(user && user.verified !== false && user.phoneNumber?.trim() && user.collegeName?.trim());

/** Re-read the session's profile, for the fields `canCheckout` needs. */
export async function refreshProfile(): Promise<Person> {
  const { data } = await authRequest('/api/auth/me');
  return data.user as Person;
}
