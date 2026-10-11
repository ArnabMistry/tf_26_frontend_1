import { test, expect } from '@playwright/test';

test('Google login starts a PKCE flow with the frontend callback', async ({ page }) => {
  await page.route('**/auth/v1/authorize?**', route => route.fulfill({ contentType: 'text/html', body: 'Google authorization fixture' }));
  await page.goto('/login');
  await page.getByRole('button', { name: 'CONTINUE WITH GOOGLE' }).click();
  await expect(page).toHaveURL(/\/auth\/v1\/authorize\?/);
  const url = new URL(page.url());
  expect(url.searchParams.get('provider')).toBe('google');
  expect(url.searchParams.get('redirect_to')).toBe('http://localhost:3100/auth/callback');
  expect(url.searchParams.get('code_challenge')).toBeTruthy();
});

test('callback rejects a missing code', async ({ page }) => {
  await page.goto('/auth/callback');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Missing login code');
  expect(await page.evaluate(() => localStorage.getItem('tf_auth_token'))).toBeNull();
});

test('callback handles denied consent and removes OAuth query parameters', async ({ page }) => {
  await page.goto('/auth/callback?error=access_denied&error_description=Denied');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('cancelled or denied');
  await expect(page).toHaveURL(/\/auth\/callback$/);
});

test('successful Google callback syncs the backend profile before redirecting', async ({ page }) => {
  const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'oauth@example.test', app_metadata: { provider: 'google' }, user_metadata: {}, created_at: new Date().toISOString() };
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const accessToken = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })}.fixture`;
  await page.route('**/auth/v1/authorize?**', route => route.fulfill({ contentType: 'text/html', body: 'Google authorization fixture' }));
  await page.route('**/auth/v1/token?**', async route => {
    expect(route.request().postDataJSON().code_verifier).toBeTruthy();
    await route.fulfill({ json: { access_token: accessToken, refresh_token: 'refresh-fixture', token_type: 'bearer', expires_in: 3600, user } });
  });
  let synced = false;
  await page.route('**/api/auth/me', async route => {
    expect(route.request().headers().authorization).toBe(`Bearer ${accessToken}`);
    synced = true;
    await route.fulfill({ json: { success: true, data: { user: { id: user.id, role: 'participant', festId: 'TF123456', allowedEventIds: [] } } } });
  });
  await page.goto('/login');
  await page.getByRole('button', { name: 'CONTINUE WITH GOOGLE' }).click();
  await expect(page).toHaveURL(/\/auth\/v1\/authorize\?/);
  await page.goto('http://localhost:3100/auth/callback?code=fixture-code');
  await expect(page).toHaveURL('http://localhost:3100/profile');
  expect(synced).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem('tf_auth_token'))).toBe(accessToken);
  await expect(page.getByRole('link', { name: 'Admin', exact: true })).toHaveCount(0);
});
