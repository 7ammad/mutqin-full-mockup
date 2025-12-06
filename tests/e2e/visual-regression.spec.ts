import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({
  baseURL: BASE_URL,
  trace: 'on-first-retry',
});

/**
 * Visual Regression Tests
 * 
 * These tests capture screenshots and validate visual consistency.
 * Run with: npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots
 * 
 * Reference: Playwright visual testing best practices
 */

test.describe('Visual Regression - HCP Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => (window as any).__mswReady === true);
  });

  test('HCP Registrations tab - full page screenshot', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=registrations');
    await page.waitForLoadState('networkidle');
    
    // Wait for content to load
    await page.waitForSelector('[class*="LiquidGlassCard"], [class*="Card"]', { timeout: 5000 }).catch(() => {
      // If no cards, that's okay - might be empty state
    });

    // Take full page screenshot
    await expect(page).toHaveScreenshot('hcp-registrations-full.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences
    });
  });

  test('HCP Registrations tab - ticket card detail', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=registrations');
    await page.waitForLoadState('networkidle');

    // Wait for ticket cards
    const ticketCard = page.locator('[class*="LiquidGlassCard"]').first();
    
    if (await ticketCard.count() > 0) {
      await expect(ticketCard).toHaveScreenshot('hcp-ticket-card.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('HCP Discovery tab - event grid layout', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=discover');
    await page.waitForLoadState('networkidle');

    // Wait for event grid
    await page.waitForSelector('[class*="grid"]', { timeout: 5000 });

    // Screenshot of event grid
    const eventGrid = page.locator('[class*="grid"]').first();
    await expect(eventGrid).toHaveScreenshot('hcp-discovery-grid.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - All Personas', () => {
  const personas = [
    { name: 'HCP', baseUrl: '/dashboard/hcp' },
    { name: 'Organizer', baseUrl: '/dashboard/organizer' },
    { name: 'Event Manager', baseUrl: '/dashboard/event-manager' },
    { name: 'Vendor', baseUrl: '/dashboard/vendor' },
    { name: 'Regulator', baseUrl: '/dashboard/regulator' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => (window as any).__mswReady === true);
  });

  for (const persona of personas) {
    test(`${persona.name} - dashboard overview`, async ({ page }) => {
      await page.goto(persona.baseUrl);
      await page.waitForLoadState('networkidle');

      // Wait for main content
      await page.waitForSelector('main, [role="main"]', { timeout: 5000 });

      await expect(page).toHaveScreenshot(`${persona.name.toLowerCase()}-dashboard.png`, {
        fullPage: true,
        maxDiffPixels: 200,
      });
    });
  }
});

