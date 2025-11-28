import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({
  baseURL: BASE_URL,
  trace: 'on-first-retry',
  video: 'on-first-retry',
});

test('demo happy path end-to-end', async ({ page }) => {
  page.on('console', (msg) => console.log('browser console:', msg.text()));
  page.on('response', (res) => {
    if (res.url().includes('/api/')) {
      console.log('api response', res.url(), res.status());
    }
  });
  await page.goto('/demo-flow');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => typeof navigator !== 'undefined' && !!navigator.serviceWorker);
  await page.evaluate(async () => {
    // ensure MSW worker is ready
    if (navigator.serviceWorker?.ready) {
      await navigator.serviceWorker.ready;
    }
    const originalFetch = window.fetch.bind(window);
    window.fetch = (...args) => {
      console.log('fetch called', args[0]);
      return originalFetch(...args);
    };
  });
  await page.waitForFunction(() => (window as any).__mswReady === true);
  await page.evaluate(() => fetch('/api/demo/reset', { method: 'POST' }));

  const derivedState = () => page.locator('pre').nth(1);
  const lastResultBox = () => page.locator('pre').first();
  const expectDerivedContains = async (snippet: string) => {
    await expect
      .poll(async () => (await derivedState().textContent()) ?? '', { timeout: 8000 })
      .toContain(snippet);
  };

  // Organizer: submit accreditation (draft -> pending_review)
  await page.getByRole('button', { name: 'Submit Accreditation' }).click();
  const afterSubmit = await lastResultBox().textContent();
  console.log('lastResult after submit:', afterSubmit);
  const lastErrorText = await page.locator('p', { hasText: 'Last error' }).locator('..').textContent();
  console.log('lastError block after submit:', lastErrorText);
  await expectDerivedContains('pending_review');

  // Regulator: approve -> approved
  await page.getByRole('button', { name: 'Regulator' }).click();
  await page.getByRole('button', { name: 'Approve' }).click();
  await expectDerivedContains('approved');

  // Organizer: publish and create assignment
  await page.getByRole('button', { name: 'Organizer' }).click();
  await page.getByRole('button', { name: 'Publish Event' }).click();
  await expectDerivedContains('published');
  await page.getByRole('button', { name: 'Create Assignment' }).click();
  await expect(lastResultBox()).toContainText('assignmentId');

  // Event Manager: accept assignment
  await page.getByRole('button', { name: 'Event Manager' }).click();
  await page.getByRole('button', { name: 'Accept Assignment' }).click();
  await expectDerivedContains('accepted');

  // HCP: register
  await page.getByRole('button', { name: 'HCP' }).click();
  await page.getByRole('button', { name: 'Register' }).click();
  await expectDerivedContains('confirmed');

  // Event Manager: check-in, finalize, issue certificate
  await page.getByRole('button', { name: 'Event Manager' }).click();
  await page.getByRole('button', { name: 'Check-in Ticket' }).click();
  await expectDerivedContains('attended');
  await page.getByRole('button', { name: 'Finalize Attendance' }).click();
  await expectDerivedContains('attendanceFinalized');
  await page.getByRole('button', { name: 'Issue Certificate' }).click();
  await expect(lastResultBox()).toContainText('certificateId');

  // HCP: submit review
  await page.getByRole('button', { name: 'HCP' }).click();
  await page.getByPlaceholder('Review text').fill('Great event');
  await page.getByRole('button', { name: 'Submit Review' }).click();
  await expect(lastResultBox()).toContainText('reviewId');

  // Vendor: purchase sponsorship
  await page.getByRole('button', { name: 'Vendor' }).click();
  await page.getByRole('button', { name: 'Purchase Sponsorship' }).click();
  await expect(lastResultBox()).toContainText('sponsorshipId');
});
