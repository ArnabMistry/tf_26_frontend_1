import { test, expect, type Page } from '@playwright/test';

// Yuvaan charged up front. The registration row does not exist until the fee
// is captured, so the committee preferences have to travel with the payment
// order — otherwise the entrant pays, the registration appears, and the admin
// panel shows no preferences against their name.

const user = {
  id: 'u1', firstName: 'Ayush', lastName: 'K', email: 'ayush@iiitn.ac.in',
  festId: 'TF200001', collegeName: 'IIIT Nagpur', phoneNumber: '9876543210', verified: true,
};

const yuvaanPaidUpfront = {
  id: 'tf26_yuvaan', slug: 'yuvaan', name: 'Yuvaan: Youth Conclave', club: 'Yuvaan',
  description: '', venue: '', price: 300, isPaid: true, isTeamEvent: false,
  feeMode: 'per_team', paymentTrigger: 'before_registration', paymentRound: 'ROUND_1',
  registrationEndTime: '2026-10-24T18:29:00Z',
  _count: { registrations: 3, teams: 0, rounds: 0 },
};

/** How a paid-up Yuvaan registration comes back from the server. */
const storedRegistration = {
  id: 101, eventId: yuvaanPaidUpfront.id, userId: user.id, teamId: null,
  status: 'registered', event: yuvaanPaidUpfront, roundProgress: [],
  payment: { trigger: 'before_registration', round: 'ROUND_1', amount: 300, paid: true, pending: false, dueNow: false, rejected: false, roundNumber: null, roundName: null },
  // The numbered shape the backend actually stores and the admin panel reads.
  metadata: {
    committeePreference1: 'Human Development', motionPreference1: 'For',
    committeePreference2: 'Press', motionPreference2: 'Against',
    committeePreference3: 'Civic laws and policies', motionPreference3: 'For',
    schoolCollege: 'IIIT Nagpur', classYear: '3rd Year',
  },
};

async function mockPaidYuvaan(page: Page, { registered = false } = {}) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.addInitScript(() => {
    class FakeRazorpay {
      options: Record<string, unknown>;
      constructor(options: Record<string, unknown>) { this.options = options; }
      on() {}
      open() {
        const handler = this.options.handler as (r: unknown) => void;
        handler({ razorpay_payment_id: 'pay_stub_1', razorpay_order_id: this.options.order_id, razorpay_signature: 'sig_stub' });
      }
    }
    (window as unknown as { Razorpay: unknown }).Razorpay = FakeRazorpay;
  });

  let isRegistered = registered;
  const calls: { path: string; body: Record<string, unknown> | null }[] = [];

  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const method = route.request().method();
    let body: Record<string, unknown> | null = null;
    try { body = route.request().postDataJSON() as Record<string, unknown>; } catch { /* GET */ }
    calls.push({ path, body });

    let data: unknown = {};
    if (path === '/api/auth/me') {
      data = { user };
    } else if (path === '/api/user/profile') {
      data = { user, stats: {}, registeredEvents: [], teams: [], activities: [] };
    } else if (path === '/api/user/notifications') {
      data = { notifications: [], unreadCount: 0, totalPages: 1, page: 1 };
    } else if (path === '/api/user/teams/my') {
      data = { teams: [] };
    } else if (path === '/api/payments/orders' && method === 'POST') {
      data = { orderId: 'checkout_1', razorpayOrderId: 'order_stub', amountInPaise: 30000, keyId: 'rzp_test', currency: 'INR' };
    } else if (path === '/api/payments/orders/verify') {
      isRegistered = true;
      data = { registrationId: 101, status: 'registered' };
    } else if (path === '/api/user/registrations') {
      data = { registrations: isRegistered ? [storedRegistration] : [] };
    } else if (path.startsWith('/api/events/')) {
      data = yuvaanPaidUpfront;
    }
    await route.fulfill({ json: { success: true, data } });
  });

  return {
    orderPayload: () => calls.filter(c => c.path === '/api/payments/orders').at(-1)?.body ?? null,
    registrationPosts: () => calls.filter(c => c.path === '/api/user/registrations' && c.body),
  };
}

test.describe('Yuvaan charged before registration', () => {
  test('the committee preferences are sent with the payment order', async ({ page }) => {
    const fixture = await mockPaidYuvaan(page);
    await page.goto('/register/event?eventId=yuvaan');

    await page.locator('#yuvaan-pref-1-committee').selectOption('Human Development');
    await page.locator('#yuvaan-pref-1-motion-for').check();
    await page.locator('#yuvaan-pref-2-committee').selectOption('Press');
    await page.locator('#yuvaan-pref-2-motion-against').check();
    await page.locator('#yuvaan-pref-3-committee').selectOption('Civic laws and policies');
    await page.locator('#yuvaan-pref-3-motion-for').check();
    await page.locator('#yuvaan-school-college').fill('IIIT Nagpur');
    await page.locator('#yuvaan-class-year').fill('3rd Year');

    await page.getByRole('button', { name: /Pay ₹300 & Register/ }).click();
    await expect(page.getByText('You’re on the list.')).toBeVisible();

    // The order is the only record that spans paying and being registered.
    expect(fixture.orderPayload()).toEqual({
      eventId: 'tf26_yuvaan',
      addons: {
        preferences: [
          { committee: 'Human Development', motion: 'For' },
          { committee: 'Press', motion: 'Against' },
          { committee: 'Civic laws and policies', motion: 'For' },
        ],
        schoolCollege: 'IIIT Nagpur',
        classYear: '3rd Year',
      },
    });
    // Paying is what registers on this trigger; a direct registration call
    // would be rejected by the backend as unpaid.
    expect(fixture.registrationPosts()).toHaveLength(0);
  });

  test('stored answers are shown back to a registered entrant', async ({ page }) => {
    await mockPaidYuvaan(page, { registered: true });
    await page.goto('/register/event?eventId=yuvaan');

    // Read from committeePreference1..3 — the shape the server stores. Read
    // only as a `preferences` array, this panel showed "1st Preference" and
    // "Pending" to someone who had answered.
    const summary = page.getByText('Registered Delegate Preferences').locator('..');
    await expect(summary.getByText('Human Development')).toBeVisible();
    await expect(summary.getByText('Press')).toBeVisible();
    await expect(summary.getByText('Civic laws and policies')).toBeVisible();
    await expect(summary.getByText('Motion: Against')).toBeVisible();
    await expect(summary.getByText('IIIT Nagpur · 3rd Year')).toBeVisible();
  });
});
