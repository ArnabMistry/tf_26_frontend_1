import { test, expect, type Page } from '@playwright/test';
import QRCode from 'qrcode';

const event = { id: 'event1', name: 'Test event', club: 'Coding', isTeamEvent: false, _count: { registrations: 1, teams: 0, rounds: 0 } };
const user = { id: 'u1', firstName: 'Meal', lastName: 'Tester', email: 'mealtester@example.test', festId: 'TF1', collegeName: 'College', phoneNumber: '9876543210', verified: true };
const session = { id: 1, mealId: 1, name: 'Meal 1', typeOfMeal: 'meal', slot: 1, date: '2020-01-01T00:00:00Z', isServingNow: true, events: [event], grantedByEvents: [event], passCode: '1234-5678' };
type State = { claimed: boolean; posts: number; failOnce?: boolean; closed?: boolean; qrFailure?: boolean };

async function mock(page: Page, state: State, role = 'participant', signedIn = true) {
  if (signedIn) await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path === '/api/auth/me') data = { user: { ...user, role, allowedEventIds: ['event1'] } };
    else if (path === '/api/admin/dashboard') data = { totals: {}, perEventStats: [event], recentRegistrations: [] };
    else if (path === '/api/admin/events/event1') data = event;
    else if (path === '/api/admin/meals') data = { meals: [{ ...session, isServingNow: !state.closed, scannedCount: Number(state.claimed) }] };
    else if (path === '/api/admin/meals/1/qr') {
      if (state.qrFailure) return route.fulfill({ status: 503, json: { success: false, error: { message: 'Counter unavailable' } } });
      data = { ...session, isServingNow: !state.closed, claimUrl: 'http://localhost:3100/profile?claimMealToken=counter-1', eligibleEvents: [event], scannedCount: Number(state.claimed), recentClaims: state.claimed ? [{ id: 1, user, scannedAt: new Date().toISOString() }] : [] };
    } else if (path === '/api/user/profile') data = { user, stats: {}, registeredEvents: [], teams: [], activities: [] };
    else if (path === '/api/user/notifications') data = { notifications: [], unreadCount: 0, page: 1, totalPages: 1 };
    else if (path === '/api/user/meals') data = { meals: [{ ...session, status: state.claimed ? 'CLAIMED' : 'AVAILABLE', scannedAt: state.claimed ? new Date().toISOString() : null }] };
    else if (path === '/api/user/meals/claim') {
      state.posts++;
      expect(route.request().postDataJSON()).toEqual({ qrToken: 'counter-1' });
      if (state.failOnce) { state.failOnce = false; return route.fulfill({ status: 503, json: { success: false, error: { message: 'Temporary connection failure' } } }); }
      if (state.claimed) return route.fulfill({ status: 409, json: { success: false, error: { message: 'This meal pass was already claimed.' } } });
      state.claimed = true;
      data = { mealId: 1, typeOfMeal: 'meal' };
    }
    await route.fulfill({ json: { success: true, data } });
  });
}

test('event admin generates QR; participant claim updates both portals without reload', async ({ page, context }) => {
  const state = { claimed: false, posts: 0 };
  await mock(page, state, 'event_admin');
  await page.goto('/admin/events/event1?view=meals');
  await page.getByLabel('Counter session').selectOption('1');
  await page.getByRole('button', { name: 'Generate counter QR' }).click();
  await expect(page.getByRole('img', { name: 'Meal 1 claim QR' })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Claimed: 0' })).toBeVisible();
  const participant = await context.newPage();
  await mock(participant, state);
  await participant.goto('/profile?claimMealToken=counter-1');
  await expect(participant).toHaveURL(/tab=meals/);
  await expect(participant.getByText('CLAIMED', { exact: true })).toBeVisible();
  await page.bringToFront();
  await expect(page.getByRole('status').filter({ hasText: 'Claimed: 1' })).toBeVisible();
  await expect(page.getByText(/Meal Tester · TF1 · Claimed/)).toBeVisible();
  expect(state.posts).toBe(1);
});

test('logged-out scan preserves the QR through login redirect', async ({ page }) => {
  await mock(page, { claimed: false, posts: 0 }, 'participant', false);
  await page.goto('/profile?claimMealToken=counter-1');
  await expect(page).toHaveURL(/\/login\?next=/);
  expect(new URL(page.url()).searchParams.get('next')).toBe('/profile?claimMealToken=counter-1');
});

test('duplicate scan shows already claimed and refreshes persisted pass status', async ({ page }) => {
  const state = { claimed: true, posts: 0 };
  await mock(page, state);
  await page.goto('/profile?tab=meals&claimMealToken=counter-1');
  await expect(page.getByRole('alert').filter({ hasText: 'already claimed' })).toBeVisible();
  await expect(page.getByText('CLAIMED', { exact: true })).toBeVisible();
  expect(state.posts).toBe(1);
});

test('failed claim can be retried without rescanning', async ({ page }) => {
  const state = { claimed: false, posts: 0, failOnce: true };
  await mock(page, state);
  await page.goto('/profile?claimMealToken=counter-1');
  await expect(page.getByText(/Temporary connection failure/)).toBeVisible();
  await page.getByRole('button', { name: 'Retry meal claim' }).click();
  await expect(page.getByText('CLAIMED', { exact: true })).toBeVisible();
  expect(state.posts).toBe(2);
});

test('closed serving window disables QR generation when enforcement is enabled', async ({ page }) => {
  await mock(page, { claimed: false, posts: 0, closed: true }, 'event_admin');
  await page.goto('/admin/events/event1?view=meals');
  await page.getByLabel('Counter session').selectOption('1');
  await expect(page.getByRole('button', { name: 'Generate counter QR' })).toBeDisabled();
});

test('counter API failure is visible and polling recovers', async ({ page }) => {
  const state = { claimed: false, posts: 0, qrFailure: true };
  await mock(page, state, 'event_admin');
  await page.goto('/admin/events/event1?view=meals');
  await page.getByLabel('Counter session').selectOption('1');
  await page.getByRole('button', { name: 'Generate counter QR' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Counter unavailable' })).toBeVisible();
  state.qrFailure = false;
  await expect(page.getByRole('img', { name: 'Meal 1 claim QR' })).toBeVisible();
});

async function cameraFeed(page: Page, content: string, denied = false, delay = 0) {
  const image = await QRCode.toDataURL(content, { width: 400, margin: 4 });
  await page.addInitScript(({ image, denied, delay }) => {
    const tracks: MediaStreamTrack[] = [];
    Object.defineProperty(window, 'mealTestTracks', { value: tracks });
    Object.defineProperty(window, 'mealTestRequests', { value: { count: 0 } });
    navigator.mediaDevices.getUserMedia = async () => {
      (window as unknown as { mealTestRequests: { count: number } }).mealTestRequests.count++;
      if (denied) throw new DOMException('Permission denied', 'NotAllowedError');
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 400;
      const picture = new Image();
      picture.src = image;
      await picture.decode();
      const context = canvas.getContext('2d')!;
      const stream = canvas.captureStream(10);
      tracks.push(...stream.getTracks());
      const timer = setInterval(() => {
        if (stream.getTracks().every(track => track.readyState === 'ended')) { clearInterval(timer); return; }
        context.drawImage(picture, 0, 0);
      }, 100);
      return stream;
    };
  }, { image, denied, delay });
}

test('website camera decodes QR, claims once and releases the camera on mobile', async ({ page }) => {
  const state = { claimed: false, posts: 0 };
  await mock(page, state);
  await cameraFeed(page, 'http://localhost:3100/profile?claimMealToken=counter-1');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/profile?tab=meals');
  await expect(page.locator('video')).toHaveCount(0);
  await page.getByRole('button', { name: 'Scan Counter QR' }).click();
  await expect(page.getByText('CLAIMED', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(state.posts).toBe(1);
  await expect.poll(() => page.evaluate(() => (window as unknown as { mealTestTracks: MediaStreamTrack[] }).mealTestTracks.every(track => track.readyState === 'ended'))).toBe(true);
});

test('camera permission denial is actionable and does not claim a meal', async ({ page }) => {
  const state = { claimed: false, posts: 0 };
  await mock(page, state);
  await cameraFeed(page, 'unused', true);
  await page.goto('/profile?tab=meals');
  await page.getByRole('button', { name: 'Scan Counter QR' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Camera permission was denied' })).toBeVisible();
  await page.getByRole('button', { name: 'Close camera' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(state.posts).toBe(0);
});

test('unrelated QR never navigates or redeems; closing releases video', async ({ page }) => {
  const state = { claimed: false, posts: 0 };
  await mock(page, state);
  await cameraFeed(page, 'https://example.org/unrelated');
  await page.goto('/profile?tab=meals');
  await page.getByRole('button', { name: 'Scan Counter QR' }).click();
  await expect(page.getByText('This is not a meal counter QR.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Close camera' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { mealTestTracks: MediaStreamTrack[] }).mealTestTracks.every(track => track.readyState === 'ended'))).toBe(true);
  expect(state.posts).toBe(0);
  await expect(page).toHaveURL(/\/profile\?tab=meals$/);
});

test('closing while camera permission is pending releases the late stream', async ({ page }) => {
  const state = { claimed: false, posts: 0 };
  await mock(page, state);
  await cameraFeed(page, 'https://example.org/unrelated', false, 1500);
  await page.goto('/profile?tab=meals');
  await page.getByRole('button', { name: 'Scan Counter QR' }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { mealTestRequests: { count: number } }).mealTestRequests.count)).toBe(1);
  await page.getByRole('button', { name: 'Close camera' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => {
    const tracks = (window as unknown as { mealTestTracks: MediaStreamTrack[] }).mealTestTracks;
    return tracks.length > 0 && tracks.every(track => track.readyState === 'ended');
  })).toBe(true);
  expect(state.posts).toBe(0);
});
