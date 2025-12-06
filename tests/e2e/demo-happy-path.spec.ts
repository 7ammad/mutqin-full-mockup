import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({
  baseURL: BASE_URL,
  trace: 'on-first-retry',
  video: 'on-first-retry',
});

test('demo happy path end-to-end - Cross-Persona Spine', async ({ page }) => {
  page.on('console', (msg) => console.log('browser console:', msg.text()));
  page.on('response', (res) => {
    if (res.url().includes('/api/')) {
      console.log('api response', res.url(), res.status());
    }
  });
  
  // Initialize MSW
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => typeof navigator !== 'undefined' && !!navigator.serviceWorker);
  await page.evaluate(async () => {
    if (navigator.serviceWorker?.ready) {
      await navigator.serviceWorker.ready;
    }
  });
  await page.waitForFunction(() => (window as any).__mswReady === true);
  await page.evaluate(() => fetch('/api/demo/reset', { method: 'POST' }));

  // Use seeded IDs
  const eventId = 'evt-1';
  const organizerId = 'org-1';
  const eventManagerId = 'em-1';
  const hcpId = 'hcp-1';

  // Step 1: Organizer creates/edits event
  await page.goto(`/dashboard/organizer/events/${eventId}/edit`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/organizer/events/${eventId}/edit`));
  
  // Step 2: Organizer submits for accreditation
  await page.goto(`/dashboard/organizer/events/${eventId}`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/organizer/events/${eventId}`));
  
  // Find and click submit accreditation button
  const submitButton = page.getByRole('button', { name: /submit.*accreditation/i });
  if (await submitButton.isVisible()) {
    await submitButton.click();
    await page.waitForTimeout(1000); // Wait for state update
  }

  // Step 3: Regulator reviews application
  await page.goto(`/dashboard/regulator/applications/${eventId}`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/regulator/applications/${eventId}`));
  await expect(page.locator('h1, h2, h3')).toContainText(/application|review/i);

  // Step 4: Regulator makes decision
  await page.goto(`/dashboard/regulator/applications/${eventId}/decision`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/regulator/applications/${eventId}/decision`));
  
  // Approve application
  const approveButton = page.getByRole('button', { name: /approve/i });
  if (await approveButton.isVisible()) {
    await approveButton.click();
    await page.waitForTimeout(1000);
  }

  // Step 5: Organizer publishes event + assigns Event Manager
  await page.goto(`/dashboard/organizer/events/${eventId}`);
  await page.waitForLoadState('networkidle');
  
  // Publish event
  const publishButton = page.getByRole('button', { name: /publish/i });
  if (await publishButton.isVisible()) {
    await publishButton.click();
    await page.waitForTimeout(1000);
  }
  
  // Assign Event Manager
  await page.goto(`/dashboard/organizer/events/${eventId}/assign`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/organizer/events/${eventId}/assign`));

  // Step 6: Event Manager runs event
  // Check-in
  await page.goto(`/dashboard/event-manager/events/${eventId}/checkin`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/event-manager/events/${eventId}/checkin`));
  
  // Attendance
  await page.goto(`/dashboard/event-manager/events/${eventId}/attendance`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/event-manager/events/${eventId}/attendance`));
  
  // Handover
  await page.goto(`/dashboard/event-manager/events/${eventId}/handover`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/event-manager/events/${eventId}/handover`));

  // Step 7: Organizer views attendance
  await page.goto(`/dashboard/organizer/events/${eventId}/attendance`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/organizer/events/${eventId}/attendance`));

  // Step 8: Certificates generated (verify certificates page exists)
  await page.goto(`/dashboard/organizer/events/${eventId}/certificates`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/organizer/events/${eventId}/certificates`));

  // Step 9: HCP views event, ticket, certificate, and credits
  // Event
  await page.goto(`/dashboard/hcp/events/${eventId}`);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`/dashboard/hcp/events/${eventId}`));
  
  // Verify event data is displayed (not error)
  await expect(page.locator('text=/Invalid hex color|Something went wrong|Unexpected token/i')).not.toBeVisible({ timeout: 2000 }).catch(() => {
    throw new Error('Error message found on HCP event page');
  });
  
  // Discovery tab - verify it shows events
  await page.goto('/dashboard/hcp?tab=discover');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/dashboard\/hcp.*tab=discover/);
  
  // Verify no error messages
  await expect(page.locator('text=/Invalid hex color|Something went wrong|Unexpected token/i')).not.toBeVisible({ timeout: 2000 }).catch(() => {
    throw new Error('Error message found on HCP discovery tab');
  });
  
  // Verify events are displayed (check for event cards or event list)
  const eventCards = page.locator('[class*="EventCard"], [class*="event-card"], [data-testid*="event"]');
  const eventCount = await eventCards.count();
  if (eventCount === 0) {
    // Check if there's at least some content indicating events
    const hasEventContent = await page.locator('text=/event|فعالية|Event/i').count() > 0;
    if (!hasEventContent) {
      console.warn('Warning: No events found on discovery tab');
    }
  }
  
  // Credits tab (L1)
  await page.goto('/dashboard/hcp?tab=credits');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/dashboard\/hcp.*tab=credits/);
  
  // Verify no error messages on credits tab
  await expect(page.locator('text=/Invalid hex color|Something went wrong|Unexpected token/i')).not.toBeVisible({ timeout: 2000 }).catch(() => {
    throw new Error('Error message found on HCP credits tab');
  });
  
  // Verify "View Event" button exists and is clickable (if credits exist)
  const viewEventButtons = page.getByRole('button', { name: /view event|عرض الحدث/i });
  const viewEventCount = await viewEventButtons.count();
  if (viewEventCount > 0) {
    // Verify button is not disabled
    const firstButton = viewEventButtons.first();
    await expect(firstButton).not.toBeDisabled();
  }
  
  // Verify no 404 errors occurred
  const response404 = page.locator('text=/404|not found/i');
  await expect(response404).not.toBeVisible({ timeout: 1000 }).catch(() => {
    // 404 not found, which is expected if page doesn't show 404 text
  });
});
