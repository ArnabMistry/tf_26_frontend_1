import { test, expect, type Page } from '@playwright/test';

const user = { id: 'person-1', firstName: 'Vinay', lastName: 'Kumar', email: 'vinay@example.test', role: 'participant', festId: 'TF123456', collegeName: 'IIIT Nagpur', phoneNumber: '9876543210', verified: true, allowedEventIds: [] };

/** `capacity`/`booked` drive the 15-bed cap; these nights have room. */
const NIGHTS = [
  { id: 1, date: '2026-10-24T00:00:00.000Z', label: 'Night of 24th Oct', priceInr: 500, isAvailable: true, capacity: 15, booked: 2, remaining: 13, isFull: false },
  { id: 2, date: '2026-10-25T00:00:00.000Z', label: 'Night of 25th Oct', priceInr: 500, isAvailable: true, capacity: 15, booked: 0, remaining: 15, isFull: false },
  { id: 3, date: '2026-10-26T00:00:00.000Z', label: 'Night of 26th Oct', priceInr: 600, isAvailable: true, capacity: 15, booked: 0, remaining: 15, isFull: false },
];

/**
 * Stands in for the backend and for Razorpay Checkout, which cannot be driven
 * from a test. `window.Razorpay` is replaced with a stub that immediately
 * calls the success handler, so everything either side of the gateway — the
 * selection, the order request, and the verify call that actually confirms the
 * nights — is exercised for real.
 */
async function mockParticipant(page: Page, { confirmed = [] as number[] } = {}) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.addInitScript(() => {
    class FakeRazorpay {
      options: Record<string, unknown>;
      constructor(options: Record<string, unknown>) {
        this.options = options;
        (window as unknown as { __rzp: Record<string, unknown> }).__rzp = options;
      }
      on() {}
      open() {
        const handler = this.options.handler as (r: unknown) => void;
        handler({ razorpay_payment_id: 'pay_stub_1', razorpay_order_id: this.options.order_id, razorpay_signature: 'sig_stub' });
      }
    }
    (window as unknown as { Razorpay: unknown }).Razorpay = FakeRazorpay;
  });

  const paid = new Set<number>(confirmed);
  const calls: { path: string; body: unknown }[] = [];

  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const method = route.request().method();
    let body: unknown = null;
    try { body = route.request().postDataJSON(); } catch { /* GET */ }
    calls.push({ path, body });

    let data: unknown = {};
    if (path === '/api/auth/me') data = { user };
    else if (path === '/api/user/profile') data = { user, stats: { totalRegisteredEvents: 0, totalTeams: 0, totalQualifiedRounds: 0 }, registeredEvents: [], teams: [], activities: [] };
    else if (path === '/api/user/notifications') data = { notifications: [], unreadCount: 0, page: 1, totalPages: 1 };
    else if (path === '/api/user/meals') data = { meals: [] };
    else if (path === '/api/accommodation/nights') {
      data = NIGHTS.map(n => ({
        ...n,
        booking: paid.has(n.id)
          ? { id: n.id * 10, status: 'confirmed', amountPaid: n.priceInr, paidAt: '2026-10-17T06:00:00Z', orderId: 'accom_stub' }
          : null,
      }));
    } else if (path === '/api/accommodation/pay' && method === 'POST') {
      const ids: number[] = (body as { configIds: number[] }).configIds;
      const picked = NIGHTS.filter(n => ids.includes(n.id));
      data = {
        orderId: 'accom_stub',
        razorpayOrderId: 'order_stub',
        amount: picked.reduce((s, n) => s + n.priceInr, 0),
        amountInPaise: picked.reduce((s, n) => s + n.priceInr, 0) * 100,
        currency: 'INR',
        keyId: 'rzp_test_stub',
        nights: picked,
      };
    } else if (path === '/api/accommodation/pay/verify' && method === 'POST') {
      // Only now do the nights become confirmed — exactly as the backend does it.
      const ids: number[] = ((calls.find(c => c.path === '/api/accommodation/pay')?.body as { configIds: number[] }) || { configIds: [] }).configIds;
      ids.forEach(id => paid.add(id));
      data = {
        orderId: 'accom_stub', status: 'SUCCESS',
        amount: NIGHTS.filter(n => ids.includes(n.id)).reduce((s, n) => s + n.priceInr, 0),
        paidAt: '2026-10-17T06:00:00Z',
        nights: NIGHTS.filter(n => ids.includes(n.id)).map(n => ({ bookingId: n.id * 10, configId: n.id, label: n.label, status: 'confirmed' })),
      };
    }
    await route.fulfill({ json: { success: true, data } });
  });

  return { calls };
}

test('participant picks nights, sees a running total, and pays for them in one checkout', async ({ page }) => {
  const { calls } = await mockParticipant(page);
  await page.goto('/profile?tab=accommodation');

  const section = page.locator('#accommodation');
  await expect(section.getByRole('heading', { name: 'Accommodation' })).toBeVisible();
  await expect(section.getByText('Not booked')).toBeVisible();

  // Every night on offer is listed with its own price.
  for (const night of NIGHTS) {
    await expect(section.getByRole('heading', { name: night.label })).toBeVisible();
  }

  // Nothing is payable until something is picked.
  await expect(section.getByText('Select the nights you want.')).toBeVisible();
  await expect(section.getByRole('button', { name: /^Pay ₹0$/ })).toBeDisabled();

  // Pick two of the three nights; the total is the sum of exactly those.
  await section.getByLabel('Select Night of 24th Oct for ₹500').check();
  await expect(section.getByText('1 night selected · ₹500 total')).toBeVisible();
  await section.getByLabel('Select Night of 26th Oct for ₹600').check();
  await expect(section.getByText('2 nights selected · ₹1100 total')).toBeVisible();

  // Unticking removes it from the bill again.
  await section.getByLabel('Select Night of 26th Oct for ₹600').uncheck();
  await expect(section.getByText('1 night selected · ₹500 total')).toBeVisible();
  await section.getByLabel('Select Night of 26th Oct for ₹600').check();

  await section.getByRole('button', { name: 'Pay ₹1100' }).click();

  // Confirmed only after the verify round-trip.
  await expect(section.getByText(/Payment confirmed/)).toBeVisible();
  await expect(section.getByText('2 nights booked')).toBeVisible();

  // One order was created, for exactly the two nights picked, and the gateway
  // was opened for the matching amount.
  const orders = calls.filter(c => c.path === '/api/accommodation/pay');
  expect(orders).toHaveLength(1);
  expect((orders[0].body as { configIds: number[] }).configIds.sort()).toEqual([1, 3]);
  expect(await page.evaluate(() => (window as unknown as { __rzp: { amount: number; order_id: string } }).__rzp.amount)).toBe(110000);
  expect(calls.filter(c => c.path === '/api/accommodation/pay/verify')).toHaveLength(1);

  // A paid night can no longer be selected, and says what was paid.
  await expect(section.getByLabel('Select Night of 24th Oct for ₹500')).toHaveCount(0);
  await expect(section.getByText(/Paid ₹500/)).toBeVisible();
  await expect(section.getByText(/Paid ₹600/)).toBeVisible();
  // The unpicked night is still on offer.
  await expect(section.getByLabel('Select Night of 25th Oct for ₹500')).toBeVisible();
});

test('a participant with an incomplete profile is told to finish it before paying', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const bare = { ...user, collegeName: null, phoneNumber: null };
    let data: unknown = {};
    if (path === '/api/auth/me') data = { user: bare };
    else if (path === '/api/user/profile') data = { user: bare, stats: { totalRegisteredEvents: 0, totalTeams: 0, totalQualifiedRounds: 0 }, registeredEvents: [], teams: [], activities: [] };
    else if (path === '/api/user/notifications') data = { notifications: [], unreadCount: 0, page: 1, totalPages: 1 };
    else if (path === '/api/user/meals') data = { meals: [] };
    else if (path === '/api/accommodation/nights') data = NIGHTS.map(n => ({ ...n, booking: null }));
    await route.fulfill({ json: { success: true, data } });
  });

  await page.goto('/profile?tab=accommodation');
  // The portal blocks an incomplete profile with a modal before anything else.
  await page.getByRole('button', { name: 'Dismiss for now' }).click();

  const section = page.locator('#accommodation');
  await expect(section.getByText(/Add your college name and phone number/)).toBeVisible();
  await section.getByLabel('Select Night of 24th Oct for ₹500').check();
  await expect(section.getByRole('button', { name: 'Pay ₹500' })).toBeDisabled();
});

test('already-booked nights show as confirmed and cannot be re-selected', async ({ page }) => {
  await mockParticipant(page, { confirmed: [1, 2, 3] });
  await page.goto('/profile?tab=accommodation');
  const section = page.locator('#accommodation');
  await expect(section.getByText('3 nights booked')).toBeVisible();
  await expect(section.getByText('You are booked for every night on offer.')).toBeVisible();
  await expect(section.getByRole('checkbox')).toHaveCount(0);
});

// ── Admin ───────────────────────────────────────────────────────────────────

const PARTICIPANTS = [
  { id: 'u1', firstName: 'Asha', lastName: 'Rao', email: 'asha@example.test', festId: 'TF100001', collegeName: 'MANIT', phoneNumber: '9000000001', hasAccommodation: true, state: 'confirmed', confirmedNights: ['Night of 24th Oct'], pendingNights: [], totalPaid: 500, bookings: [{ id: 11, configId: 1, label: 'Night of 24th Oct', date: NIGHTS[0].date, status: 'confirmed', amountPaid: 500, paidAt: '2026-10-17T06:00:00Z' }] },
  { id: 'u2', firstName: 'Dev', lastName: 'Patel', email: 'dev@example.test', festId: 'TF100002', collegeName: 'IIIT', phoneNumber: '9000000002', hasAccommodation: false, state: 'pending', confirmedNights: [], pendingNights: ['Night of 25th Oct'], totalPaid: 0, bookings: [{ id: 12, configId: 2, label: 'Night of 25th Oct', date: NIGHTS[1].date, status: 'pending_payment', amountPaid: 500, paidAt: null }] },
  { id: 'u3', firstName: 'Mira', lastName: 'Shah', email: 'mira@example.test', festId: 'TF100003', collegeName: 'VIT', phoneNumber: '9000000003', hasAccommodation: false, state: 'none', confirmedNights: [], pendingNights: [], totalPaid: 0, bookings: [] },
];

async function mockAdmin(page: Page) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  const calls: { path: string; search: string; body: unknown; method: string }[] = [];

  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const method = route.request().method();
    let body: unknown = null;
    try { body = route.request().postDataJSON(); } catch { /* GET */ }
    calls.push({ path, search: url.search, body, method });

    let data: unknown = {};
    if (path === '/api/auth/me') data = { user: { id: 'me', role: 'super', allowedEventIds: null } };
    else if (path === '/api/admin/dashboard') data = { totals: { events: 0, registrations: 0, teams: 0, users: 3 }, perEventStats: [], recentRegistrations: [] };
    else if (path === '/api/admin/accommodation/summary') {
      data = {
        perNight: NIGHTS.map((n, i) => ({ configId: n.id, label: n.label, date: n.date, priceInr: n.priceInr, isAvailable: n.id !== 3, capacity: 15, taken: i === 0 ? 1 : 0, remaining: i === 0 ? 14 : 15, isFull: false, confirmed: i === 0 ? 1 : 0, pending: i === 1 ? 1 : 0, cancelled: 0, revenueInr: i === 0 ? 500 : 0 })),
        totals: { confirmedGuests: 1, pendingGuests: 1, confirmedBookings: 1, pendingBookings: 1, revenueInr: 500 },
      };
    } else if (path === '/api/admin/accommodation/configs') {
      data = NIGHTS.map(n => ({ ...n, isAvailable: n.id !== 3, _count: { bookings: 1 } }));
    } else if (path === '/api/admin/accommodation/participants') {
      const state = url.searchParams.get('state');
      const search = url.searchParams.get('search');
      let list = PARTICIPANTS;
      if (state) list = list.filter(p => p.state === state);
      if (search) list = list.filter(p => p.email.includes(search) || p.festId.includes(search));
      data = { total: list.length, page: 1, limit: 50, totalPages: 1, participants: list };
    } else if (path === '/api/admin/accommodation/bookings') {
      data = {
        total: 1, page: 1, limit: 50, totalPages: 1,
        bookings: [{ id: 12, status: 'pending_payment', amountPaid: 500, createdAt: '2026-10-17T05:00:00Z', paidAt: null, razorpayPaymentId: null, user: PARTICIPANTS[1], config: { label: 'Night of 25th Oct', date: NIGHTS[1].date, priceInr: 500 }, order: null }],
      };
    }
    await route.fulfill({ json: { success: true, data } });
  });

  return { calls };
}

test('super admin can see who has accommodation, and filter to who does not', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=accommodation');

  await expect(page.getByRole('heading', { name: 'Accommodation', exact: true })).toBeVisible();

  // Headline numbers.
  await expect(page.getByText('Guests with a bed')).toBeVisible();
  await expect(page.locator('.admin-stats article').filter({ hasText: 'Revenue' }).getByText('₹500')).toBeVisible();
  await expect(page.locator('.admin-stats article').filter({ hasText: 'Guests with a bed' }).getByText('1')).toBeVisible();

  // The per-person answer: does this participant have a bed?
  await expect(page.getByRole('cell', { name: /asha@example\.test/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'YES' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'UNPAID' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'NO' })).toBeVisible();
  await expect(page.getByRole('cell', { name: /Night of 24th Oct — confirmed/ })).toBeVisible();

  // Filtering to "no accommodation" asks the backend for exactly that.
  await page.getByLabel('Status').selectOption('none');
  await expect.poll(() => calls.some(c => c.path === '/api/admin/accommodation/participants' && c.search.includes('state=none'))).toBe(true);
  await expect(page.getByRole('cell', { name: /mira@example\.test/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: /asha@example\.test/ })).toHaveCount(0);

  // Searching passes the term through.
  await page.getByLabel('Status').selectOption('');
  await page.getByLabel('Name, email or Fest ID').fill('TF100002');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect.poll(() => calls.some(c => c.path === '/api/admin/accommodation/participants' && c.search.includes('search=TF100002'))).toBe(true);
  await expect(page.getByRole('cell', { name: /dev@example\.test/ })).toBeVisible();
});

test('super admin can reprice a night and confirm a desk payment', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=accommodation');

  // ── Night pricing ────────────────────────────────────────────────────
  await page.getByRole('button', { name: 'Night pricing' }).click();
  await expect(page.getByRole('cell', { name: 'Night of 24th Oct' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'CLOSED' })).toBeVisible();

  await page.getByRole('row', { name: /Night of 24th Oct/ }).getByRole('button', { name: 'Edit' }).click();
  await page.getByLabel('Price (₹) *').fill('750');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect.poll(() => {
    const put = calls.find(c => c.path === '/api/admin/accommodation/configs' && c.method === 'PUT');
    return (put?.body as { priceInr?: number })?.priceInr;
  }).toBe(750);

  // Closing a night goes to the availability endpoint, not the price one.
  await page.getByRole('row', { name: /Night of 25th Oct/ }).getByRole('button', { name: 'Close' }).click();
  await expect.poll(() => calls.some(c => /\/configs\/2\/availability$/.test(c.path) && c.method === 'PATCH' && (c.body as { isAvailable?: boolean })?.isAvailable === false)).toBe(true);

  // ── Booking ledger ───────────────────────────────────────────────────
  await page.getByRole('button', { name: 'Booking ledger' }).click();
  await expect(page.getByRole('cell', { name: /dev@example\.test/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pending payment' })).toBeVisible();

  await page.getByRole('button', { name: 'Confirm as paid' }).click();
  await expect(page.getByText(/cash or bank transfers taken at the desk/)).toBeVisible();
  await page.getByLabel('Payment reference (optional)').fill('CASH-0012');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect.poll(() => {
    const confirm = calls.find(c => /\/bookings\/12\/confirm$/.test(c.path));
    return (confirm?.body as { razorpayPaymentId?: string })?.razorpayPaymentId;
  }).toBe('CASH-0012');
});

test('event admins cannot reach the accommodation section', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path === '/api/auth/me') data = { user: { id: 'me', role: 'event_admin', allowedEventIds: ['event1'] } };
    else if (path === '/api/admin/dashboard') data = { totals: {}, perEventStats: [{ id: 'event1', name: 'Test Event', club: 'Club', isTeamEvent: false, _count: { registrations: 0, teams: 0, rounds: 0 } }], recentRegistrations: [] };
    await route.fulfill({ json: { success: true, data } });
  });

  await page.goto('/admin/events/event1');
  await expect(page.getByRole('link', { name: 'Accommodation' })).toHaveCount(0);
});

// ── Capacity: 15 beds a night ───────────────────────────────────────────────

/** Serves the nights exactly as given, with no booking of the user's own. */
async function mockNights(page: Page, nights: unknown[]) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path === '/api/auth/me') data = { user };
    else if (path === '/api/user/profile') data = { user, stats: { totalRegisteredEvents: 0, totalTeams: 0, totalQualifiedRounds: 0 }, registeredEvents: [], teams: [], activities: [] };
    else if (path === '/api/user/notifications') data = { notifications: [], unreadCount: 0, page: 1, totalPages: 1 };
    else if (path === '/api/user/meals') data = { meals: [] };
    else if (path === '/api/accommodation/nights') data = nights;
    await route.fulfill({ json: { success: true, data } });
  });
}

const full = (n: typeof NIGHTS[number]) => ({ ...n, booked: n.capacity, remaining: 0, isFull: true, booking: null });

test('a night with every bed taken closes itself and says so', async ({ page }) => {
  await mockNights(page, [full(NIGHTS[0]), { ...NIGHTS[1], booking: null }, { ...NIGHTS[2], booking: null }]);
  await page.goto('/profile?tab=accommodation');
  const section = page.locator('#accommodation');

  // The filled night offers no way to select it.
  await expect(section.getByText('FILLED', { exact: true })).toBeVisible();
  await expect(section.getByText(/Accommodation is filled for this night — all 15 beds are taken/)).toBeVisible();
  await expect(section.getByLabel('Select Night of 24th Oct for ₹500')).toHaveCount(0);

  // The nights that still have beds are unaffected.
  await expect(section.getByLabel('Select Night of 25th Oct for ₹500')).toBeVisible();
  await expect(section.getByLabel('Select Night of 26th Oct for ₹600')).toBeVisible();
});

test('when every night is filled the whole section says accommodation is filled', async ({ page }) => {
  await mockNights(page, NIGHTS.map(full));
  await page.goto('/profile?tab=accommodation');
  const section = page.locator('#accommodation');

  await expect(section.getByText('Filled', { exact: true })).toBeVisible();
  await expect(section.getByText(/Accommodation is filled — every night is fully booked/)).toBeVisible();
  await expect(section.getByRole('checkbox')).toHaveCount(0);
  await expect(section.getByRole('button', { name: /^Pay/ })).toHaveCount(0);
});

test('a bed already held is still payable on a night that is otherwise full', async ({ page }) => {
  // The participant is one of the fifteen, with an unpaid checkout.
  await mockNights(page, [
    { ...full(NIGHTS[0]), isFull: false, booking: { id: 9, status: 'pending_payment', amountPaid: 500, paidAt: null, orderId: 'accom_x' } },
    { ...NIGHTS[1], booking: null },
    { ...NIGHTS[2], booking: null },
  ]);
  await page.goto('/profile?tab=accommodation');
  const section = page.locator('#accommodation');

  // Refusing them would strand the bed being held for them.
  await expect(section.getByText('NOT PAID')).toBeVisible();
  await expect(section.getByLabel('Select Night of 24th Oct for ₹500')).toBeVisible();
  await expect(section.getByText(/Accommodation is filled for this night/)).toHaveCount(0);
});

test('a night running low says how many beds are left', async ({ page }) => {
  await mockNights(page, [
    { ...NIGHTS[0], booked: 13, remaining: 2, isFull: false, booking: null },
    { ...NIGHTS[1], booking: null },
    { ...NIGHTS[2], booking: null },
  ]);
  await page.goto('/profile?tab=accommodation');
  await expect(page.locator('#accommodation').getByText(/only 2 beds left/)).toBeVisible();
});
