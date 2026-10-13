import { test, expect } from '@playwright/test';

const profile = {
  success: true,
  data: { user: { id: 'person-1', email: 'student@example.test', role: 'participant', allowedEventIds: [] } },
};

test('Google login requests Better Auth and returns through the frontend callback', async ({ page }) => {
  let socialRequest = false;
  await page.route('**/api/**', route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/auth/sign-in/social') {
      const body = route.request().postDataJSON();
      expect(body.provider).toBe('google');
      expect(body.callbackURL).toBe('http://localhost:3100/auth/callback');
      socialRequest = true;
      return route.fulfill({ json: { url: 'https://accounts.google.test/authorize' } });
    }
    if (url.pathname === '/api/auth/me') return route.fulfill({ json: profile });
    if (url.pathname === '/api/user/profile') return route.fulfill({ json: { success: true, data: {
      user: { ...profile.data.user, firstName: 'Student', lastName: 'Test', festId: 'TF123456', verified: true, collegeName: 'College', phoneNumber: '9876543210' },
      registeredEvents: [], teams: [], activities: [], stats: { totalRegisteredEvents: 0, totalTeams: 0, totalQualifiedRounds: 0 },
    } } });
    if (url.pathname === '/api/user/notifications') return route.fulfill({ json: { success: true, data: { notifications: [], unreadCount: 0, page: 1, totalPages: 1 } } });
    if (url.pathname === '/api/user/meals') return route.fulfill({ json: { success: true, data: { meals: [] } } });
    return route.abort();
  });
  await page.route('https://accounts.google.test/authorize', route => route.fulfill({ contentType: 'text/html', body: 'Google consent fixture' }));

  await page.goto('/login');
  await page.getByRole('button', { name: 'CONTINUE WITH GOOGLE' }).click();
  await expect(page).toHaveURL('https://accounts.google.test/authorize');
  expect(socialRequest).toBe(true);

  await page.goto('/auth/callback');
  await expect(page).toHaveURL('http://localhost:3100/profile');
  expect(await page.evaluate(() => localStorage.getItem('tf_signed_in'))).toBe('1');
  expect(await page.evaluate(() => localStorage.getItem('tf_auth_token'))).toBeNull();
});

test('callback shows a clear error when the session is absent', async ({ page }) => {
  await page.route('**/api/auth/me', route => route.fulfill({ status: 401, json: { error: { message: 'Authentication required.' } } }));
  await page.route('**/api/auth/logout', route => route.fulfill({ json: { success: true } }));
  await page.goto('/auth/callback');
  await expect(page.locator('main [role="alert"]')).toContainText('Authentication required.');
  expect(await page.evaluate(() => localStorage.getItem('tf_signed_in'))).toBeNull();
});

test('callback handles denied Google consent and clears the query string', async ({ page }) => {
  await page.goto('/auth/callback?error=access_denied');
  await expect(page.locator('main [role="alert"]')).toContainText('cancelled or denied');
  await expect(page).toHaveURL('http://localhost:3100/auth/callback');
});
