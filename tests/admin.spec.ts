import { test, expect, type Page } from '@playwright/test';

const event = { id: 'event1', name: 'Test Hackathon', club: 'Coding Club', description: 'Build something great.', venue: 'Auditorium', price: 0, isTeamEvent: false, isPaid: false, paymentTrigger: 'free', paymentRound: 'ROUND_1', registrationEndTime: '2026-10-14T18:30:00Z', _count: { registrations: 2, teams: 0, rounds: 1 } };
async function mockApi(page: Page, role = 'super', authenticated = true) {
  if (authenticated) await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url()); const path = url.pathname;
    let data: unknown = {};
    if (path === '/api/auth/me') data = { user: { id: 'me', role, allowedEventIds: role === 'super' ? null : ['event1'] } };
    else if (path === '/api/user/profile') data = { user: { id: 'me', firstName: 'Test', lastName: 'Participant', email: 'participant@example.test', festId: 'TF123456', verified: true, collegeName: 'College', phoneNumber: '9876543210' }, stats: { totalRegisteredEvents: 0, totalTeams: 0, totalQualifiedRounds: 0 }, registeredEvents: [], teams: [], activities: [] };
    else if (path === '/api/user/notifications') data = { notifications: [], unreadCount: 0, page: 1, totalPages: 1 };
    else if (path === '/api/user/meals') data = { meals: [] };
    else if (path === '/api/admin/dashboard') data = { totals: { events: 1, registrations: 2, teams: 0, users: 2 }, perEventStats: [event], recentRegistrations: [] };
    else if (path === '/api/admin/events/event1') data = event;
    else if (path.endsWith('/participants')) data = [{ userId: 'user1', name: 'Alice', status: 'PENDING' }, { userId: 'user2', name: 'Bob', status: 'PENDING' }];
    else if (path.endsWith('/promote')) data = { promotedCount: 1, rejectedCount: 1 };
    else if (path.endsWith('/rounds')) data = { rounds: [{ id: 1, roundNumber: 1, name: 'Qualifiers', roundEndTime: '2026-10-14T18:30:00Z' }] };
    else if (path.endsWith('/registrations')) data = { registrations: [{ id: 1, user: { email: 'alice@example.test' }, status: 'registered' }], pagination: { page: 1, total: 1, totalPages: 1 } };
    else if (path === '/api/admin/users') data = { users: [{ id: 'user1', firstName: 'Alice', lastName: 'Test', email: 'alice@example.test', role: 'participant' }], pagination: { page: 1, total: 1, totalPages: 1 } };
    else if (path === '/api/admin/staff') data = { assignments: [] };
    else if (path === '/api/admin/meals') data = { meals: [] };
    await route.fulfill({ json: { success: true, data } });
  });
}

test('unauthenticated admin visitor goes to login', async ({ page }) => {
  await page.goto('/admin/super'); await expect(page).toHaveURL(/\/login$/);
});
test('event admin redirects to assigned event and cannot access governance', async ({ page }) => {
  await mockApi(page, 'event_admin'); await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/events\/event1$/);
  await expect(page.getByRole('heading', { name: 'Test Hackathon', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'User governance' })).toHaveCount(0);
  await page.goto('/admin/super'); await expect(page).toHaveURL(/\/admin\/events\/event1$/);
  await page.goto('/admin/events/event2'); await expect(page.getByRole('alert').filter({ hasText: 'You do not have access' })).toBeVisible();
});
test('participant cannot enter super panel', async ({ page }) => {
  await mockApi(page, 'participant'); await page.goto('/admin/super'); await expect(page).toHaveURL('http://localhost:3100/profile');
});
test('super admin can edit an event with correct API payload', async ({ page }) => {
  await mockApi(page); await page.goto('/admin/super?view=events&event=event1');
  await page.getByRole('button', { name: 'Edit event', exact: true }).click();
  await page.getByLabel('Event name').fill('Updated Hackathon');
  const request = page.waitForRequest(r => r.method() === 'PATCH' && r.url().endsWith('/api/admin/events/event1'));
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const payload = (await request).postDataJSON(); expect(payload.name).toBe('Updated Hackathon'); expect(payload).not.toHaveProperty('id');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('promotion confirms rejection and sends selected IDs', async ({ page }) => {
  await mockApi(page, 'event_admin'); await page.goto('/admin/events/event1?view=promotion');
  await page.getByRole('checkbox', { name: 'Select Alice' }).check();
  page.once('dialog', dialog => { expect(dialog.message()).toContain('rejected'); void dialog.accept(); });
  const request = page.waitForRequest(r => r.url().endsWith('/promote') && r.method() === 'POST');
  await page.getByRole('button', { name: 'Promote selected' }).click();
  expect((await request).postDataJSON()).toEqual({ userIds: ['user1'], teamIds: [] });
  await expect(page.getByRole('status').filter({ hasText: 'Promoted: 1' })).toBeVisible();
});
test('registration export downloads CSV and mobile panel fits viewport', async ({ page }) => {
  await mockApi(page); await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/admin/super?view=registrations&event=event1');
  await expect(page.getByText('alice@example.test').first()).toBeVisible();
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export all filtered rows' }).click();
  expect((await download).suggestedFilename()).toBe('event1-registrations.csv');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/admin-mobile.png', fullPage: true });
});
test('navigation persists on refresh and desktop overview renders', async ({ page }) => {
  await mockApi(page); await page.goto('/admin/super');
  await page.getByRole('link', { name: 'User governance' }).click(); await expect(page).toHaveURL(/view=users/); await page.reload();
  await expect(page.getByRole('heading', { name: 'User governance' })).toBeVisible();
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Festival events' })).toBeVisible();
  await page.screenshot({ path: 'test-results/admin-desktop.png', fullPage: true });
});

test('existing account redeems admin code and redirects through role lookup', async ({ page }) => {
  await mockApi(page, 'event_admin'); await page.goto('/admin/authorize');
  await page.getByLabel('Admin code').fill('event-code-fixture');
  const request = page.waitForRequest(r => r.url().endsWith('/api/auth/admin/register'));
  await page.getByRole('button', { name: 'Activate access' }).click();
  expect((await request).postDataJSON()).toEqual({ eventCode: 'event-code-fixture' });
  await expect(page).toHaveURL(/\/admin\/events\/event1$/);
});
test('expired session redirects to login', async ({ page }) => {
  await mockApi(page);
  await page.route('**/api/auth/me', route => route.fulfill({ status: 401, json: { error: { message: 'Session expired' } } }));
  await page.goto('/admin/super'); await expect(page).toHaveURL(/\/login$/);
});
test('meal service failure leaves the other admin sections usable', async ({ page }) => {
  await mockApi(page);
  await page.route('**/api/admin/meals', route => route.fulfill({ status: 500, json: { error: { message: 'Meal service unavailable' } } }));
  await page.goto('/admin/super?view=meals');
  await expect(page.getByText('Meal service unavailable')).toBeVisible();
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Festival events' })).toBeVisible();
});
