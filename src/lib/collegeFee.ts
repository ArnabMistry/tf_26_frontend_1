/**
 * The host-college entry rate, for display.
 *
 * An event may carry a `collegePrice` alongside its `price`: what a student
 * of the host college pays instead of the standard fee. A null or undefined
 * `collegePrice` means the event has no separate rate and everyone pays
 * `price`, which is how every event behaved before the field existed.
 *
 * This mirrors src/lib/event-fee.js on the backend, which is the only thing
 * that decides what Razorpay is actually asked for. Everything here is for
 * showing a participant the right number before they get there -- never for
 * deciding what to charge.
 */

export const COLLEGE_EMAIL_DOMAIN = 'iiitn.ac.in';

/** True when this account email is on the host-college rate. */
export function isCollegeEmail(email: string | null | undefined): boolean {
  if (typeof email !== 'string') return false;
  const at = email.lastIndexOf('@');
  if (at < 0) return false;
  const domain = email.slice(at + 1).trim().toLowerCase();
  return domain === COLLEGE_EMAIL_DOMAIN || domain.endsWith(`.${COLLEGE_EMAIL_DOMAIN}`);
}

type Priced = { price?: number | null; collegePrice?: number | null };

/** Does this event charge host-college participants something different? */
export function hasCollegeRate(event: Priced | null | undefined): boolean {
  const value = event?.collegePrice;
  return value !== null && value !== undefined && Number.isFinite(Number(value));
}

/** The fee one head pays, by which rate they are on. */
export function unitPriceFor(event: Priced | null | undefined, isCollegeStudent: boolean): number {
  const general = Math.max(0, Number(event?.price) || 0);
  if (!isCollegeStudent || !hasCollegeRate(event)) return general;
  return Math.max(0, Number(event?.collegePrice) || 0);
}

/**
 * How a listing describes the fee to a visitor whose email we do not know --
 * both rates, so an IIITN student can see theirs without signing in.
 */
export function describeBothRates(event: Priced | null | undefined, suffix = ''): string {
  const general = unitPriceFor(event, false);
  if (general <= 0) return 'Free';
  const standard = `₹${general}${suffix}`;
  if (!hasCollegeRate(event)) return standard;
  const college = unitPriceFor(event, true);
  if (college === general) return standard;
  return `${standard} · ₹${college}${suffix} for IIITN Nagpur students`;
}
