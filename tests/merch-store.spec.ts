import { test, expect, type Page } from '@playwright/test';

const user = { id: 'person-1', firstName: 'Vinay', lastName: 'Kumar', email: 'vinay@example.test', role: 'participant', festId: 'TF123456', collegeName: 'IIIT Nagpur', phoneNumber: '9876543210', verified: true, allowedEventIds: [] };

type Purchase = { id: number; itemId: number; size: string | null; quantity: number; amountPaid: number; paidAt: string | null };

/** The sizes the drop actually ships in. */
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const BLACK = { colorway: 'Midnight Black', colorHex: '#101014' };
const WHITE = { colorway: 'Off White', colorHex: '#f4f1ea' };

/**
 * Mirrors the seeded catalogue: four tees, two black and two white.
 *
 * The signature pair is marked down from 699 and carries both product shots,
 * as the seed sets them; the glitch pair is left undiscounted and photoless so
 * the same run also covers a card with no "was" price and no view toggle.
 * The figures themselves are the fixture's own — the basket arithmetic below
 * is checked against them, not against whatever the drop is priced at today.
 */
const ITEMS = [
  { id: 1, slug: 'tf-26-signature-tee-black', name: 'TF 26 Signature Tee — Black', tagline: 'The flagship drop', description: '240 GSM combed cotton.', priceInr: 599, mrpInr: 699, imageUrl: '/merch/black_front1.webp', imageBackUrl: '/merch/black_back1.webp', ...BLACK, sizes: SIZES, isAvailable: true, stockRemaining: null, soldOut: false },
  { id: 2, slug: 'tf-26-glitch-tee-black', name: 'TF 26 Glitch Tee — Black', tagline: 'Static and neon', description: null, priceInr: 649, mrpInr: null, imageUrl: null, imageBackUrl: null, ...BLACK, sizes: SIZES, isAvailable: true, stockRemaining: 3, soldOut: false },
  { id: 3, slug: 'tf-26-signature-tee-white', name: 'TF 26 Signature Tee — White', tagline: 'The flagship drop', description: null, priceInr: 599, mrpInr: 699, imageUrl: '/merch/white_front1.webp', imageBackUrl: '/merch/white_back1.webp', ...WHITE, sizes: SIZES, isAvailable: true, stockRemaining: null, soldOut: false },
  { id: 4, slug: 'tf-26-glitch-tee-white', name: 'TF 26 Glitch Tee — White', tagline: 'Static and neon', description: null, priceInr: 649, mrpInr: null, imageUrl: null, imageBackUrl: null, ...WHITE, sizes: SIZES, isAvailable: true, stockRemaining: 0, soldOut: true },
];

/**
 * Stands in for the backend and for Razorpay Checkout, which cannot be driven
 * from a test. `window.Razorpay` is replaced with a stub that immediately
 * calls the success handler, so everything either side of the gateway — the
 * basket, the order request, and the verify call that actually confirms the
 * purchase — is exercised for real.
 *
 * Mirrors tests/accommodation.spec.ts.
 */
async function mockStore(page: Page, { signedIn = true, profile = user, owned = [] as Purchase[] } = {}) {
  if (signedIn) await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
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

  const bought: Purchase[] = [...owned];
  const calls: { path: string; body: unknown; method: string }[] = [];

  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const method = route.request().method();
    let body: unknown = null;
    try { body = route.request().postDataJSON(); } catch { /* GET */ }
    calls.push({ path, body, method });

    let data: unknown = {};
    if (path === '/api/auth/me') {
      if (!signedIn) return route.fulfill({ status: 401, json: { success: false, error: { message: 'Authentication required' } } });
      data = { user: profile };
    } else if (path === '/api/merch/items') {
      data = ITEMS.map(i => ({ ...i, purchases: bought.filter(p => p.itemId === i.id) }));
    } else if (path === '/api/merch/pay' && method === 'POST') {
      const lines = (body as { items: { itemId: number; size: string | null; quantity: number }[] }).items;
      const priced = lines.map(l => {
        const item = ITEMS.find(i => i.id === l.itemId)!;
        return { itemId: item.id, name: item.name, size: l.size, quantity: l.quantity, unitPriceInr: item.priceInr, amount: item.priceInr * l.quantity };
      });
      const amount = priced.reduce((s, l) => s + l.amount, 0);
      data = { orderId: 'merch_stub', razorpayOrderId: 'order_stub', amount, amountInPaise: amount * 100, currency: 'INR', keyId: 'rzp_test_stub', items: priced };
    } else if (path === '/api/merch/pay/verify' && method === 'POST') {
      // Only now does anything become bought — exactly as the backend does it.
      const ordered = (calls.find(c => c.path === '/api/merch/pay')?.body as { items: { itemId: number; size: string | null; quantity: number }[] }).items;
      let id = 100;
      const confirmed = ordered.map(l => {
        const item = ITEMS.find(i => i.id === l.itemId)!;
        return { id: ++id, itemId: item.id, name: item.name, size: l.size, quantity: l.quantity, amountPaid: item.priceInr * l.quantity, paidAt: '2026-10-17T06:00:00Z', status: 'confirmed' };
      });
      bought.push(...confirmed);
      data = {
        orderId: 'merch_stub', status: 'SUCCESS',
        amount: confirmed.reduce((s, l) => s + l.amountPaid, 0),
        paidAt: '2026-10-17T06:00:00Z',
        items: confirmed.map(l => ({ purchaseId: l.id, name: l.name, size: l.size, quantity: l.quantity, status: 'confirmed', amount: l.amountPaid })),
      };
    }
    await route.fulfill({ json: { success: true, data } });
  });

  return { calls };
}

const card = (page: Page, name: string) => page.locator('article').filter({ hasText: name });

const SIG_BLACK = 'TF 26 Signature Tee — Black';
const GLITCH_BLACK = 'TF 26 Glitch Tee — Black';
const SIG_WHITE = 'TF 26 Signature Tee — White';
const GLITCH_WHITE = 'TF 26 Glitch Tee — White';

// ── The store page ──────────────────────────────────────────────────────────

test('the store is reachable at /merch but linked from no navigation', async ({ page }) => {
  await mockStore(page, { signedIn: false });
  await page.goto('/merch');
  await expect(page.getByRole('heading', { name: 'TF 26 MERCH', level: 1 })).toBeVisible();
  // Unlisted on purpose: it is shared by URL, not surfaced in the nav.
  await expect(page.locator('a[href="/merch"]')).toHaveCount(0);
});

test('all four tees are shown with their price, colour and full size range', async ({ page }) => {
  await mockStore(page, { signedIn: false });
  await page.goto('/merch');

  for (const item of ITEMS) {
    const article = card(page, item.name);
    await expect(page.getByRole('heading', { name: item.name, level: 2 })).toBeVisible();
    await expect(article.getByText(`₹${item.priceInr}`, { exact: true }).first()).toBeVisible();
    await expect(article.getByText(item.colorway, { exact: true })).toBeVisible();
    // XS through XXXL, every one of them offered.
    for (const size of SIZES) {
      await expect(article.getByRole('button', { name: size, exact: true })).toBeVisible();
    }
  }

  // A tee with no photography still draws in its own colour rather than
  // sharing one placeholder with the rest of the drop.
  await expect(page.getByRole('img', { name: `${GLITCH_BLACK} t-shirt` })).toBeVisible();
  await expect(page.getByRole('img', { name: `${GLITCH_WHITE} t-shirt` })).toBeVisible();

  await expect(page.getByRole('link', { name: /log in or sign up/i })).toBeVisible();
});

test('a photographed tee opens on its back and can be flipped to its front', async ({ page }) => {
  await mockStore(page, { signedIn: false });
  await page.goto('/merch');

  const article = card(page, SIG_BLACK);
  const views = article.getByRole('group', { name: `Views of ${SIG_BLACK}` });
  const front = article.locator('img[src="/merch/black_front1.webp"]');
  const back = article.locator('img[src="/merch/black_back1.webp"]');

  // Both shots are present from the start — the card opens on the back and
  // cross-fades, rather than fetching the front on the first click.
  await expect(back).toHaveCSS('opacity', '1');
  await expect(front).toHaveCSS('opacity', '0');
  await expect(views.getByRole('button', { name: 'Back' })).toHaveAttribute('aria-pressed', 'true');

  await views.getByRole('button', { name: 'Front' }).click();

  await expect(front).toHaveCSS('opacity', '1');
  await expect(back).toHaveCSS('opacity', '0');
  await expect(views.getByRole('button', { name: 'Front' })).toHaveAttribute('aria-pressed', 'true');
  await expect(views.getByRole('button', { name: 'Back' })).toHaveAttribute('aria-pressed', 'false');

  // Flipping one card leaves the rest of the drop as it was.
  await expect(card(page, SIG_WHITE).locator('img[src="/merch/white_back1.webp"]')).toHaveCSS('opacity', '1');

  // A tee with no photography has nothing to flip to, so it offers no toggle.
  await expect(card(page, GLITCH_BLACK).getByRole('group', { name: `Views of ${GLITCH_BLACK}` })).toHaveCount(0);
});

test('a marked-down tee shows what it costs beside what it used to', async ({ page }) => {
  await mockStore(page, { signedIn: false });
  await page.goto('/merch');

  const article = card(page, SIG_BLACK);
  // The price charged is the plain one; the old price is struck through, and
  // the basket and the Add button both quote the price actually charged.
  await expect(article.getByText('₹599', { exact: true })).toBeVisible();
  await expect(article.locator('s')).toHaveText('Reduced from ₹699');
  await expect(article.getByRole('button', { name: 'Add to order — ₹599' })).toBeVisible();

  // An undiscounted tee strikes nothing through at all.
  await expect(card(page, GLITCH_BLACK).locator('s')).toHaveCount(0);
});

test('the colour filter narrows the drop to black or to white', async ({ page }) => {
  await mockStore(page);
  await page.goto('/merch');

  const filters = page.getByRole('group', { name: 'Filter by colour' });
  await expect(filters.getByRole('button', { name: 'All (4)' })).toBeVisible();

  await filters.getByRole('button', { name: /Midnight Black \(2\)/ }).click();
  await expect(page.getByRole('heading', { name: SIG_BLACK, level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: GLITCH_BLACK, level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: SIG_WHITE, level: 2 })).toHaveCount(0);

  await filters.getByRole('button', { name: /Off White \(2\)/ }).click();
  await expect(page.getByRole('heading', { name: SIG_WHITE, level: 2 })).toBeVisible();
  await expect(page.getByRole('heading', { name: SIG_BLACK, level: 2 })).toHaveCount(0);

  // Clicking the active colour again clears the filter.
  await filters.getByRole('button', { name: /Off White \(2\)/ }).click();
  await expect(page.getByRole('heading', { name: SIG_BLACK, level: 2 })).toBeVisible();
});

test('filtering by colour never drops anything already in the basket', async ({ page }) => {
  await mockStore(page);
  await page.goto('/merch');

  await card(page, SIG_BLACK).getByRole('button', { name: /add to order/i }).click();
  const basket = page.getByRole('region', { name: 'Your merch order' });
  await expect(basket.getByText('₹599', { exact: true })).toBeVisible();

  // The black tee is hidden by the filter, but it is still being paid for.
  await page.getByRole('group', { name: 'Filter by colour' }).getByRole('button', { name: /Off White/ }).click();
  await expect(page.getByRole('heading', { name: SIG_BLACK, level: 2 })).toHaveCount(0);
  await expect(basket.getByText('₹599', { exact: true })).toBeVisible();
  await expect(basket.getByText('1 item in your order')).toBeVisible();
});

test('a logged-out visitor can build a basket but is asked to log in to pay', async ({ page }) => {
  await mockStore(page, { signedIn: false });
  await page.goto('/merch');

  await card(page, SIG_BLACK).getByRole('button', { name: /add to order/i }).click();
  const basket = page.getByRole('region', { name: 'Your merch order' });
  await expect(basket.getByRole('link', { name: /log in to pay/i })).toBeVisible();
  await expect(basket.getByRole('button', { name: /^Pay/ })).toHaveCount(0);
});

test('sizes and quantities drive the running total', async ({ page }) => {
  await mockStore(page);
  await page.goto('/merch');

  const tee = card(page, SIG_BLACK);
  // The first size is pre-selected so a one-click add is never size-less.
  await expect(tee.getByRole('button', { name: 'XS', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await tee.getByRole('button', { name: 'XXXL', exact: true }).click();
  await expect(tee.getByRole('button', { name: 'XXXL', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await tee.getByRole('button', { name: /add to order/i }).click();
  const basket = page.getByRole('region', { name: 'Your merch order' });
  await expect(basket.getByText('₹599', { exact: true })).toBeVisible();
  await expect(basket.getByText('1 item in your order')).toBeVisible();
  // The card echoes back which size is being bought.
  await expect(tee.getByText('In your order · XXXL')).toBeVisible();

  await tee.getByRole('button', { name: /add another/i }).click();
  await expect(basket.getByText('₹1198', { exact: true })).toBeVisible();
  await expect(basket.getByText('2 items in your order')).toBeVisible();

  // A different product adds a separate line to the same basket.
  await card(page, GLITCH_BLACK).getByRole('button', { name: /add to order/i }).click();
  await expect(basket.getByText('₹1847', { exact: true })).toBeVisible();
  await expect(basket.getByText('3 items in your order')).toBeVisible();

  // Removing works back down, and clearing hides the bar.
  await tee.getByRole('button', { name: /remove one/i }).click();
  await expect(basket.getByText('₹1248', { exact: true })).toBeVisible();
  await basket.getByRole('button', { name: 'Clear' }).click();
  await expect(basket).toHaveCount(0);
});

test('a sold-out item cannot be added', async ({ page }) => {
  await mockStore(page);
  await page.goto('/merch');
  const sold = card(page, GLITCH_WHITE);
  await expect(sold.getByRole('button', { name: 'Sold out' })).toBeDisabled();
  // Shown twice by design: the corner ribbon and the disabled button.
  await expect(sold.getByText('Sold out', { exact: true }).first()).toBeVisible();
  await expect(sold.getByRole('button', { name: /add to order/i })).toHaveCount(0);
});

test('low stock is called out on the card', async ({ page }) => {
  await mockStore(page);
  await page.goto('/merch');
  await expect(card(page, GLITCH_BLACK).getByText('3 left')).toBeVisible();
});

// ── Payment ─────────────────────────────────────────────────────────────────

test('a signed-in participant pays for the whole basket in one checkout', async ({ page }) => {
  const { calls } = await mockStore(page);
  await page.goto('/merch');

  const black = card(page, SIG_BLACK);
  await black.getByRole('button', { name: 'M', exact: true }).click();
  await black.getByRole('button', { name: /add to order/i }).click();
  await black.getByRole('button', { name: /add another/i }).click();

  const white = card(page, SIG_WHITE);
  await white.getByRole('button', { name: 'L', exact: true }).click();
  await white.getByRole('button', { name: /add to order/i }).click();

  const basket = page.getByRole('region', { name: 'Your merch order' });
  await basket.getByRole('button', { name: 'Pay ₹1797' }).click();

  // Confirmed only after the verify round-trip.
  await expect(page.getByText(/Payment confirmed/)).toBeVisible();
  await expect(page.getByText(/Collect it from the merch desk/).first()).toBeVisible();

  // One order, for exactly what was picked, and the gateway opened for it.
  const orders = calls.filter(c => c.path === '/api/merch/pay');
  expect(orders).toHaveLength(1);
  expect((orders[0].body as { items: { itemId: number; size: string | null; quantity: number }[] }).items).toEqual([
    { itemId: 1, size: 'M', quantity: 2 },
    { itemId: 3, size: 'L', quantity: 1 },
  ]);
  expect(await page.evaluate(() => (window as unknown as { __rzp: { amount: number } }).__rzp.amount)).toBe(179700);
  expect(calls.filter(c => c.path === '/api/merch/pay/verify')).toHaveLength(1);

  // The basket empties and the store reloads showing what is now owned.
  await expect(basket).toHaveCount(0);
  await expect(black.getByText('Yours ×2')).toBeVisible();
  await expect(black.getByText(/You have already bought 2/)).toBeVisible();
});

test('the same tee in two sizes is billed as two lines', async ({ page }) => {
  const { calls } = await mockStore(page);
  await page.goto('/merch');

  const tee = card(page, SIG_BLACK);
  await tee.getByRole('button', { name: 'S', exact: true }).click();
  await tee.getByRole('button', { name: /add to order/i }).click();
  // Switching size exposes a fresh Add for that size rather than growing the
  // first line — which is the whole point of sizing a garment order.
  await tee.getByRole('button', { name: 'XL', exact: true }).click();
  await tee.getByRole('button', { name: /add to order/i }).click();

  const basket = page.getByRole('region', { name: 'Your merch order' });
  await expect(basket.getByText('₹1198', { exact: true })).toBeVisible();
  await basket.getByRole('button', { name: 'Pay ₹1198' }).click();
  await expect(page.getByText(/Payment confirmed/)).toBeVisible();

  expect((calls.find(c => c.path === '/api/merch/pay')?.body as { items: unknown[] }).items).toEqual([
    { itemId: 1, size: 'S', quantity: 1 },
    { itemId: 1, size: 'XL', quantity: 1 },
  ]);
});

test('closing the gateway without paying leaves the basket intact and buys nothing', async ({ page }) => {
  const { calls } = await mockStore(page);
  // A Checkout that is dismissed instead of paid.
  await page.addInitScript(() => {
    class DismissingRazorpay {
      options: Record<string, unknown>;
      constructor(options: Record<string, unknown>) { this.options = options; }
      on() {}
      open() { (this.options.modal as { ondismiss: () => void }).ondismiss(); }
    }
    (window as unknown as { Razorpay: unknown }).Razorpay = DismissingRazorpay;
  });

  await page.goto('/merch');
  await card(page, SIG_BLACK).getByRole('button', { name: /add to order/i }).click();
  const basket = page.getByRole('region', { name: 'Your merch order' });
  await basket.getByRole('button', { name: 'Pay ₹599' }).click();

  await expect(basket.getByRole('button', { name: 'Pay ₹599' })).toBeEnabled();
  expect(calls.filter(c => c.path === '/api/merch/pay/verify')).toHaveLength(0);
  await expect(page.getByText(/Payment confirmed/)).toHaveCount(0);
});

test('an incomplete profile is told to finish it before paying', async ({ page }) => {
  await mockStore(page, { profile: { ...user, collegeName: null as unknown as string, phoneNumber: null as unknown as string } });
  await page.goto('/merch');

  await expect(page.getByText(/Add your college name and phone number/)).toBeVisible();
  await card(page, SIG_BLACK).getByRole('button', { name: /complete profile to pay/i }).click();
  await expect(page.getByRole('region', { name: 'Your merch order' }).getByRole('button', { name: 'Pay ₹599' })).toBeDisabled();
});

test('what the participant already owns is shown on the card', async ({ page }) => {
  await mockStore(page, {
    owned: [{ id: 1, itemId: 1, size: 'M', quantity: 1, amountPaid: 599, paidAt: '2026-10-17T06:00:00Z' }],
  });
  await page.goto('/merch');
  const tee = card(page, SIG_BLACK);
  await expect(tee.getByText('Yours ×1')).toBeVisible();
  await expect(tee.getByText(/You have already bought 1 \(M\)/)).toBeVisible();
  // Still buyable — a second one in another size is a legitimate order.
  await expect(tee.getByRole('button', { name: /add to order/i })).toBeEnabled();
});

// ── Super admin ─────────────────────────────────────────────────────────────

const BUYERS = [
  { id: 'u1', firstName: 'Asha', lastName: 'Rao', email: 'asha@example.test', festId: 'TF100001', collegeName: 'MANIT', phoneNumber: '9000000001', hasPaid: true, totalPaid: 1198, totalUnits: 2,
    toCollect: [{ id: 11, itemId: 1, name: SIG_BLACK, size: 'M', quantity: 2, unitPriceInr: 599, amountPaid: 1198, status: 'confirmed', paidAt: '2026-10-17T06:00:00Z', fulfilledAt: null, razorpayPaymentId: 'pay_1' }],
    // A paid line and an abandoned one, so the Items column has something to
    // leave out on the default view.
    purchases: [
      { id: 11, itemId: 1, name: SIG_BLACK, size: 'M', quantity: 2, unitPriceInr: 599, amountPaid: 1198, status: 'confirmed', paidAt: '2026-10-17T06:00:00Z', fulfilledAt: null, razorpayPaymentId: 'pay_1' },
      { id: 13, itemId: 3, name: SIG_WHITE, size: 'XXXL', quantity: 1, unitPriceInr: 599, amountPaid: 599, status: 'pending_payment', paidAt: null, fulfilledAt: null, razorpayPaymentId: null },
    ] },
  { id: 'u2', firstName: 'Dev', lastName: 'Patel', email: 'dev@example.test', festId: 'TF100002', collegeName: 'IIIT', phoneNumber: '9000000002', hasPaid: false, totalPaid: 0, totalUnits: 0,
    toCollect: [],
    purchases: [{ id: 12, itemId: 2, name: GLITCH_BLACK, size: 'L', quantity: 1, unitPriceInr: 649, amountPaid: 649, status: 'pending_payment', paidAt: null, fulfilledAt: null, razorpayPaymentId: null }] },
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
    else if (path === '/api/admin/dashboard') data = { totals: { events: 0, registrations: 0, teams: 0, users: 2 }, perEventStats: [], recentRegistrations: [] };
    else if (path === '/api/admin/merch/summary') {
      data = {
        perItem: ITEMS.map(i => ({ itemId: i.id, name: i.name, slug: i.slug, priceInr: i.priceInr, isAvailable: !i.soldOut, sizes: i.sizes, stockLimit: i.stockRemaining == null ? null : 5, stockRemaining: i.stockRemaining, soldUnits: i.id === 1 ? 2 : 0, pendingUnits: i.id === 2 ? 1 : 0, revenueInr: i.id === 1 ? 1198 : 0 })),
        sizeBreakdown: [{ itemId: 1, name: SIG_BLACK, size: 'M', units: 2 }],
        totals: { paidBuyers: 1, pendingBuyers: 1, unitsSold: 2, awaitingCollection: 2, revenueInr: 1198 },
      };
    } else if (path === '/api/admin/merch/items') {
      data = ITEMS.map(i => ({ ...i, isAvailable: !i.soldOut, stockLimit: null, sortOrder: i.id }));
    } else if (path === '/api/admin/merch/buyers') {
      const search = url.searchParams.get('search');
      const list = search ? BUYERS.filter(b => b.email.includes(search) || b.festId.includes(search)) : BUYERS;
      data = { total: list.length, page: 1, limit: 50, totalPages: 1, buyers: list };
    } else if (path === '/api/admin/merch/purchases') {
      data = {
        total: 1, page: 1, limit: 50, totalPages: 1,
        purchases: [{ id: 12, size: 'L', quantity: 1, amountPaid: 649, status: 'pending_payment', createdAt: '2026-10-17T05:00:00Z', paidAt: null, fulfilledAt: null, razorpayPaymentId: null, user: BUYERS[1], item: { id: 2, name: GLITCH_BLACK, slug: 'tf-26-glitch-tee-black', priceInr: 649 }, order: null }],
      };
    }
    await route.fulfill({ json: { success: true, data } });
  });

  return { calls };
}

test('the Merch store tab exists for a super admin and lists who has paid', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=merch');

  await expect(page.getByRole('heading', { name: 'Merch store', exact: true })).toBeVisible();

  // Headline numbers.
  await expect(page.locator('.admin-stats article').filter({ hasText: 'Revenue' }).getByText('₹1198')).toBeVisible();
  await expect(page.locator('.admin-stats article').filter({ hasText: 'Units sold' }).getByText('2')).toBeVisible();

  // The per-person answer: has this participant paid, and for what?
  await expect(page.getByRole('cell', { name: /asha@example\.test/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'PAID', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'UNPAID', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: `2x ${SIG_BLACK} (M)`, exact: true })).toBeVisible();

  // Searching passes the term through to the backend.
  await page.getByLabel('Name, email or Fest ID').fill('TF100002');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect.poll(() => calls.some(c => c.path === '/api/admin/merch/buyers' && c.search.includes('search=TF100002'))).toBe(true);
});

test('the buyer list shows only what was actually purchased', async ({ page }) => {
  await mockAdmin(page);
  await page.goto('/admin/super?view=merch');

  // The Items column, by position: Buyer | Fest ID | Paid | Items | To collect | Total.
  const items = page.getByRole('row').filter({ hasText: 'asha@example.test' }).getByRole('cell').nth(3);

  // Default view is "Paid buyers only", so an abandoned checkout is not listed
  // among a buyer's items — the desk hands over purchases, not attempts.
  await expect(items).toHaveText(`2x ${SIG_BLACK} (M)`);
  await expect(items.getByText(`1x ${SIG_WHITE} (XXXL)`)).toHaveCount(0);
  await expect(items.getByText('awaiting payment')).toHaveCount(0);

  // Switching to the unpaid view shows the other side of the same data.
  await page.getByLabel('Status').selectOption('pending_payment');
  await expect(items).toHaveText(`1x ${SIG_WHITE} (XXXL)`);

  // Only "Everyone" mixes the two, and then each line says which it is.
  await page.getByLabel('Status').selectOption('all');
  await expect(items).toContainText(`2x ${SIG_BLACK} (M) — paid`);
  await expect(items).toContainText(`1x ${SIG_WHITE} (XXXL) — awaiting payment`);
});

test('a super admin renames an item straight from the table', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=merch');
  await page.getByRole('button', { name: 'Items & pricing' }).click();

  const field = page.getByLabel(`Name of ${SIG_BLACK}`);
  await expect(field).toHaveValue(SIG_BLACK);

  // Save and Undo appear only once the value is actually dirty.
  const row = page.getByRole('row').filter({ has: field });
  await expect(row.getByRole('button', { name: 'Save' })).toHaveCount(0);

  await field.fill('TF 26 Classic Tee — Black');
  await expect(row.getByRole('button', { name: 'Save' })).toBeVisible();
  await field.press('Enter');

  // A rename PATCHes just the name — never the whole record, which would
  // blank every field the request did not carry.
  await expect.poll(() => {
    const patch = calls.find(c => c.path === '/api/admin/merch/items/1' && c.method === 'PATCH');
    return patch?.body;
  }).toEqual({ name: 'TF 26 Classic Tee — Black' });
});

test('a super admin changes a price straight from the table', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=merch');
  await page.getByRole('button', { name: 'Items & pricing' }).click();

  const field = page.getByLabel(`Price of ${SIG_BLACK}`);
  await expect(field).toHaveValue('599');

  await field.fill('749');
  await page.getByRole('row').filter({ has: field }).getByRole('button', { name: 'Save' }).click();

  await expect.poll(() => {
    const patch = calls.find(c => c.path === '/api/admin/merch/items/1' && c.method === 'PATCH');
    return patch?.body;
  }).toEqual({ priceInr: '749' });
});

test('an edit in the table can be abandoned without saving', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=merch');
  await page.getByRole('button', { name: 'Items & pricing' }).click();

  const field = page.getByLabel(`Price of ${SIG_BLACK}`);
  await field.fill('1');
  await page.getByRole('row').filter({ has: field }).getByRole('button', { name: 'Undo' }).click();

  await expect(field).toHaveValue('599');
  expect(calls.filter(c => c.path === '/api/admin/merch/items/1' && c.method === 'PATCH')).toHaveLength(0);
});

test('a super admin can edit the rest of an item and take it off sale', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=merch');

  await page.getByRole('button', { name: 'Items & pricing' }).click();
  await expect(page.getByRole('cell', { name: 'OFF SALE', exact: true })).toBeVisible();

  // The full editor still carries the slug that identifies the row.
  await page.getByRole('row').filter({ has: page.getByLabel(`Name of ${SIG_BLACK}`) }).getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByLabel(/Colour name shown to buyers/)).toHaveValue('Midnight Black');
  await page.getByLabel(/Sizes, comma separated/).fill('XS, S, M, L, XL, XXL, XXXL');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect.poll(() => {
    const put = calls.find(c => c.path === '/api/admin/merch/items' && c.method === 'PUT');
    return (put?.body as { slug?: string })?.slug;
  }).toBe('tf-26-signature-tee-black');

  // Taking an item off sale goes to the availability endpoint, not the price one.
  await page.getByRole('row').filter({ has: page.getByLabel(`Name of ${GLITCH_BLACK}`) }).getByRole('button', { name: 'Take off sale' }).click();
  await expect.poll(() => calls.some(c => /\/merch\/items\/2\/availability$/.test(c.path) && c.method === 'PATCH' && (c.body as { isAvailable?: boolean })?.isAvailable === false)).toBe(true);

  // Sizes sold — what to send the printer.
  await expect(page.getByRole('cell', { name: 'M', exact: true })).toBeVisible();
});

test('a super admin can confirm a desk payment and hand merch over', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await page.goto('/admin/super?view=merch');

  // Hand-over, straight from the buyer list.
  await page.getByRole('button', { name: 'Hand over' }).first().click();
  await expect.poll(() => calls.some(c => /\/purchases\/11\/fulfil$/.test(c.path) && (c.body as { fulfilled?: boolean })?.fulfilled === true)).toBe(true);

  // A cash payment taken at the desk, from the ledger.
  await page.getByRole('button', { name: 'Order ledger' }).click();
  await expect(page.getByRole('cell', { name: /dev@example\.test/ })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pending payment' })).toBeVisible();

  await page.getByRole('button', { name: 'Confirm as paid' }).click();
  await expect(page.getByText(/cash or bank transfers taken at the desk/)).toBeVisible();
  await page.getByLabel('Payment reference (optional)').fill('CASH-0012');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect.poll(() => calls.some(c => /\/purchases\/12\/confirm$/.test(c.path) && (c.body as { razorpayPaymentId?: string })?.razorpayPaymentId === 'CASH-0012')).toBe(true);

  // Cancelling a paid order warns that it is not a refund.
  await page.getByRole('button', { name: 'Cancel' }).first().click();
  await expect(page.getByText(/Releases this unpaid order line/)).toBeVisible();
});
