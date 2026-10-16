import { test, expect, type Page } from '@playwright/test';

const yuvaan = { id: 'tf26_yuvaan', name: 'Yuvaan: Youth Conclave', club: 'Yuvaan', description: '', venue: '', price: 0, isTeamEvent: false, isPaid: false, paymentTrigger: 'free', paymentRound: 'ROUND_1', registrationEndTime: '2026-10-21T18:29:00Z', _count: { registrations: 3, teams: 0, rounds: 0 } };

// The exact metadata shape the live database stores for Yuvaan, including a
// registration that predates the preference fields and carries null metadata.
const REGISTRATIONS = [
  {
    id: 170, eventId: yuvaan.id, status: 'confirmed',
    user: { id: 'u1', firstName: 'Ayush', lastName: 'K', email: 'bt25csh002@iiitn.ac.in', festId: 'TF200001' },
    team: null, payment: { status: 'NOT_REQUIRED', amount: 0, paidAt: null, paymentId: null },
    metadata: { classYear: '2nd Year', schoolCollege: 'IIITN', motionPreference1: 'For', motionPreference2: 'For', motionPreference3: 'Against', committeePreference1: 'Civic laws and policies', committeePreference2: 'Human Development', committeePreference3: 'Press' },
  },
  {
    id: 169, eventId: yuvaan.id, status: 'confirmed',
    user: { id: 'u2', firstName: 'Nia', lastName: 'S', email: 'bt25cse013@iiitn.ac.in', festId: 'TF200002' },
    team: null, payment: { status: 'NOT_REQUIRED', amount: 0, paidAt: null, paymentId: null },
    metadata: { classYear: '2', schoolCollege: 'IIITN', motionPreference1: 'Against', motionPreference2: 'Against', motionPreference3: 'For', committeePreference1: 'Human Development', committeePreference2: 'Civic laws and policies', committeePreference3: 'Press' },
  },
  {
    id: 18, eventId: yuvaan.id, status: 'registered',
    user: { id: 'u3', firstName: 'Old', lastName: 'Entry', email: 'shardul.jps@gmail.com', festId: 'TF200003' },
    team: null, payment: { status: 'NOT_REQUIRED', amount: 0, paidAt: null, paymentId: null },
    metadata: null,
  },
];

/** A plain event that collects no preferences, to prove the column stays away. */
const plain = { ...yuvaan, id: 'event1', name: 'Test Hackathon', club: 'Coding Club' };

async function mockAdmin(page: Page, { event = yuvaan, registrations = REGISTRATIONS } = {}) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    let data: unknown = {};
    if (path === '/api/auth/me') data = { user: { id: 'me', role: 'super', allowedEventIds: null } };
    else if (path === '/api/admin/dashboard') data = { totals: { events: 1 }, perEventStats: [event], recentRegistrations: [] };
    else if (path.endsWith('/registrations')) {
      data = {
        eventId: event.id, feeRequired: false, feeAmount: 0, isTeamEvent: false,
        registrations, pagination: { page: 1, limit: 20, total: registrations.length, totalPages: 1 },
      };
    } else if (/\/api\/admin\/registrations\/\d+$/.test(path)) {
      const id = Number(path.split('/').pop());
      data = registrations.find(r => r.id === id) || {};
    }
    await route.fulfill({ json: { success: true, data } });
  });
}

test('Yuvaan registrations list each committee preference with its For/Against stance', async ({ page }) => {
  await mockAdmin(page);
  await page.goto(`/admin/super?view=registrations&event=${yuvaan.id}`);

  await expect(page.getByRole('columnheader', { name: 'Committee preferences' })).toBeVisible();

  // Ranked in order, each with the stance taken on it.
  const first = page.getByRole('row').filter({ hasText: 'bt25csh002@iiitn.ac.in' });
  await expect(first).toContainText('1. Civic laws and policies — For');
  await expect(first).toContainText('2. Human Development — For');
  await expect(first).toContainText('3. Press — Against');

  // A different registrant's ranking and stances are theirs alone.
  const second = page.getByRole('row').filter({ hasText: 'bt25cse013@iiitn.ac.in' });
  await expect(second).toContainText('1. Human Development — Against');
  await expect(second).toContainText('2. Civic laws and policies — Against');
  await expect(second).toContainText('3. Press — For');

  // A registration from before the fields existed says so rather than showing blanks.
  await expect(page.getByRole('row').filter({ hasText: 'shardul.jps@gmail.com' })).toContainText('Not provided');
});

test('the stance is emphasised so For and Against can be told apart at a glance', async ({ page }) => {
  await mockAdmin(page);
  await page.goto(`/admin/super?view=registrations&event=${yuvaan.id}`);
  const row = page.getByRole('row').filter({ hasText: 'bt25csh002@iiitn.ac.in' });
  await expect(row.locator('strong').first()).toHaveText('For');
  await expect(row.locator('strong').nth(2)).toHaveText('Against');
});

test('the preference column is absent on an event that does not collect them', async ({ page }) => {
  await mockAdmin(page, {
    event: plain,
    registrations: [{ ...REGISTRATIONS[2], eventId: plain.id, metadata: null }],
  });
  await page.goto(`/admin/super?view=registrations&event=${plain.id}`);
  await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Committee preferences' })).toHaveCount(0);
});

test('the CSV export carries preferences and stances as their own columns', async ({ page }) => {
  await mockAdmin(page);
  await page.goto(`/admin/super?view=registrations&event=${yuvaan.id}`);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export all filtered rows' }).click();
  const stream = await (await download).createReadStream();
  const csv = (await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', c => chunks.push(c as Buffer)).on('end', () => resolve(Buffer.concat(chunks))).on('error', reject);
  })).toString('utf8');

  expect(csv).toContain('"Preference 1","Stance 1"');
  expect(csv).toContain('"School / College","Class / Year"');
  // Each rank keeps its own stance, in its own cell, ready to sort or filter on.
  expect(csv).toContain('"Civic laws and policies","For","Human Development","For","Press","Against"');
  expect(csv).toContain('"Human Development","Against","Civic laws and policies","Against","Press","For"');
  expect(csv).toContain('"IIITN","2nd Year"');
});
