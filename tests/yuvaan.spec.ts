import { test, expect, type Page } from '@playwright/test';

const user = {
  id: 'person-1',
  firstName: 'Vinay',
  lastName: 'Kumar',
  email: 'vinay@example.test',
  role: 'participant',
  festId: 'TF123456',
  collegeName: 'IIIT Nagpur',
  phoneNumber: '9876543210',
  verified: true,
  allowedEventIds: [],
};

const yuvaanEvent = {
  id: 'tf26_yuvaan',
  slug: 'yuvaan',
  name: 'Yuvaan: Youth Conclave',
  club: 'Orator',
  isTeamEvent: false,
  minTeamSize: 1,
  maxTeamSize: 1,
  price: 300,
  feeMode: 'per_team',
  paymentTrigger: 'after_round',
  paymentRound: 'ROUND_2',
  registrationEndTime: '2099-10-25T12:00:00Z',
  venue: 'CR 201, 202 & Admin Hall 2',
};

async function mockYuvaan(page: Page, options?: { isRegisteredInitially?: boolean }) {
  await page.addInitScript(() => localStorage.setItem('tf_signed_in', '1'));

  let registered = options?.isRegisteredInitially ?? false;
  let lastRegistrationPayload: Record<string, unknown> | null = null;

  const registrationRecord = () => ({
    id: 101,
    eventId: yuvaanEvent.id,
    userId: user.id,
    teamId: null,
    status: 'registered',
    event: yuvaanEvent,
    roundProgress: [],
    payment: null,
    metadata: {
      preferences: [
        { committee: 'Human Development', motion: 'For' },
        { committee: 'Press', motion: 'Against' },
        { committee: 'Civic laws and policies', motion: 'For' },
      ],
      schoolCollege: 'IIIT Nagpur',
      classYear: '3rd Year',
    },
    preferences: [
      { committee: 'Human Development', motion: 'For' },
      { committee: 'Press', motion: 'Against' },
      { committee: 'Civic laws and policies', motion: 'For' },
    ],
    schoolCollege: 'IIIT Nagpur',
    classYear: '3rd Year',
  });

  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    const method = route.request().method();

    let data: unknown = {};

    if (path === '/api/auth/me') {
      data = { user };
    } else if (path.startsWith('/api/events/')) {
      data = yuvaanEvent;
    } else if (path === '/api/events') {
      data = { events: [yuvaanEvent], pagination: { totalPages: 1 } };
    } else if (path === '/api/user/profile') {
      data = {
        user,
        stats: {
          totalRegisteredEvents: registered ? 1 : 0,
          totalTeams: 0,
          totalQualifiedRounds: 0,
        },
        registeredEvents: registered ? [registrationRecord()] : [],
        teams: [],
        activities: [],
      };
    } else if (path === '/api/user/notifications') {
      data = { notifications: [], unreadCount: 0, totalPages: 1, page: 1 };
    } else if (path === '/api/user/teams/my') {
      data = { teams: [] };
    } else if (path === '/api/user/registrations') {
      if (method === 'POST') {
        lastRegistrationPayload = route.request().postDataJSON() as Record<string, unknown>;
        registered = true;
      }
      data = { registrations: registered ? [registrationRecord()] : [] };
    }

    await route.fulfill({ json: { success: true, data } });
  });

  return {
    getLastPayload: () => lastRegistrationPayload,
  };
}

test.describe('Yuvaan (Youth Conclave) Registration Add-on Form with Per-Preference Motions', () => {
  test('displays all 3 preference pairs with default motion and validates distinct committees', async ({ page }) => {
    await mockYuvaan(page);
    await page.goto('/register/event?eventId=yuvaan');

    // 1. Verify Yuvaan Conclave Preferences Section is visible
    await expect(page.getByRole('heading', { name: 'Yuvaan Conclave Preferences' })).toBeVisible();

    // 2. Verify School / College is pre-filled from user profile
    const collegeInput = page.locator('#yuvaan-school-college');
    await expect(collegeInput).toHaveValue('IIIT Nagpur');

    // 3. Verify Class / Year placeholder
    const classInput = page.locator('#yuvaan-class-year');
    await expect(classInput).toHaveAttribute('placeholder', 'e.g. 3rd Year, 12th Grade');

    // 4. Verify each preference has a committee select and a default 'For' motion
    await expect(page.locator('#yuvaan-pref-1-motion-for')).toBeChecked();
    await expect(page.locator('#yuvaan-pref-2-motion-for')).toBeChecked();
    await expect(page.locator('#yuvaan-pref-3-motion-for')).toBeChecked();

    // 5. Try submitting without selecting committees -> Should trigger validation
    await page.getByRole('button', { name: 'Confirm registration' }).click();
    await expect(page.getByText('All 3 committee preferences must be selected.')).toBeVisible();

    // 6. Select duplicate committees: Preference 1 = Press, Preference 2 = Press
    await page.locator('#yuvaan-pref-1-committee').selectOption('Press');
    await page.locator('#yuvaan-pref-2-committee').selectOption('Press');
    await page.locator('#yuvaan-pref-3-committee').selectOption('Human Development');
    await classInput.fill('3rd Year');

    // Submit with duplicate committees
    await page.getByRole('button', { name: 'Confirm registration' }).click();
    await expect(
      page.getByText('Committee preferences must be mutually distinct. Please select 3 different committees.')
    ).toBeVisible();
  });

  test('submits registration with per-preference motion stances in exact payload contract', async ({ page }) => {
    const fixture = await mockYuvaan(page);
    await page.goto('/register/event?eventId=yuvaan');

    // Select Preference 1: Human Development, Motion: For
    await page.locator('#yuvaan-pref-1-committee').selectOption('Human Development');
    await page.locator('#yuvaan-pref-1-motion-for').check();

    // Select Preference 2: Press, Motion: Against
    await page.locator('#yuvaan-pref-2-committee').selectOption('Press');
    await page.locator('#yuvaan-pref-2-motion-against').check();

    // Select Preference 3: Civic laws and policies, Motion: For
    await page.locator('#yuvaan-pref-3-committee').selectOption('Civic laws and policies');
    await page.locator('#yuvaan-pref-3-motion-for').check();

    // Fill institution and class
    await page.locator('#yuvaan-school-college').fill('IIIT Nagpur');
    await page.locator('#yuvaan-class-year').fill('3rd Year');

    // Confirm registration
    await page.getByRole('button', { name: 'Confirm registration' }).click();

    // Verify registration success screen appears
    await expect(page.getByRole('heading', { name: 'You’re on the list.' })).toBeVisible();
    await expect(page.getByText('Registered Delegate Preferences')).toBeVisible();

    // Verify the exact payload contract was sent to POST /api/user/registrations
    const payload = fixture.getLastPayload();
    expect(payload).toEqual({
      eventId: 'tf26_yuvaan',
      preferences: [
        { committee: 'Human Development', motion: 'For' },
        { committee: 'Press', motion: 'Against' },
        { committee: 'Civic laws and policies', motion: 'For' },
      ],
      schoolCollege: 'IIIT Nagpur',
      classYear: '3rd Year',
    });
  });

  test('the event page sends entrants to the registration page, not a popup', async ({ page }) => {
    await mockYuvaan(page);
    await page.goto('/events/yuvaan');

    // Verify that the static debate tracks card is NOT displayed on the page
    await expect(page.getByRole('heading', { name: 'Yuvaan Debate Tracks' })).not.toBeVisible();

    // Yuvaan used to open its own registration dialog here, which meant two
    // copies of the preferences form to keep in step. There is now one, on
    // the registration page, and Register Now is an ordinary link to it.
    const register = page.getByRole('link', { name: 'Register now for Yuvaan: Youth Conclave' });
    await expect(register).toHaveAttribute('href', '/register/event?eventId=yuvaan');
    await expect(page.getByRole('dialog', { name: 'Yuvaan Conclave Preferences' })).toHaveCount(0);
  });
});
