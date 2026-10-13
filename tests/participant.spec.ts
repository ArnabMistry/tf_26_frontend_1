import { test, expect, type Page } from '@playwright/test';
const user = { id: 'person-1', firstName: 'Vinay', lastName: 'Kumar', email: 'vinay@example.test', role: 'participant', festId: 'TF123456', collegeName: 'IIIT Nagpur', phoneNumber: '9876543210', verified: true, allowedEventIds: [] };
const member = { ...user, id: 'person-2', firstName: 'Aditi', festId: 'TF654321' };
const event = { id: 'tf26_phoenix_cup', slug: 'phoenix-cup', name: 'Phoenix Cup', club: 'Synergy', isTeamEvent: true, minTeamSize: 2, maxTeamSize: 2, price: 0, paymentTrigger: 'free', registrationEndTime: '2099-10-25T12:00:00Z' };
async function mock(page: Page) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));
  let created = false, invited = false, accepted = false, registered = false, notificationStatus = 'PENDING', read = false;
  const team = () => ({ id: 7, name: 'Night Owls', eventId: event.id, event, teamCode: 'TEAM-TEST', leader: user, isLeader: true, members: accepted ? [{ ...user, isLeader: true }, member] : [{ ...user, isLeader: true }], invites: invited && !accepted ? [{ id: 9, user: member, status: 'PENDING', email: member.email }] : [], stats: { isRegistered: registered, isReadyForRegistration: accepted, pendingCount: invited && !accepted ? 1 : 0 } });
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url()), path = url.pathname, method = route.request().method();
    let data: unknown = {};
    if (path === '/api/auth/me') data = { user };
    else if (path.startsWith('/api/events/')) data = event;
    else if (path === '/api/user/profile') data = { user, stats: { totalRegisteredEvents: registered ? 1 : 0, totalTeams: created ? 1 : 0, totalQualifiedRounds: 0 }, registeredEvents: registered ? [{ id: 1, eventId: event.id, event, status: 'registered', roundProgress: [] }] : [], teams: created ? [team()] : [], activities: [] };
    else if (path === '/api/user/notifications') data = { notifications: [{ id: 1, senderName: 'Aditi Kumar', eventName: event.name, eventId: event.id, teamName: 'Night Owls', teamId: 7, inviteId: 9, kind: 'TEAM_INVITE', status: notificationStatus, createdAt: '2026-10-12T06:00:00Z', readAt: read ? '2026-10-12T06:30:00Z' : null }], unreadCount: read ? 0 : 1, totalPages: 1, page: 1 };
    else if (path.endsWith('/read')) read = true;
    else if (path === '/api/invites/9/respond') { notificationStatus = route.request().postDataJSON().action === 'accept' ? 'ACCEPTED' : 'REJECTED'; accepted = notificationStatus === 'ACCEPTED'; created = accepted; }
    else if (path === '/api/user/teams/my') data = { teams: created ? [team()] : [] };
    else if (path === '/api/user/teams' && method === 'POST') { expect(route.request().postDataJSON().eventId).toBe(event.id); created = true; data = { team: team() }; }
    else if (path === '/api/user/teams/7/invites') { expect(route.request().postDataJSON().identifier).toBe('TF654321'); invited = true; data = team(); }
    else if (path.endsWith('/live-status')) data = team();
    else if (path === '/api/user/registrations') {
      if (method === 'POST') { expect(route.request().postDataJSON()).toEqual({ eventId: event.id, teamId: 7 }); registered = true; }
      data = { registrations: registered ? [{ id: 1, eventId: event.id, event, status: 'registered', roundProgress: [] }] : [] };
    }
    await route.fulfill({ json: { success: true, data } });
  });
  return { accept: () => { accepted = true; } };
}

test('profile renders backend identity and accepts a notification', async ({ page }) => {
  await mock(page); await page.goto('/profile?tab=notifications');
  await expect(page.getByText('TF123456', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Aditi Kumar invited you to Night Owls' })).toBeVisible();
  await page.getByRole('button', { name: 'Accept invitation', exact: true }).click();
  await expect(page.getByText('Invitation accepted. Your team is now visible below.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Accept invitation', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Admin', exact: true })).toHaveCount(0);
});
test('participant can decline without joining', async ({ page }) => {
  await mock(page); await page.goto('/profile?tab=notifications');
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await expect(page.getByText('Invitation declined.', { exact: true })).toBeVisible();
  await expect(page.getByText('REJECTED', { exact: true })).toBeVisible();
});
test('team creation sends TF ID invite and registers only after acceptance', async ({ page }) => {
  const fixture = await mock(page); await page.goto('/register/team?eventId=tf26_phoenix_cup');
  await page.getByLabel('Team name', { exact: true }).fill('Night Owls');
  await page.getByRole('button', { name: 'Create team', exact: true }).click();
  await page.getByLabel('Teammate’s TF ID').fill('TF654321');
  await page.getByRole('button', { name: 'Send invitation', exact: true }).click();
  await expect(page.getByText('Invitation sent.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Register team', exact: true })).toBeDisabled();
  fixture.accept(); await page.reload();
  await page.getByRole('button', { name: 'Register team', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'You’re on the list.' })).toBeVisible();
});
test('logged-out event registration preserves event on login redirect', async ({ page }) => {
  await page.goto('/register/team?eventId=tf26_phoenix_cup');
  await expect(page).toHaveURL(/\/login\?next=/);
  expect(new URL(page.url()).searchParams.get('next')).toBe('/register/team?eventId=tf26_phoenix_cup');
});
test('mobile profile fits viewport and exposes profile and notifications icons', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await mock(page); await page.goto('/profile');
  await expect(page.getByText('TF123456', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'My profile', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Notifications,/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/participant-mobile.png', fullPage: true });
});
