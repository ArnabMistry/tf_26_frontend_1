import { test, expect, type Page } from '@playwright/test';

/**
 * The one path that emails addresses which are not in the database: an admin
 * types them in by hand. These tests pin down that it is reachable without
 * hunting for it, that it will carry any message rather than only a shortlist
 * notice, and that what reaches the server is what was typed.
 */

const EVENT = {
  id: 'evt-1',
  name: 'Codeathon',
  club: 'ACM',
  isTeamEvent: false,
  _count: { registrations: 4, teams: 0, rounds: 1 },
};

const TEMPLATES = [
  { id: 1, name: 'Venue change', eventId: EVENT.id, subject: 'Venue update', bodyHtml: '<p>Hi {{name}}, the venue moved.</p>', bodyText: null, createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z' },
  { id: 2, name: 'Thanks for coming', eventId: null, subject: 'Thank you', bodyHtml: '<p>Thanks for joining us.</p>', bodyText: null, createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z' },
];

type Call = { path: string; body: Record<string, unknown> | null; method: string };

async function mockAdmin(page: Page) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  const calls: Call[] = [];

  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const method = route.request().method();
    let body: Record<string, unknown> | null = null;
    try { body = route.request().postDataJSON(); } catch { /* GET */ }
    calls.push({ path, body, method });

    let data: unknown = {};
    if (path === '/api/auth/me') data = { user: { id: 'me', role: 'super', allowedEventIds: null } };
    else if (path === '/api/admin/dashboard') {
      data = { totals: { events: 1, registrations: 4, teams: 0, users: 4 }, perEventStats: [EVENT], recentRegistrations: [] };
    } else if (path === `/api/admin/events/${EVENT.id}`) data = EVENT;
    else if (path.endsWith('/templates') && method === 'GET') data = { templates: TEMPLATES };
    else if (path.endsWith('/templates')) data = { id: 99 };
    else if (path.endsWith('/campaigns')) data = { campaigns: [] };
    else if (path.endsWith('/send-direct')) {
      const emails = (body?.emails as string[]) || [];
      data = { success: true, message: `Broadcast finished: ${emails.length} sent, 0 failed.`, total: emails.length, sentCount: emails.length, failedCount: 0, successful: emails, failed: [] };
    }
    await route.fulfill({ json: { success: true, data } });
  });

  return { calls };
}

/** Opens Bulk Email and switches to the hand-typed recipient composer. */
async function openDirectTab(page: Page) {
  await page.goto('/admin/super?view=bulk-email');
  await page.getByRole('button', { name: /Direct Email/ }).click();
  await expect(page.getByRole('heading', { name: /Write to any email address/ })).toBeVisible();
}

test('the direct composer is one click from the Bulk Email screen', async ({ page }) => {
  await mockAdmin(page);
  await page.goto('/admin/super?view=bulk-email');

  // It must be visible on arrival rather than buried below the compose form,
  // which is where it used to live.
  const tab = page.getByRole('button', { name: /Direct Email/ });
  await expect(tab).toBeVisible();

  await tab.click();
  await expect(page.getByRole('heading', { name: /Write to any email address/ })).toBeVisible();
  await expect(page.getByText(/they do not have to be registered/i)).toBeVisible();
});

test('any address can be typed in, in whatever shape, and the count follows', async ({ page }) => {
  await mockAdmin(page);
  await openDirectTab(page);

  const to = page.getByRole('textbox').first();
  await to.fill('someone@gmail.com');
  await expect(page.getByText('✓ 1 recipient', { exact: true })).toBeVisible();

  // Commas, line breaks and the "Name <address>" form all count, and the same
  // address twice counts once.
  await to.fill('a@gmail.com, b@outlook.com\nAsha Rao <asha@example.com>; a@gmail.com');
  await expect(page.getByText('✓ 3 recipients', { exact: true })).toBeVisible();

  // Nothing that is not an address is counted as one.
  await to.fill('not-an-address, also@nope, c@real.com');
  await expect(page.getByText('✓ 1 recipient', { exact: true })).toBeVisible();
});

test('a free-form message is sent to exactly the addresses typed', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await openDirectTab(page);

  page.on('dialog', d => d.accept());

  await page.getByRole('textbox').first().fill('Asha Rao <asha@example.com>, dev@college.edu');
  await page.getByRole('textbox').nth(1).fill('Venue moved to LHC-3');
  await page.getByRole('textbox').nth(2).fill('<p>Hi {{name}}, the venue has changed.</p>');

  await page.getByRole('button', { name: /Send Email to 2 Recipients/ }).click();

  await expect.poll(() => calls.find(c => c.path.endsWith('/send-direct'))).toBeTruthy();
  const sent = calls.find(c => c.path.endsWith('/send-direct'))!;
  expect(sent.body).toMatchObject({
    emails: ['Asha Rao <asha@example.com>', 'dev@college.edu'],
    subject: 'Venue moved to LHC-3',
    bodyHtml: '<p>Hi {{name}}, the venue has changed.</p>',
    // Not a shortlist, so the mail must not carry the shortlist footer.
    kind: 'general',
  });

  await expect(page.getByText(/2 sent, 0 failed/)).toBeVisible();
});

test('the shortlist footer is opt-in, and its template ticks the box', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await openDirectTab(page);

  page.on('dialog', d => d.accept());

  const shortlist = page.getByRole('checkbox');
  await expect(shortlist).not.toBeChecked();
  await expect(page.getByText(/Footer will simply say the email is from/i)).toBeVisible();

  await page.getByRole('button', { name: /Use the shortlist template/ }).click();
  await expect(shortlist).toBeChecked();
  await expect(page.getByText(/Footer will say the recipient was shortlisted/i)).toBeVisible();

  await page.getByRole('textbox').first().fill('a@gmail.com');
  await page.getByRole('button', { name: /Send Email to 1 Recipient/ }).click();

  await expect.poll(() => calls.find(c => c.path.endsWith('/send-direct'))).toBeTruthy();
  expect(calls.find(c => c.path.endsWith('/send-direct'))!.body).toMatchObject({ kind: 'shortlist' });
});

test('sending is refused until there is a recipient, a subject and a body', async ({ page }) => {
  await mockAdmin(page);
  await openDirectTab(page);

  const send = page.getByRole('button', { name: /Send Email/ });
  await expect(send).toBeDisabled();

  await page.getByRole('textbox').first().fill('a@gmail.com');
  await expect(send).toBeDisabled();

  await page.getByRole('textbox').nth(1).fill('Subject');
  await expect(send).toBeDisabled();

  await page.getByRole('textbox').nth(2).fill('<p>Body</p>');
  await expect(send).toBeEnabled();
});


test('a saved template can be loaded into the direct composer and sent', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await openDirectTab(page);

  page.on('dialog', d => d.accept());

  // Both an event template and a global one are on offer, not just shortlist.
  const picker = page.getByLabel('Start from a template');
  await expect(picker.getByRole('option')).toHaveText([
    '-- Write from scratch --',
    'Venue change (Event Specific)',
    'Thanks for coming (Global Template)',
  ]);

  await picker.selectOption('1');
  await expect(page.getByRole('textbox').nth(1)).toHaveValue('Venue update');
  await expect(page.getByRole('textbox').nth(2)).toHaveValue('<p>Hi {{name}}, the venue moved.</p>');

  // Loading a template says nothing about why the recipient is being written
  // to, so it must not tick the shortlist footer on.
  await expect(page.getByRole('checkbox')).not.toBeChecked();

  await page.getByRole('textbox').first().fill('a@gmail.com');
  await page.getByRole('button', { name: /Send Email to 1 Recipient/ }).click();

  await expect.poll(() => calls.find(c => c.path.endsWith('/send-direct'))).toBeTruthy();
  expect(calls.find(c => c.path.endsWith('/send-direct'))!.body).toMatchObject({
    subject: 'Venue update',
    bodyHtml: '<p>Hi {{name}}, the venue moved.</p>',
    kind: 'general',
  });
});

test('a message written here can be kept as a new template', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await openDirectTab(page);

  const save = page.getByRole('button', { name: /Save this as a template/ });
  // Nothing written yet, so there is nothing worth keeping.
  await expect(save).toBeDisabled();

  await page.getByRole('textbox').nth(1).fill('Collect your merch');
  await page.getByRole('textbox').nth(2).fill('<p>The desk is open till 6pm.</p>');
  await expect(save).toBeEnabled();

  await save.click();

  // The existing template modal opens, carrying what was composed.
  const modal = page.locator('.admin-card').filter({ has: page.getByRole('heading', { name: 'Create New Template' }) });
  await expect(modal).toBeVisible();
  await modal.getByRole('textbox').first().fill('Merch desk hours');
  await modal.getByRole('button', { name: 'Save Template' }).click();

  await expect.poll(() => calls.find(c => c.method === 'POST' && c.path.endsWith('/templates'))).toBeTruthy();
  expect(calls.find(c => c.method === 'POST' && c.path.endsWith('/templates'))!.body).toMatchObject({
    name: 'Merch desk hours',
    subject: 'Collect your merch',
    bodyHtml: '<p>The desk is open till 6pm.</p>',
  });
});

test('a document can be attached to a direct email and sent with it', async ({ page }) => {
  const { calls } = await mockAdmin(page);
  await openDirectTab(page);

  page.on('dialog', d => d.accept());

  await page.getByRole('textbox').first().fill('a@gmail.com');
  await page.getByRole('textbox').nth(1).fill('Rulebook');
  await page.getByRole('textbox').nth(2).fill('<p>See attached.</p>');

  await page.locator('input[type="file"]').last().setInputFiles({
    name: 'Rulebook.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\nRules\n%%EOF'),
  });

  // The file is listed, named and sized, so nothing goes out unseen.
  await expect(page.getByText('Rulebook.pdf')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove Rulebook.pdf' })).toBeVisible();

  await page.getByRole('button', { name: /Send Email to 1 Recipient/ }).click();

  await expect.poll(() => calls.find(c => c.path.endsWith('/send-direct'))).toBeTruthy();
  const body = calls.find(c => c.path.endsWith('/send-direct'))!.body!;
  const attached = body.attachments as Array<{ filename: string; content: string }>;
  expect(attached).toHaveLength(1);
  expect(attached[0].filename).toBe('Rulebook.pdf');
  expect(attached[0].content).toContain('base64,');
});

test('an attached file can be taken off again before sending', async ({ page }) => {
  await mockAdmin(page);
  await openDirectTab(page);

  await page.locator('input[type="file"]').last().setInputFiles({
    name: 'Schedule.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nS\n%%EOF'),
  });
  await expect(page.getByText('Schedule.pdf')).toBeVisible();

  await page.getByRole('button', { name: 'Remove Schedule.pdf' }).click();
  await expect(page.getByText('Schedule.pdf')).toHaveCount(0);
});

test('an unsupported file is refused in the composer, not at the server', async ({ page }) => {
  await mockAdmin(page);
  await openDirectTab(page);

  await page.locator('input[type="file"]').last().setInputFiles({
    name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  });

  await expect(page.getByRole('alert').filter({ hasText: 'Unsupported file format' })).toContainText(
    'Only .pdf and .docx are permitted'
  );
  await expect(page.getByText('photo.png')).toHaveCount(0);
});

test('files attached to a broadcast do not follow you to the direct composer', async ({ page }) => {
  await mockAdmin(page);
  await page.goto('/admin/super?view=bulk-email');

  // Attach on the Compose Broadcast tab…
  await page.locator('input[type="file"]').first().setInputFiles({
    name: 'Broadcast.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nB\n%%EOF'),
  });
  await expect(page.getByText('Broadcast.pdf')).toBeVisible();

  // …and it must not appear on the direct one, which sends to other people.
  await page.getByRole('button', { name: /Direct Email/ }).click();
  await expect(page.getByRole('heading', { name: /Write to any email address/ })).toBeVisible();
  await expect(page.getByText('Broadcast.pdf')).toHaveCount(0);
});
